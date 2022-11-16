from django.http import JsonResponse
from rest_framework.decorators import api_view
from oauth2_provider.models import AccessToken
from friends.serializers import FriendSerializer
from friends.models import Friend
from shoppinglist.serializers import ShoppingListSerializer
from shoppinglist.models import ShoppingList
from users.models import NewUser
from rest_framework.response import Response
from rest_framework import status

def get_user_from_token(request):
    header = request.headers
    token = header.get('Authorization')
    try:
        access_token = AccessToken.objects.get(token=token)
        user = NewUser.objects.get(id=access_token.user_id)
        return user
    except AccessToken.DoesNotExist:
        return None

@api_view(['GET', 'POST'])
def friends(request):
    user = get_user_from_token(request)
    
    if user is None:
        return JsonResponse({'error': 'Unauthorized'}, status=401 )

    if request.method == 'GET':
        '''
        Returns all friends of the user where he is the initiator.
        '''
        friends = Friend.objects.filter(initiator=user)
        serializer = FriendSerializer(friends, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        serializer = FriendSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def friendDetails(request, id):
        
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    
        try:
            friend = Friend.objects.get(initiator=id)
        except Friend.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
        if request.method == 'GET':
            serializer = FriendSerializer(friend)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.method == 'PUT':
            serializer = FriendSerializer(friend, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.method == 'DELETE':
            friend.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)