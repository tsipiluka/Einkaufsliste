import os
import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from sentry_sdk import capture_exception
from .serializers import CustomUserSerializer, WholeUserSerializer, LightUserSerializer
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
    except AccessToken.DoesNotExist as e:
        capture_exception(e)
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
        except NewUser.DoesNotExist as e:
            capture_exception(e)
            return Response(status=status.HTTP_404_NOT_FOUND)

class UserInformationLight(APIView):
    permission_classes = (AllowAny,)
    
    def get(self, request, id):
        '''
        Implements an endpoint to get the information of the user with the given id.

        The endpoint returns a JSON object containing:
        * id: The id of the user.
        * username: The email of the user.
        '''
        user = user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            try:
                user = NewUser.objects.get(id=id)
                serializer = LightUserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except NewUser.DoesNotExist as e:
                capture_exception(e)
                return Response(status=status.HTTP_404_NOT_FOUND)

class UserInformationLightByName(APIView):
    def get(self, request, username):
        '''
        Implements an endpoint to get the information of the
        user with the given username. In case the user is not found,
        the endpoint returns a 404 status code.

        The endpoint returns a JSON object containing:
        * id: The id of the user.
        * username: The username of the user.
        '''
        user = user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            try:
                user = NewUser.objects.get(username=username)
                serializer = LightUserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except NewUser.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

class UserList(APIView):
    permission_classes = (AllowAny,)
    
    def get(self, request):
        '''
        Implements an endpoint to get a list of all users.

        The endpoint returns a JSON object containing:
        * id: The id of the user.
        * username: The username of the user.
        '''
        user = user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            users = NewUser.objects.all()
            serializer = LightUserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class CustomUserCreate(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, format='json'):
        '''
        Implements an endpoint to create a new user apart from login with Google.

        The endpoint expects a JSON object containing:
        * email: The email of the user.
        * username: The username of the user.
        * Password: The password of the user.

        '''
        serializer = CustomUserSerializer(data=request.data)
        # get email from serializer

        if serializer.is_valid():
            user = serializer.save()
            if user:
                try:
                    r = requests.post(os.environ.get('BACKEND_URL') + 'auth/token' , data={
                        'grant_type': 'password',
                        'username': user.email,
                        'password': request.data['password'],
                        'client_id': os.environ.get('DJANGO_APP_CLIENT_ID'),
                        'client_secret': os.environ.get('DJANGO_APP_CLIENT_SECRET'),
                    })
                except requests.exceptions.RequestException as e:
                    capture_exception(e)
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                return Response(r.json(), status=status.HTTP_201_CREATED)
        capture_exception(Exception(serializer.errors))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        