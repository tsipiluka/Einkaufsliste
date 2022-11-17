from rest_framework import serializers
from users.models import NewUser


class CustomUserSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = NewUser
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # as long as the fields are the same, we can just use this
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class WholeUserSerializer(serializers.ModelSerializer):
    """
    This serializer is used to return the whole user object.
    """
    class Meta:
        model = NewUser
        fields = ('id', 'email', 'username', 'first_name', 'start_date', 'about', 'is_active', 'is_active')

class LightUserSerializer(serializers.ModelSerializer):
    """
    This serializer is used to return the id and username of a user.
    """
    class Meta:
        model = NewUser
        fields = ('id', 'username')