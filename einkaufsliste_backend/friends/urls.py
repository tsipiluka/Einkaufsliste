from django.urls import path
from friends.views import FriendsAccepted, FriendsPending, FriendsRequested, FriendAdd, FriendDelete

app_name = 'friends'

urlpatterns = [
    # path('friends/', friends, name='friends'),
    # path('friend_details/<int:id>/', friendDetails, name='friend'),
    path("accepted_friends/", FriendsAccepted.as_view(), name="friends_accepted"),
    path("pending_friends/", FriendsPending.as_view(), name="friends_pending"),
    path("requested_friends/", FriendsRequested.as_view(), name="friends_requested"),
    path("add_friend/<str:user_name>/", FriendAdd.as_view(), name="friend_add"),
    path("delete_friend/<int:id>/", FriendDelete.as_view(), name="friend_delete"),
    ]
