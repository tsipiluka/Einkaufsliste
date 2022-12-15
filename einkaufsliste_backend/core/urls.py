from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView

from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view

schema_view = swagger_get_schema_view(
    openapi.Info(
        title="Einkaufsliste API Documentation",
        default_version='v1',
        description="API for the Einkaufsliste app",
    ),
    public=True,

)

urlpatterns =  [
    path('auth/', include('custom_auth.urls', namespace='drf')), # custom OAuth
    path("admin/", admin.site.urls),
    path('api/', include('shoppinglist.urls', namespace='shoppinglist')), # Shoppinglist
    path('api/', include('friends.urls', namespace='friends')), # Shoppinglist
    path('swagger/schema/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
    path('user/', include('users.urls', namespace='users')),
    path('places/', include('places.urls', namespace='places')),
    path('', include('django_prometheus.urls')),
]