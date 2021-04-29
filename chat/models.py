from django.db import models

from users.models import CustomUser


class Room(models.Model):
    users = models.ManyToManyField(CustomUser)
    name = models.CharField(max_length=36)

    def __str__(self):
        return self.name


class Message(models.Model):
    author = models.ForeignKey(
        CustomUser, related_name='author_messages', on_delete=models.CASCADE)
    room = models.ForeignKey(Room, null=True, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.full_name
