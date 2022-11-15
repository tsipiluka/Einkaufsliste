from django.contrib import admin
from .models import ShoppingList, ShoppingListEntry, Contributor

admin.site.register(ShoppingList)
admin.site.register(ShoppingListEntry)
admin.site.register(Contributor)