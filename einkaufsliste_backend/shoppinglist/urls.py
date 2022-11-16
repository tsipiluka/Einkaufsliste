from django.urls import path
from .views import ShoppingLists, ShoppingListDetails, ShoppingListEntries, ShoppingListEntryAdd, ShoppingListEntryDetails, ShoppingListContributors

app_name = 'shoppinglist'

urlpatterns = [
    path('shoppinglists/', ShoppingLists.as_view(), name='shoppinglists'),
    path('shoppinglist/<int:id>/', ShoppingListDetails.as_view(), name='shoppinglist_details'),
    path('shoppinglist/<int:id>/entries/', ShoppingListEntries.as_view(), name='shoppinglist_entries'),
    path('shoppinglist/<int:id>/entries/add/', ShoppingListEntryAdd.as_view(), name='shoppinglist_entry_add'),
    path('shoppinglist/entry/<int:entry_id>/', ShoppingListEntryDetails.as_view(), name='shoppinglist_entry_details'),
    path('shoppinglist/<int:id>/contributors/', ShoppingListContributors.as_view(), name='shoppinglist_contributors'),
    path('shoppinglist/<int:id>/contributors/add/', ShoppingListContributors.as_view(), name='shoppinglist_contributors_add'),
    path('shoppinglist/contributor/<int:contributor_id>', ShoppingListContributors.as_view(), name='shoppinglist_contributors_remove'),
]