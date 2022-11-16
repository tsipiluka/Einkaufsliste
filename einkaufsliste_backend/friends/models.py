from django.db import models

from users.models import NewUser

# Create your models here.

class Friend(models.Model):
    # make mame required

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    initiator = models.ForeignKey(NewUser, on_delete=models.CASCADE, related_name="initiator")
    # friend unlike initiator
    friend = models.ForeignKey(NewUser, on_delete=models.CASCADE, related_name="friend")
    if initiator == friend:
        raise ValueError("You can't be friends with yourself!")
    