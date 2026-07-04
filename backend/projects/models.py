from django.conf import settings
from django.db import models

from core.models import TimeStampedModel
from workspaces.models import Workspace


class Project(TimeStampedModel):
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="projects",
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=64, blank=True)
    color = models.CharField(max_length=7, default="#6366F1")
    archived = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_projects",
    )

    def __str__(self):
        return f"{self.name} ({self.workspace.name})"
