from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TweetData,UserData, Follow

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name','username',]

class TweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = TweetData
        fields = ['user','tweet','time_created',]

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = '__all__'
