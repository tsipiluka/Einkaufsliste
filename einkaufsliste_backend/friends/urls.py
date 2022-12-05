from django.urls import path
from .views import FriendAdd, Friends, FriendDetails, FriendDelete

app_name = 'friends'

urlpatterns = [
    # path('friends/', friends, name='friends'),
    # path('friend_details/<int:id>/', friendDetails, name='friend'),
    path("friends/", Friends.as_view(), name="friends"),
    path("friends/<int:id>/", FriendDetails.as_view(), name="friends_details"),
    path("friend/<str:user_name>/", FriendAdd.as_view(), name="friend_add"),
    path("friends/<int:friend_id>/", FriendDelete.as_view(), name="friend_delete"),
]
