from django.http import JsonResponse
from rest_framework.decorators import api_view
from oauth2_provider.models import AccessToken
from shoppinglist.serializers import ShoppingListSerializer, ShoppingListEntrySerializer, ShoppingListContributorSerializer
from shoppinglist.models import ShoppingList, ShoppingListEntry, ShoppingListContributor
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
        # set the owner of the shopping list to the currently logged in user
        serializer.initial_data['owner'] = user.id
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
        # for every field that is not set in the request, set it to the value of the existing shopping list
        for field in serializer.initial_data:
            if field not in request.data:
                serializer.initial_data[field] = getattr(shopping_list, field)
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

class ShoppingListEntries(APIView):        
    def get(self, request, id):
        '''
        Implements the GET method for the ShoppingListEntries API. Returns all shopping list entries for the given shopping list id.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        entries = ShoppingListEntry.objects.filter(shopping_list=id)
        serializer = ShoppingListEntrySerializer(entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ShoppingListEntryAdd(APIView):
    def post(self, request, id):
        """
        Implements an endpoint to create a new shopping list entry in the context of the currently logged in user if he is the owner of the shopping list or a contributor.

        The endpoint expects a JSON object containing:

        * name: The name of the shopping list entry.
        * status: The status of the shopping list entry.
        * shopping_list: The shopping list the entry belongs to.
        * creator: The creator of the shopping list entry.
        """
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user != shopping_list.owner and not ShoppingListContributor.objects.filter(shopping_list=shopping_list, user=user).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = ShoppingListEntrySerializer(data=request.data)
        # set the creator of the shopping list entry to the currently logged in user
        serializer.initial_data['creator'] = user.id
        # set the shopping list of the shopping list entry to the given shopping list id
        serializer.initial_data['shopping_list'] = id
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class ShoppingListEntryDetails(APIView):
    def get(self, request, shopping_list_id, entry_id):
        '''
        Implements an endpoint to get a specific shopping list entry of the currently logged in user if he is the owner of the shopping list or a contributor.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=shopping_list_id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user != shopping_list.owner and not ShoppingListContributor.objects.filter(shopping_list=shopping_list, user=user).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            entry = ShoppingListEntry.objects.get(id=entry_id, shopping_list=shopping_list)
        except ShoppingListEntry.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ShoppingListEntrySerializer(entry)
        return Response(serializer.data)

    def put(self, request, shopping_list_id, entry_id):
        '''
        Implements an endpoint to update a specific shopping list entry of the currently logged in user if he is the owner of the shopping list or a contributor.

        The endpoint expects a JSON object containing at least one of the following fields:

        * name: The name of the shopping list entry
        * status: The status of the shopping list entry
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=shopping_list_id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user != shopping_list.owner and not ShoppingListContributor.objects.filter(shopping_list=shopping_list, user=user).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            entry = ShoppingListEntry.objects.get(id=entry_id, shopping_list=shopping_list)
        except ShoppingListEntry.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ShoppingListEntrySerializer(entry, data=request.data)
        # TESTING NEEDED
        for field in serializer.fields:
            if field not in serializer.initial_data:
                serializer.initial_data[field] = getattr(entry, field)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, shopping_list_id, entry_id):
        '''
        Implements an endpoint to delete a specific shopping list entry of the currently logged in user if he is the owner of the shopping list or a contributor.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=shopping_list_id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user != shopping_list.owner and not ShoppingListContributor.objects.filter(shopping_list=shopping_list, user=user).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            entry = ShoppingListEntry.objects.get(id=entry_id, shopping_list=shopping_list)
        except ShoppingListEntry.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ShoppingListContributors(APIView):
    def get(self, request, shopping_list_id):
        '''
        Implements an endpoint to get all contributors of a specific shopping list if the currently logged in user is the owner of the shopping list or a contributor.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            shopping_list = ShoppingList.objects.get(id=shopping_list_id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user != shopping_list.owner and not ShoppingListContributor.objects.filter(shopping_list=shopping_list, user=user).exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        contributors = ShoppingListContributor.objects.filter(shopping_list=shopping_list)
        serializer = ShoppingListContributorSerializer(contributors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, shopping_list_id):
        '''
        Implements an endpoint to add a new contributor to a specific shopping list of the currently logged in user if he is the owner of the shopping list.

        The endpoint expects a JSON object containing:

        * user: The user to add as a contributor.
        * shopping_list: The shopping list to add the contributor to.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=shopping_list_id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user != shopping_list.owner:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = ShoppingListContributorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, shopping_list_id):
        '''
        Implements an endpoint to remove a contributor from a specific shopping list of the currently logged in user if he is the owner of the shopping list.

        The endpoint expects a JSON object containing:

        * user: The user to remove as a contributor.
        * shopping_list: The shopping list to remove the contributor from.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=shopping_list_id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user != shopping_list.owner:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = ShoppingListContributorSerializer(data=request.data)
        if serializer.is_valid():
            contributor = ShoppingListContributor.objects.get(user=serializer.validated_data['user'], shopping_list=serializer.validated_data['shopping_list'])
            contributor.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)