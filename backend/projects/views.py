from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["workspace", "archived"]

    def get_queryset(self):
        return Project.objects.filter(workspace__members__user=self.request.user).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def archive(self, request, pk=None):
        project = self.get_object()
        project.archived = True
        project.save(update_fields=["archived", "updated_at"])
        return Response(self.get_serializer(project).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def unarchive(self, request, pk=None):
        project = self.get_object()
        project.archived = False
        project.save(update_fields=["archived", "updated_at"])
        return Response(self.get_serializer(project).data, status=status.HTTP_200_OK)
