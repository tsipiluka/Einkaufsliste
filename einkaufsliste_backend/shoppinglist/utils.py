
from oauth2_provider.models import AccessToken
from users.models import NewUser
from shoppinglist.models import ShoppingListContributor

def get_user_from_token(request):
    header = request.headers
    token = header.get('Authorization')
    try:
        access_token = AccessToken.objects.get(token=token)
        user = NewUser.objects.get(id=access_token.user_id)
        return user
    except AccessToken.DoesNotExist:
        return None

def check_user_owner_contribution(user, shopping_list):
    if user == shopping_list.owner or ShoppingListContributor.objects.filter(shopping_list=shopping_list, contributor=user).exists():
        return True
    else:
        return False