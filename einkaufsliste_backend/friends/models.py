from django.db import models

from users.models import NewUser

class Friend(models.Model):

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    initiator = models.ForeignKey(
        NewUser, on_delete=models.CASCADE, related_name="initiator"
    )
    friend = models.ForeignKey(NewUser, on_delete=models.CASCADE, related_name="friend")
    request_status = models.BooleanField(default=False)
