from django.db import models

from users.models import NewUser


class ShoppingList(models.Model):
    # make mame required
    name = models.CharField(max_length=200, blank=False)
    description = models.CharField(max_length=400)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(NewUser, on_delete=models.CASCADE)
    def __str__(self):
        return self.name

class ShoppingListEntry(models.Model):
    # STATUS = [("1" ,"open"), ("2", "closed"), ("3", "in_progess")]
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    status = models.BooleanField(default=False)
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE)
    creator = models.ForeignKey(NewUser, on_delete=models.CASCADE)
    assignee = models.ForeignKey(NewUser, on_delete=models.CASCADE, related_name="assignee", null=True, blank=True)
    def __str__(self):
        return self.name

class ShoppingListContributor(models.Model):
    contributor = models.ForeignKey(NewUser, on_delete=models.CASCADE)
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE)