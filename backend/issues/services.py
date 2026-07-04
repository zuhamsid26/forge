from django.core.exceptions import ValidationError

from workspaces.services import WorkspaceService
from .models import Issue


class IssueService:
    """
    Encapsulates business rules around Issue creation/assignment that
    shouldn't live directly in a view/serializer.
    """

    @staticmethod
    def validate_assignee(*, issue_or_project, assignee):
        """
        Ensures the assignee is actually a member of the workspace that
        owns this issue's project. Raises ValidationError if not.
        Accepts either an Issue instance or a Project instance, since
        we need this check both before creating an Issue (only have a
        Project) and before updating one (have the Issue).
        """
        if assignee is None:
            return  # unassigned is always valid

        project = issue_or_project.project if isinstance(issue_or_project, Issue) else issue_or_project
        workspace = project.workspace

        if not WorkspaceService.is_member(workspace=workspace, user=assignee):
            raise ValidationError(
                f"{assignee} is not a member of workspace '{workspace.name}' "
                f"and cannot be assigned to this issue."
            )

    @staticmethod
    def create_issue(*, project, title, reporter, assignee=None, **extra_fields):
        IssueService.validate_assignee(issue_or_project=project, assignee=assignee)
        return Issue.objects.create(
            project=project, title=title, reporter=reporter, assignee=assignee, **extra_fields
        )

    @staticmethod
    def reassign_issue(*, issue, new_assignee):
        IssueService.validate_assignee(issue_or_project=issue, assignee=new_assignee)
        issue.assignee = new_assignee
        issue.save(update_fields=["assignee", "updated_at"])
        return issue
