from django.urls import path
from .views import CustomUserCreate, UserInformation, UserInformationLight, UserList

app_name = 'users'

urlpatterns = [
    path('create/', CustomUserCreate.as_view(), name="create_user"),
    path('information/', UserInformation.as_view(), name="user_information"),
    path('information/<int:id>/', UserInformationLight.as_view(), name="user_information_light"),
    path('list/', UserList.as_view(), name="user_list"),
]