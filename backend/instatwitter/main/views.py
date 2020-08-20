from django.shortcuts import render
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

# Create your views here.

@api_view(['POST'])
def login_api(request):
    userName = request.data['userName']
    passWord = request.data['passWord']
    
    if userName is None or passWord is None:
        return Response(status= status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=userName, password=passWord)
    if user is None:
        return Response(data={'message':'Wrong or invalid login credentials '}, status= status.HTTP_404_NOT_FOUND)
    
    # serializer = UserSerializer(user)
    return Response(data={'message' : 'Welcome'},status=status.HTTP_200_OK)


@api_view(['POST'])
def registration_api(request):
    username = request.data['username']
    password = request.data['password']
    firstname = request.data['firstname']
    lastname = request.data['lastname']
    email = request.data['email']

    if username is None or password is None or firstname is None or lastname is None or email is None:
        return Response(status= status.HTTP_205_RESET_CONTENT)

    try:
        user = User.objects.get(username=username)

    except:
        user = User.objects.create_user(username= username,
                                 email= email,
                                 password= password,
                                 first_name = firstname,
                                 last_name = lastname)
        user.save()
        token, created = Token.objects.get_or_create(user=user)
        data = {}
        data['token']=token.key 
        return Response(data, status= status.HTTP_201_CREATED)
    return Response(status= status.HTTP_226_IM_USED)