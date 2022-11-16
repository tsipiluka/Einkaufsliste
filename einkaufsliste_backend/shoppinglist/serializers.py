from rest_framework import serializers
from .models import ShoppingList, ShoppingListEntry, Contributor


class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ('id', 'name', 'description', 'owner')

class ShoppingListEntry(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListEntry
        fields = ('id', 'name', 'status', 'shopping_list', 'creator')