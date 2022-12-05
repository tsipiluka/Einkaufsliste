from django.urls import path
from .views import ShoppingLists, ShoppingListDetails, ShoppingListEntries, ShoppingListEntryAdd, ShoppingListEntryDetails, ShoppingListContributors, LeaveShoppingList

app_name = 'shoppinglist'

urlpatterns = [
    path('shoppinglists/', ShoppingLists.as_view(), name='shoppinglists'),
    path('shoppinglist/<int:id>/', ShoppingListDetails.as_view(), name='shoppinglist_details'),
    path('shoppinglist/<int:id>/entries/', ShoppingListEntries.as_view(), name='shoppinglist_entries'),
    path('shoppinglist/<int:id>/entry/', ShoppingListEntryAdd.as_view(), name='shoppinglist_entry_add'),
    path('shoppinglist/<int:shopping_list_id>/entry/<int:entry_id>/', ShoppingListEntryDetails.as_view(), name='shoppinglist_entry_details'),
    path('shoppinglist/<int:id>/contributors/', ShoppingListContributors.as_view(), name='shoppinglist_contributors'),
    path('shoppinglist/<int:shopping_list_id>/contributor/', ShoppingListContributors.as_view(), name='shoppinglist_contributors_add'),
    path('shoppinglist/contributor/<int:contributor_id>', ShoppingListContributors.as_view(), name='shoppinglist_contributors_remove'),
    path('shoppinglist/<int:shopping_list_id>/contribution/', LeaveShoppingList.as_view(), name='shoppinglist_contribution_remove'),
]