from rest_framework import serializers

from issues.serializers import ActivityLogSerializer


class DashboardStatsSerializer(serializers.Serializer):
    total_projects = serializers.IntegerField()
    active_projects = serializers.IntegerField()
    total_issues = serializers.IntegerField()
    issues_by_status = serializers.DictField()
    issues_by_priority = serializers.DictField()
    overdue_issues = serializers.IntegerField()
    recent_activity = ActivityLogSerializer(many=True)
