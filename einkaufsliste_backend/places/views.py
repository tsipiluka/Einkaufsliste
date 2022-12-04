from django.shortcuts import render
import requests
from rest_framework.views import APIView
from sentry_sdk import capture_exception

from friends.views import get_user_from_token
from rest_framework.response import Response
from rest_framework import status

from core.read_secrets import ReadSecrets as rs
# Create your views here.



class ShoppingPlaces(APIView):
    def post(self, request):
        '''
        Implements the GET method for the NearShoppingPlaces API. 
        Returns a list of shopping places near the current user.
        '''
        user = get_user_from_token(request)
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        data = request.data
        lat = str(data['lat'])
        lon = str(data['lon'])
        key = rs.read_secrets("GOOGLE_PLACES_API_KEY")
        url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=supermarket,grocerystore,discounter&inputtype=textquery&locationbias=circle:1600@"+ lat + "," + lon + "&radius=16000&fields=formatted_address,name,geometry" +"&key=" + key
        result = requests.get(url)
        if not result.status_code == 200:
            capture_exception(Exception(result.json()))
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result.json(), status=status.HTTP_200_OK)

