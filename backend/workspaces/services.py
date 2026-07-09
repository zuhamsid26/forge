from django.db import transaction
from django.db.models import Count
from django.utils import timezone

from core.choices import WorkspaceRole, IssueStatus
from .models import Workspace, WorkspaceMember

from django.core.exceptions import ValidationError
from users.models import User


class WorkspaceService:
    """
    Encapsulates business rules around Workspace creation and membership
    that shouldn't live directly in a view/serializer.
    """

    @staticmethod
    @transaction.atomic
    def create_workspace(*, name, owner):
        workspace = Workspace.objects.create(name=name, owner=owner)
        WorkspaceMember.objects.create(
            workspace=workspace,
            user=owner,
            role=WorkspaceRole.ADMIN,
        )
        return workspace

    @staticmethod
    def is_admin(*, workspace, user):
        return WorkspaceMember.objects.filter(
            workspace=workspace, user=user, role=WorkspaceRole.ADMIN
        ).exists()

    @staticmethod
    def is_member(*, workspace, user):
        return WorkspaceMember.objects.filter(workspace=workspace, user=user).exists()
    
    @staticmethod
    @transaction.atomic
    def add_member(*, workspace, username, added_by):
        if not WorkspaceService.is_admin(workspace=workspace, user=added_by):
            raise ValidationError("Only workspace admins can add members.")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise ValidationError(f"No user found with username '{username}'.")

        if WorkspaceService.is_member(workspace=workspace, user=user):
            raise ValidationError(f"{user.username} is already a member of this workspace.")

        return WorkspaceMember.objects.create(
            workspace=workspace, user=user, role=WorkspaceRole.MEMBER,
        )


class DashboardService:
    """
    Aggregates cross-model stats for a single workspace's dashboard.
    Kept separate from WorkspaceService since it's a read-only reporting
    concern, not a workspace lifecycle/membership concern.
    """

    @staticmethod
    def get_workspace_stats(*, workspace):
        # Local imports avoid a circular import: projects/issues import
        # from workspaces.models, so workspaces can't import them at module level.
        from projects.models import Project
        from issues.models import Issue, ActivityLog

        projects = Project.objects.filter(workspace=workspace)
        issues = Issue.objects.filter(project__workspace=workspace)

        status_counts = dict(
            issues.values_list("status").annotate(count=Count("id")).order_by()
        )
        priority_counts = dict(
            issues.values_list("priority").annotate(count=Count("id")).order_by()
        )
        overdue_count = issues.filter(
            due_date__lt=timezone.now().date()
        ).exclude(status=IssueStatus.DONE).count()

        recent_activity = ActivityLog.objects.filter(
            issue__project__workspace=workspace
        ).select_related("user", "issue").order_by("-created_at")[:10]

        return {
            "total_projects": projects.count(),
            "active_projects": projects.filter(archived=False).count(),
            "total_issues": issues.count(),
            "issues_by_status": status_counts,
            "issues_by_priority": priority_counts,
            "overdue_issues": overdue_count,
            "recent_activity": recent_activity,
        }
