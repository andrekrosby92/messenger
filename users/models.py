from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import CustomUserManager

DEFAULT_AVATAR = 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg'


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(max_length=254, unique=True)
    avatar = models.URLField(default=DEFAULT_AVATAR)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'
