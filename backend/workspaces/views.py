from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import viewsets, permissions

from .models import Workspace, WorkspaceMember
from .serializers import WorkspaceSerializer, WorkspaceMemberSerializer
from .services import WorkspaceService, DashboardService
from .dashboard_serializers import DashboardStatsSerializer


class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show workspaces the current user is a member of
        return Workspace.objects.filter(members__user=self.request.user).distinct()

    def perform_create(self, serializer):
        workspace = WorkspaceService.create_workspace(
            name=serializer.validated_data["name"],
            owner=self.request.user,
        )
        serializer.instance = workspace


class WorkspaceMemberViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WorkspaceMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkspaceMember.objects.filter(workspace_id=self.kwargs["workspace_pk"])


class DashboardView(generics.GenericAPIView):
    """
    GET /api/workspaces/{id}/dashboard/
    Returns aggregated stats for a single workspace via DashboardService.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DashboardStatsSerializer

    def get(self, request, pk=None):
        workspace = get_object_or_404(
            Workspace.objects.filter(members__user=request.user), pk=pk
        )
        stats = DashboardService.get_workspace_stats(workspace=workspace)
        serializer = self.get_serializer(stats)
        return Response(serializer.data)
