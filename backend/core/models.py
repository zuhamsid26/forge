from django.db import models


class TimeStampedModel(models.Model):
    """
    Abstract base model that provides self-managed
    created_at and updated_at fields.
    All Forge models (except User) inherit from this class
    to ensure consistent timestamp tracking across the entire
    database schema.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
