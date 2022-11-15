from django.http import JsonResponse
from rest_framework.decorators import api_view
import json
from oauth2_provider.models import AccessToken
from shoppinglist.serializers import ShoppingListSerializer
from shoppinglist.models import ShoppingList
from users.models import NewUser


def get_user_from_token(request):
    header = request.headers
    token = header.get('Authorization')
    try:
        access_token = AccessToken.objects.get(token=token)
        user = NewUser.objects.get(id=access_token.user_id)
        return user
    except AccessToken.DoesNotExist:
        return None

@api_view(['GET', 'POST', 'PUT', 'DELETE'])      
def shoppingLists(request):
    # header = request.headers
    # token = header.get('Authorization')
    # django_token = AccessToken.objects.get(key=token)
    # user = NewUser.objects.get(id=django_token.user_id)
    user = get_user_from_token(request)
    
    if user is None:
        return JsonResponse({'error': 'User not found'}, status=404)

    if request.method == 'GET':
        shopping_lists = ShoppingList.objects.filter(owner=user)
        serializer = ShoppingListSerializer(shopping_lists, many=True)
        return JsonResponse(serializer.data, safe=False)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])      
def shoppingList(request, shopping_list_id):
    user = get_user_from_token(request)
    if user is None:
        return JsonResponse({'error': 'User not found'}, status=404)

    if request.method == 'GET':
        shopping_list = user.shopping_lists.get(id=shopping_list_id)
        return JsonResponse(shopping_list.to_json())