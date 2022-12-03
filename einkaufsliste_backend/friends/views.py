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


class Friends(APIView):
    def get(self, request):
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        """
        Implements the GET method for the Friends API. Returns all friends of the user.
        """
        friends = Friend.objects.filter(initiator=user)
        serializer = FriendSerializer(friends, many=True)
        # get the user objects of the friends
        friends = []
        for friend in serializer.data:
            friends.append(NewUser.objects.get(id=friend["friend"]))
        # serialize the user objects
        try:
            serializer = LightUserSerializer(friends, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except NewUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class FriendAdd(APIView):
    def post(self, request, user_name):
        """
        Implements the POST method for the FriendAdd API. Returns an error
        if the user does not exist or if the user is already a friend.
        """
        user = get_user_from_token(request)
        try:
            friend = NewUser.objects.get(username=user_name)
            if Friend.objects.filter(initiator=user, friend=friend).exists():
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


class FriendDetails(APIView):
    def get(self, request, id):
        """
        Implements an endpoint to get a specific friendship of the
        currently logged in user. Returns an error if the friendship
        does not exist.

        The endpoint returns a JSON object containing:

        * id: The id of the friendship.
        * initiator: The id of the initiator of the friendship.
        * friend: The id of the friend of the friendship.
        """
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            friend = Friend.objects.get(id=id, initiator=user)
        except Friend.DoesNotExist as e:
            capture_exception(e)
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = FriendSerializer(friend)
        return JsonResponse(serializer.data, safe=False)

    def put(self, request, id):
        """
        Implements an endpoint to update a specific friend of the currently logged in user.

        The endpoint expects a JSON object containing:

        * friend: The id of the friend to be changed.
        """
        user = get_user_from_token(request)
        try:
            friend = Friend.objects.get(initiator=user, id=id)
        except Friend.DoesNotExist as e:
            capture_exception(e)
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = FriendSerializer(instance=friend, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, id):
        """
        Implements an endpoint to update a specific frienship relation
        of the currently logged in user. Expects the id of the friendship
        to be deleted in the URL. Returns an error if the friendship does
        not exist.
        """
        user = get_user_from_token(request)
        try:
            friend = Friend.objects.get(id=id, user=user)
            friend.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Friend.DoesNotExist as e:
            capture_exception(e)
            return Response(status=status.HTTP_404_NOT_FOUND)
