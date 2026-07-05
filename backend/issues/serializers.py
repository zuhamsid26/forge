from rest_framework import serializers

from users.serializers import UserSerializer
from .models import Label, Issue, Comment, ActivityLog


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ["id", "workspace", "name", "color"]
        read_only_fields = ["id"]


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "issue", "author", "body", "created_at", "updated_at"]
        read_only_fields = ["id", "author", "created_at", "updated_at"]


class ActivityLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    issue_title = serializers.CharField(source="issue.title", read_only=True)

    class Meta:
        model = ActivityLog
        fields = ["id", "issue", "issue_title", "user", "action", "metadata", "created_at"]
        read_only_fields = ["id", "user", "created_at"]


class IssueSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    reporter = UserSerializer(read_only=True)
    labels = LabelSerializer(many=True, read_only=True)
    label_ids = serializers.PrimaryKeyRelatedField(
        source="labels", queryset=Label.objects.all(), many=True, write_only=True, required=False
    )

    class Meta:
        model = Issue
        fields = [
            "id", "project", "title", "description", "status", "priority",
            "assignee", "reporter", "due_date", "labels", "label_ids",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "reporter", "created_at", "updated_at"]
