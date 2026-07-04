from rest_framework import serializers

from users.serializers import UserSerializer
from .models import Workspace, WorkspaceMember


class WorkspaceMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = WorkspaceMember
        fields = ["id", "user", "role", "created_at"]


class WorkspaceSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Workspace
        fields = ["id", "name", "owner", "member_count", "created_at", "updated_at"]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def get_member_count(self, obj):
        return obj.members.count()
