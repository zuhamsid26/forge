from rest_framework import viewsets, permissions
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError

from .models import Label, Issue, Comment, ActivityLog
from .serializers import LabelSerializer, IssueSerializer, CommentSerializer, ActivityLogSerializer
from .filters import IssueFilter
from .services import IssueService
from core.choices import ActivityAction

from django.db.models import Case, When, Value, IntegerField


class LabelViewSet(viewsets.ModelViewSet):
    serializer_class = LabelSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["workspace"]

    def get_queryset(self):
        return Label.objects.filter(workspace__members__user=self.request.user).distinct()


class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = IssueFilter
    ordering_fields = ["created_at", "updated_at", "due_date", "priority_rank"]
    search_fields = ["title", "description"]

    def get_queryset(self):
        priority_rank = Case(
            When(priority="LOW", then=Value(1)),
            When(priority="MEDIUM", then=Value(2)),
            When(priority="HIGH", then=Value(3)),
            When(priority="CRITICAL", then=Value(4)),
            output_field=IntegerField(),
        )
        return (
            Issue.objects.filter(project__workspace__members__user=self.request.user)
            .annotate(priority_rank=priority_rank)
            .distinct()
        )

    def perform_create(self, serializer):
        assignee = serializer.validated_data.get("assignee")
        project = serializer.validated_data["project"]
        try:
            IssueService.validate_assignee(issue_or_project=project, assignee=assignee)
        except DjangoValidationError as e:
            raise DRFValidationError(e.messages)

        issue = serializer.save(reporter=self.request.user)
        ActivityLog.objects.create(issue=issue, user=self.request.user, action=ActivityAction.CREATED)

    def perform_update(self, serializer):
        assignee = serializer.validated_data.get("assignee", serializer.instance.assignee)
        try:
            IssueService.validate_assignee(issue_or_project=serializer.instance, assignee=assignee)
        except DjangoValidationError as e:
            raise DRFValidationError(e.messages)
        serializer.save()


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["issue"]

    def get_queryset(self):
        return Comment.objects.filter(issue__project__workspace__members__user=self.request.user).distinct().order_by("created_at")

    def perform_create(self, serializer):
        issue = serializer.validated_data["issue"]
        serializer.save(author=self.request.user)
        ActivityLog.objects.create(issue=issue, user=self.request.user, action=ActivityAction.COMMENTED)


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["issue"]

    def get_queryset(self):
        return (
            ActivityLog.objects.filter(issue__project__workspace__members__user=self.request.user)
            .distinct()
            .order_by("-created_at")
        )