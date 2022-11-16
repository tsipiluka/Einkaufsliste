from django.http import JsonResponse
from rest_framework.decorators import api_view
import json
from oauth2_provider.models import AccessToken
from shoppinglist.serializers import ShoppingListSerializer
from shoppinglist.models import ShoppingList
from users.models import NewUser
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

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
def shoppingLists(request):
    """
    An endpoint used
    """
    user = get_user_from_token(request)
    
    if user is None:
        return JsonResponse({'error': 'Unauthorized'}, status=401 )

    if request.method == 'GET':
        shopping_lists = ShoppingList.objects.filter(owner=user)
        serializer = ShoppingListSerializer(shopping_lists, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        serializer = ShoppingListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])      
def shoppingList(request, id):
    
    user = get_user_from_token(request)
    if user is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:
        shoppingList = ShoppingList.objects.get(pk=id)
    except ShoppingList.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ShoppingListSerializer(shoppingList)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        serializer = ShoppingListSerializer(shoppingList, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        shoppingList.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



