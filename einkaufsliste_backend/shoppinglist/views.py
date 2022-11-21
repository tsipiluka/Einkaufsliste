from shoppinglist.serializers import ShoppingListSerializer, ShoppingListEntrySerializer, ShoppingListContributorSerializer
from shoppinglist.models import ShoppingList, ShoppingListEntry, ShoppingListContributor
from users.models import NewUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from users.serializers import LightUserSerializer
from shoppinglist.utils import get_user_from_token, check_user_owner_contribution


class ShoppingLists(APIView):

    def get(self, request):
        '''
        Implements the GET method for the ShoppingLists API.
        Returns a list of all shopping lists where the user
        is a contributor.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        # contributor lists
        shopping_list_contributors = ShoppingListContributor.objects.filter(contributor=user)
        shopping_lists = [slc.shopping_list for slc in shopping_list_contributors]
        # owner lists
        shopping_lists_owner = ShoppingList.objects.filter(owner=user)
        shopping_lists = list(set(shopping_lists + list(shopping_lists_owner)))
        try:
            serializer = ShoppingListSerializer(shopping_lists, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
            





    def post(self, request):
        """
        Implements an endpoint to create a new shopping list in the 
        context of the currently logged in user. Adds the user as
        contributor to the shopping list.

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
            # add the user to the contributors of the shopping list
            shopping_list = ShoppingList.objects.get(id=serializer.data['id'])
            shopping_list_contributor = ShoppingListContributor(
                shopping_list=shopping_list, contributor=user)
            shopping_list_contributor.save()

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
            shopping_list = ShoppingList.objects.get(id=id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if check_user_owner_contribution(user, shopping_list):
            serializer = ShoppingListSerializer(shopping_list)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

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

        for field in serializer.initial_data:
            if field not in request.data:
                serializer.initial_data[field] = getattr(shopping_list, field)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        '''
        Implements an endpoint to delete a specific shopping list.
        Only the owner of the shopping list can delete it.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            shopping_list = ShoppingList.objects.get(id=id, owner=user)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # check if the user is the owner of the shopping list
        if shopping_list.owner != user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            shopping_list.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


class ShoppingListEntries(APIView):
    def get(self, request, id):
        '''
        Implements the GET method for the ShoppingListEntries API. 
        Returns all shopping list entries for the given shopping list id
        if the user is a contributor or owner of the shopping list.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            shopping_list = ShoppingList.objects.get(id=id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if check_user_owner_contribution(user, shopping_list):
            shopping_list_entries = ShoppingListEntry.objects.filter(
                shopping_list=shopping_list)
            serializer = ShoppingListEntrySerializer(
                shopping_list_entries, many=True)

            for entry in serializer.data:
                if entry['assignee'] is not None:
                    entry['assignee'] = LightUserSerializer(
                        NewUser.objects.get(id=entry['assignee'])).data
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class ShoppingListEntryAdd(APIView):
    def post(self, request, id):
        """
        Implements an endpoint to create a new shopping list entry in 
        the context of the currently logged in user if he is the owner
        of the shopping list or a contributor.

        The endpoint expects a JSON object containing:

        * name: The name of the shopping list entry.
        * status: The status of the shopping list entry.
        * shopping_list: The shopping list the entry belongs to.
        * creator: The creator of the shopping list entry.

        Optional fields:
        * assignee: The assignee of the shopping list entry.
        """
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if check_user_owner_contribution(user, shopping_list):
            serializer = ShoppingListEntrySerializer(data=request.data)

            serializer.initial_data['creator'] = user.id
            serializer.initial_data['shopping_list'] = id

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class ShoppingListEntryDetails(APIView):
    def get(self, request, shopping_list_id, entry_id):
        '''
        Implements an endpoint to get a specific shopping list
        entry of the currently logged in user if he is the owner
        of the shopping list or a contributor.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=shopping_list_id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if check_user_owner_contribution(user, shopping_list):
            try:
                entry = ShoppingListEntry.objects.get(
                    id=entry_id, shopping_list=shopping_list)
            except ShoppingListEntry.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            serializer = ShoppingListEntrySerializer(entry)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request, shopping_list_id, entry_id):
        '''
        Implements an endpoint to update a specific shopping list entry
        of the currently logged in user if he is the owner of the shopping list or a contributor.

        The endpoint expects a JSON object containing at least one of the following fields:

        * name: The name of the shopping list entry
        * status: The status of the shopping list entry
        * assignee: The assignee of the shopping list entry
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=shopping_list_id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if check_user_owner_contribution(user, shopping_list):
            try:
                entry = ShoppingListEntry.objects.get(
                    id=entry_id, shopping_list=shopping_list)
            except ShoppingListEntry.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            serializer = ShoppingListEntrySerializer(entry, data=request.data)
            serializer.initial_data['shopping_list'] = shopping_list_id
            serializer.initial_data['creator'] = user.id

            for field in serializer.fields:
                if field not in serializer.initial_data:
                    serializer.initial_data[field] = getattr(entry, field)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, shopping_list_id, entry_id):
        '''
        Implements an endpoint to delete a specific shopping list
        entry of the currently logged in user if he is the owner 
        of the shopping list or a contributor.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=shopping_list_id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if check_user_owner_contribution(user, shopping_list):
            try:
                entry = ShoppingListEntry.objects.get(
                    id=entry_id, shopping_list=shopping_list)
            except ShoppingListEntry.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            entry.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class ShoppingListContributors(APIView):
    def get(self, request, id):
        '''
        Implements an endpoint to get all contributors of a specific shopping list if
        the currently logged in user is the owner of the shopping list or a contributor.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = ShoppingList.objects.get(id=id)
        except ShoppingList.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if check_user_owner_contribution(user, shopping_list):
            contributors = ShoppingListContributor.objects.filter(
                shopping_list=shopping_list)
            users = []
            for contributor in contributors:
                users.append(contributor.contributor)

            # serialize the user objects
            try:
                user_serializer = LightUserSerializer(users, many=True)
            except:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(user_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, shopping_list_id):
        '''
        Implements an endpoint to add a new contributor to a specific shopping
         list of the currently logged in user if he is the owner of the shopping list.

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
        # set serializer data shopping_list as shopping_list_id
        serializer.initial_data['shopping_list'] = shopping_list_id

        # check if user is already a contributor
        if not ShoppingListContributor.objects.filter(shopping_list=shopping_list, contributor=serializer.initial_data['contributor']).exists():
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, shopping_list_id):
        '''
        Implements an endpoint to remove a contributor from a specific shopping list of the currently 
        logged in user if he is the owner of the shopping list.

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
            contributor = ShoppingListContributor.objects.get(
                user=serializer.validated_data['user'], shopping_list=serializer.validated_data['shopping_list'])
            contributor.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
