from rest_framework import serializers
from .models import ShoppingList, ShoppingListEntry, ShoppingListContributor


class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ('id', 'name', 'description', 'owner')

class ShoppingListEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListEntry
        fields = ('id', 'name', 'status', 'shopping_list', 'creator')

class ShoppingListContributorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListContributor
        fields = ('id', 'contributor', 'shopping_list')