from django.conf import settings
from django.db import models

from core.models import TimeStampedModel
from core.choices import IssueStatus, IssuePriority, ActivityAction
from workspaces.models import Workspace
from projects.models import Project


class Label(TimeStampedModel):
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="labels",
    )
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default="#94A3B8")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["workspace", "name"], name="unique_label_per_workspace"),
        ]

    def __str__(self):
        return self.name


class Issue(TimeStampedModel):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="issues",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=IssueStatus.choices, default=IssueStatus.TODO)
    priority = models.CharField(max_length=20, choices=IssuePriority.choices, default=IssuePriority.MEDIUM)
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_issues",
    )
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reported_issues",
    )
    due_date = models.DateField(null=True, blank=True)
    labels = models.ManyToManyField(Label, related_name="issues", blank=True)

    def __str__(self):
        return self.title


class Comment(TimeStampedModel):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    body = models.TextField()

    def __str__(self):
        return f"Comment by {self.author} on {self.issue}"


class ActivityLog(TimeStampedModel):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name="activity_log")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="activity_entries")
    action = models.CharField(max_length=20, choices=ActivityAction.choices)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.action} on {self.issue} by {self.user}"
