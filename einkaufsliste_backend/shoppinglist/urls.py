from django.urls import path
from .views import ShoppingLists, ShoppingListDetails

app_name = 'shoppinglist'

urlpatterns = [
    path('shoppinglists/', ShoppingLists.as_view(), name='shoppinglists'),
    path('shoppinglists/<int:id>/', ShoppingListDetails.as_view(), name='shoppinglists_details'),
]