from rest_framework.routers import DefaultRouter

from .views import LabelViewSet, IssueViewSet, CommentViewSet, ActivityLogViewSet

router = DefaultRouter()
router.register(r"labels", LabelViewSet, basename="label")
router.register(r"comments", CommentViewSet, basename="comment")
router.register(r"activity", ActivityLogViewSet, basename="activity")
router.register(r"", IssueViewSet, basename="issue")

urlpatterns = router.urls
