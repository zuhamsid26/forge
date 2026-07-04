from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    - Uses email as the primary login identifier (not username).
    - username is kept for display/profile purposes.
    - avatar stores a URL (no file upload complexity in v1).
    - updated_at is added directly to avoid MRO conflicts with AbstractUser,
      which already manages its own primary key and date_joined field.
    """
    email = models.EmailField(unique=True)
    avatar = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email
