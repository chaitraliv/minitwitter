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
    #retrive the username and password from request.
    userName = request.data['userName']
    passWord = request.data['passWord']
    
    if userName is None or passWord is None:            #if fields are blank
        return Response(status= status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=userName, password=passWord)           #check if the login credentials are correct

    if user is None:            #if wrong login credentials
        return Response(status= status.HTTP_404_NOT_FOUND)
    
   #login is successful
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def registration_api(request):
    #retrive data from request
    username = request.data['username']
    password = request.data['password']
    firstname = request.data['firstname']
    lastname = request.data['lastname']
    email = request.data['email']

    #if any field is empty, raise error 
    if username is None or password is None or firstname is None or lastname is None or email is None:
        return Response(status= status.HTTP_400_BAD_REQUEST)

    #check if username already exists
    try:
        user = User.objects.get(username=username)

    except:         #if username is valid,save that information for that user 
        user = User.objects.create_user(username= username,
                                 email= email,
                                 password= password,
                                 first_name = firstname,
                                 last_name = lastname)
        user.save()
        token, created = Token.objects.get_or_create(user=user)         #create token for the user
        data = {}
        data['token']=token.key 
        serializer = UserSerializer(data)

        return Response(serializer, status= status.HTTP_201_CREATED)        #user is created

    return Response(serializer.errors,status= status.HTTP_226_IM_USED)          #user already taken 