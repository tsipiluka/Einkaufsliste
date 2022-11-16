from django.http import JsonResponse
from rest_framework.decorators import api_view
from oauth2_provider.models import AccessToken
from shoppinglist.serializers import ShoppingListSerializer
from shoppinglist.models import ShoppingList
from users.models import NewUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

def get_user_from_token(request):
    header = request.headers
    token = header.get('Authorization')
    try:
        access_token = AccessToken.objects.get(token=token)
        user = NewUser.objects.get(id=access_token.user_id)
        return user
    except AccessToken.DoesNotExist:
        return None

class ShoppingLists(APIView):
        
        def get(self, request):
            '''
            Implements the GET method for the ShoppingLists API. Returns all shopping lists of the user.
            '''
            user = get_user_from_token(request)

            shopping_lists = ShoppingList.objects.filter(owner=user)
            serializer = ShoppingListSerializer(shopping_lists, many=True)
            return JsonResponse(serializer.data, safe=False)
        
        def post(self, request):
            """
            Implements an endpoint to create a new shopping list in the context of the currently logged in user.

            The endpoint expects a JSON object containing:

            * name: The name of the shopping list.
            * description: The description of the shopping list.
            """
            user = get_user_from_token(request)
            if user is None:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            serializer = ShoppingListSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShoppingListDetails(APIView):
      
    def get(self, request, id):
        '''
        Implements an endpoint to get a specific shopping list of the currently logged in user.
        '''
        user = get_user_from_token(request)
        if user is None:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
                shopping_list = ShoppingList.objects.get(id=id, owner=user)
        except ShoppingList.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ShoppingListSerializer(shopping_list)
        return Response(serializer.data)
    
    def put(self, request, id):
        '''
        Implements an endpoint to update a specific shopping list of the currently logged in user.

        The endpoint expects a JSON object containing at least one of the following fields:

        * name: The name of the shopping list
        * description: The description of the shopping list
        '''
        user = get_user_from_token(request)
        if user is None:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
                shopping_list = ShoppingList.objects.get(id=id, owner=user)
        except ShoppingList.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ShoppingListSerializer(shopping_list, data=request.data)
        if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        '''
        Implements an endpoint to delete a specific shopping list of the currently logged in user.
        '''
        user = get_user_from_token(request)
        if user is None:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
                shopping_list = ShoppingList.objects.get(id=id, owner=user)
        except ShoppingList.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        shopping_list.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
