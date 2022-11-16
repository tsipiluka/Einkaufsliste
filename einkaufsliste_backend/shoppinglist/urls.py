from django.urls import path
from .views import shoppingLists, shoppingList

app_name = 'shoppinglist'

urlpatterns = [
    path('shoppinglists/', shoppingLists, name='shoppingLists'),
    path('shoppinglist/<int:id>/', shoppingList, name='shoppingList'),
]