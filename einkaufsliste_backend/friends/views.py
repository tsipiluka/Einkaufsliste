from django.http import JsonResponse
from rest_framework.decorators import api_view
from oauth2_provider.models import AccessToken
from users.serializers import LightUserSerializer
from sentry_sdk import capture_exception
from friends.serializers import FriendSerializer
from friends.models import Friend
from rest_framework.views import APIView
from users.models import NewUser
from rest_framework.response import Response
from rest_framework import status


def get_user_from_token(request):
    """
    Get user from token of the current request.
    """
    header = request.headers
    token = header.get("Authorization")
    try:
        access_token = AccessToken.objects.get(token=token)
        user = NewUser.objects.get(id=access_token.user_id)
        return user
    except AccessToken.DoesNotExist as e:
        capture_exception(e)
        return None


class FriendsAccepted(APIView):

    def get(self, request):
        """
        Endpoint to get all friends of the currently
        logged in user, where the user is either the initiator
        or the friend and the request_status is True.
        """
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        friends = Friend.objects.filter(
            initiator=user, request_status=True
        ) | Friend.objects.filter(friend=user, request_status=True)
        serializer = FriendSerializer(friends, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)




class FriendsPending(APIView):
    
    def get(self, request):
        """
        Endpoint to get all pending friend requests of the currently
        logged in user, where the user is the initiator and the 
        request_status is False.
        """
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        friends = Friend.objects.filter(initiator=user, request_status=False)
        serializer = FriendSerializer(friends, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FriendsRequested(APIView):

    def get(self, request):
        """
        Endpoint to get all pending friend requests of the currently
        logged in user, where the user is the friend and the 
        request_status is False.
        """
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        friends = Friend.objects.filter(friend=user, request_status=False)
        serializer = FriendSerializer(friends, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FriendAdd(APIView):

    def post(self, request, user_name):
        """
        Implements the POST method for the FriendAdd API. Returns an error
        if the user does not exist or if the user is already a friend.
        """
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            friend = NewUser.objects.get(username=user_name)
            if Friend.objects.filter(initiator=user, friend=friend).exists() or Friend.objects.filter(initiator=friend, friend=user).exists():
                return Response(
                    {"error": "User is already a friend"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # check if the friend is the user itself
            if user == friend:
                return Response(
                    {"error": "You cannot add yourself as a friend"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            Friend.objects.create(initiator=user, friend=friend)
            return Response({"success": "Friend added"}, status=status.HTTP_201_CREATED)
        except NewUser.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST
            )


class FriendDelete(APIView):
    
        def delete(self, request, id):
            """
            Implements the DELETE method to delete a friend. A User can
            delete it if he is the initiator or the friend no matter 
            what the request_status is.
            """
            user = get_user_from_token(request)
            if user is None:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            try:
                friend = Friend.objects.get(id=id)
                if friend.initiator == user or friend.friend == user:
                    friend.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response(
                        {"error": "User is not a friend"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except Friend.DoesNotExist:
                return Response(
                    {"error": "Friend does not exist"}, status=status.HTTP_400_BAD_REQUEST
                )


class FriendRequestAccept(APIView):

    def put(self, request, id):
        """
        Implements an endpoint to accept a friend request.
        Expects the id of the friend to be accepted in the URL.
        The user is the friend and the request_status is False.
        """
        user = get_user_from_token(request)
        try:
            friend = Friend.objects.get(friend=user, id=id, request_status=False)
            friend.request_status = True
            friend.save()
            return Response(status=status.HTTP_200_OK)
        except Friend.DoesNotExist as e:
            capture_exception(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)