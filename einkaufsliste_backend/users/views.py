from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomUserSerializer, WholeUserSerializer
from rest_framework.permissions import AllowAny

from oauth2_provider.models import AccessToken
from users.models import NewUser

def user_from_token(request):
    header = request.headers
    token = header.get('Authorization')
    try:
        access_token = AccessToken.objects.get(token=token)
        user = NewUser.objects.get(id=access_token.user_id)
        return user
    except AccessToken.DoesNotExist:
        return None

class UserInformation(APIView):
    permission_classes = (AllowAny,)
    
    def get(self, request):
        '''
        Implements an endpoint to get the information of the currently logged in user.

        The endpoint returns a JSON object containing:
        * id: The id of the user.
        * email: The email of the user.
        * username: The username of the user.
        * first_name: The first name of the user.
        * start_date: The date when the user registered.
        * about: The about text of the user.
        '''
        try:
            user = user_from_token(request)
            serializer = WholeUserSerializer(user)
            if user is None:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response(serializer.data, status=status.HTTP_200_OK)
        except NewUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CustomUserCreate(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format='json'):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        