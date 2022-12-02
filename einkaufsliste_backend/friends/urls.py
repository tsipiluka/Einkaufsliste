from django.urls import path
from .views import Friends, FriendDetails

app_name = 'friends'

urlpatterns = [
    # path('friends/', friends, name='friends'),
    # path('friend_details/<int:id>/', friendDetails, name='friend'),
    path('friends/', Friends.as_view(), name='friends'),
    path('friends/<int:id>/', FriendDetails.as_view(), name='friends_details'),
]