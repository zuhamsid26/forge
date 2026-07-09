from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import WorkspaceViewSet, WorkspaceMemberViewSet, DashboardView

router = DefaultRouter()
router.register(r"", WorkspaceViewSet, basename="workspace")

urlpatterns = [
    path("<int:pk>/dashboard/", DashboardView.as_view(), name="workspace-dashboard"),
    path("<int:workspace_pk>/members/", WorkspaceMemberViewSet.as_view({"get": "list", "post": "create"}), name="workspace-members"),
] + router.urls