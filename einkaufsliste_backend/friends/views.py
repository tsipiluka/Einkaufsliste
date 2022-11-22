from django.http import JsonResponse
from rest_framework.decorators import api_view
from oauth2_provider.models import AccessToken
from sentry_sdk import capture_exception
from friends.serializers import FriendSerializer
from friends.models import Friend
from rest_framework.views import APIView
from users.models import NewUser
from rest_framework.response import Response
from rest_framework import status

def get_user_from_token(request):
    '''
    Get user from token of the current request.
    '''
    header = request.headers
    token = header.get('Authorization')
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
        '''
        Implements the GET method for the Friends API. Returns all friends of the user.
        '''
        friends = Friend.objects.filter(initiator=user)
        serializer = FriendSerializer(friends, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    def post(self, request):
        """
        Implements an endpoint to create a new friend in the context 
        of the currently logged in user. Returns an error if the user
        is already a friend of the other user.

        The endpoint expects a JSON object containing:

        * friend: The id of the friend to be added.
        """
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = FriendSerializer(data=request.data)
        # check if friendship already exists
        if not Friend.objects.filter(initiator=user, friend=request.data['friend']).exists():
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            capture_exception(Exception(serializer.errors))
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            capture_exception(Exception('Friendship already exists'))
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
class FriendDetails(APIView):
 
    def get(self, request, id):
        '''
        Implements an endpoint to get a specific friendship of the
        currently logged in user. Returns an error if the friendship
        does not exist.

        The endpoint returns a JSON object containing:

        * id: The id of the friendship.
        * initiator: The id of the initiator of the friendship.
        * friend: The id of the friend of the friendship.
        '''
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
        '''
        Implements an endpoint to update a specific friend of the currently logged in user.

        The endpoint expects a JSON object containing:

        * friend: The id of the friend to be changed.
        '''
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
        '''
        Implements an endpoint to update a specific frienship relation
        of the currently logged in user. Expects the id of the friendship
        to be deleted in the URL. Returns an error if the friendship does
        not exist.
        '''
        user = get_user_from_token(request)
        try:
            friend = Friend.objects.get(id=id, user=user)
            friend.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Friend.DoesNotExist as e:
            capture_exception(e)
            return Response(status=status.HTTP_404_NOT_FOUND)
