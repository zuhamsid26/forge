from django.contrib import admin
from .models import Label, Issue, Comment, ActivityLog

admin.site.register(Label)
admin.site.register(Issue)
admin.site.register(Comment)
admin.site.register(ActivityLog)
