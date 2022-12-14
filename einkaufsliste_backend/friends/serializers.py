from rest_framework import serializers
from friends.models import Friend
from users.serializers import LightUserSerializer


class FriendSerializer(serializers.ModelSerializer):

    initiator = LightUserSerializer()
    friend = LightUserSerializer()
    class Meta:
        model = Friend
        fields = "__all__"