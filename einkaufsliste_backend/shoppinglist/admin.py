from django.contrib import admin
from .models import ShoppingList, ShoppingListEntry, ShoppingListContributor

admin.site.register(ShoppingList)
admin.site.register(ShoppingListEntry)
admin.site.register(ShoppingListContributor)