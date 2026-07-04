from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import WorkspaceViewSet, DashboardView

router = DefaultRouter()
router.register(r"", WorkspaceViewSet, basename="workspace")

urlpatterns = [
    path("<int:pk>/dashboard/", DashboardView.as_view(), name="workspace-dashboard"),
] + router.urls
