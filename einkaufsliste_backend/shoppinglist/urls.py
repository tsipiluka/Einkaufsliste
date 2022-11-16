from django.urls import path
from .views import shoppingLists, shoppingListDetails

app_name = 'shoppinglist'

urlpatterns = [
    path('shoppinglists/', shoppingLists, name='shoppingLists'),
    path('shoppinglist_details/<int:id>/', shoppingListDetails, name='shoppingList'),
]