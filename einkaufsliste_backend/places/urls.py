from django.urls import path
from .views import *

app_name = 'places'

urlpatterns = [
    path('shoppingplaces/', ShoppingPlaces.as_view(), name='shoppingplaces'),
]