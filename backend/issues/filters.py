import django_filters

from .models import Issue


class IssueFilter(django_filters.FilterSet):
    workspace = django_filters.NumberFilter(field_name="project__workspace_id")

    class Meta:
        model = Issue
        fields = ["project", "status", "priority", "assignee", "workspace"]