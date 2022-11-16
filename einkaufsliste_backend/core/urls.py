from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView

from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view

schema_view = swagger_get_schema_view(
    openapi.Info(
        title="Einkaufsliste API",
        default_version='v1',
        description="API for the Einkaufsliste app",
    ),
    public=True,
)


urlpatterns =  [
    path('auth/', include('drf_social_oauth2.urls', namespace='drf')), #OAuth
    path("admin/", admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    # path('api/user/', include('users.urls', namespace='users')), # User
    path('api/', include('shoppinglist.urls', namespace='shoppinglist')), # Shoppinglist
    path('api/', include('friends.urls', namespace='friends')), # Shoppinglist

    path('swagger/schema/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
]
