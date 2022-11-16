from django.urls import path
from .views import friends, friendDetails

app_name = 'shoppinglist'

urlpatterns = [
    path('friends/', friends, name='friends'),
    path('friend_details/<int:id>/', friendDetails, name='friend'),
]