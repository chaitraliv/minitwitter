from django.shortcuts import render
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from main.models import UserData, TweetData, Follow
from main.serializers import UserSerializer, TweetSerializer, FollowSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.utils import timezone

# Create your views here.

@api_view(['POST'])
@csrf_exempt
def new_user_api(request):
    receivedtoken = request.data.get('token',None)
    print(receivedtoken)
    
    if receivedtoken is None:
         return Response(status= status.HTTP_504_GATEWAY_TIMEOUT)
    else:
        profiletoken = Token.objects.get(key= receivedtoken)
        user = profiletoken.user
        firstname = user.first_name
        lastname = user.last_name
        username = user.username
        user_bio = UserData.objects.get(user=user)
       
        data ={}
        data['firstname'] = firstname
        data['lastname'] = lastname
        data['username'] = username
        receivedbio = request.data.get('bio',None)
        receivedfirstname = request.data.get('firstname',None)
        receivedlastname = request.data.get('lastname',None)

        if receivedbio != 'edit' :
            if receivedfirstname is not None or receivedlastname is not None:
                user.first_name = receivedfirstname
                user.last_name = receivedlastname
                user.save()
                data['firstname'] = receivedfirstname
                data['lastname'] = receivedlastname
            user_bio.userbio=receivedbio
            user_bio.save()
            data['bio'] = user_bio.userbio
            
            return Response(data,status= status.HTTP_200_OK)      
                
        else:
            mybio = UserData.objects.get(user= user)
            data['bio']= mybio.userbio                 
            return Response(data,status= status.HTTP_200_OK)
        

        return Response(data)
          
    
        
@api_view(['POST'])
@csrf_exempt
def user_profile_api(request):
    received_token_ = request.data.get('token',None)
    print(received_token_)
    if received_token_ is None:
        return Response(status= status.HTTP_504_GATEWAY_TIMEOUT)
    else:
        #using received token to get the user related to it
        usertoken = Token.objects.get(key=received_token_)
        user = usertoken.user
        requireddata={}
        #retreiving data from the user, to send to UI
        requireddata['firstname'] = user.first_name
        requireddata['lastname'] = user.last_name
        requireddata['username'] = user.username
        #fetch the bio of the user
        user_bio = UserData.objects.get(user=user)
        requireddata['bio'] = user_bio.userbio
        #sending user's basic information to be set in the UI
       
        
        #Retriving all tweets of a particular user and sending it to be displayed after serializing
        usertweets = TweetData.objects.filter(user=user).order_by('-time_created')
        serializer = TweetSerializer(usertweets,many=True)
        #return the serialized tweets along with the basic information of user with status code       
        return Response([requireddata,serializer.data], status= status.HTTP_200_OK)


@api_view(["POST"])
@csrf_exempt

def following_api(request):
    #retrive token from the data
    receivedToken = request.data.get('token',None)
    print(receivedToken)
    
    #Proceed only if received token is not empty
    if receivedToken is not None:

        #retrive user related to that token
        followuser = Token.objects.get(key=receivedToken)
        currentUser = followuser.user

        #create object of the requested following user 
        followingobj = Follow.get_following(user=currentUser)
        output =[]
        
        for eachuser in followingobj:
           #for every user present in following object, retrive it's data
            serializer = UserSerializer(instance= eachuser)
            output.append(serializer.data)

       
        return Response([serializer.data,output],status= status.HTTP_200_OK)
    return Response(status= status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@csrf_exempt
def follower_api(request):
    #retrive the given token
    token = request.data.get('token',None)
    print(token)

    #Proceed only if received token is not empty
    if token is not None:

        #retrive user related to that token
        followertoken = Token.objects.get(key=token)
        currentuser_ = followertoken.user

        #create onject of the requested follower
        followerobj = Follow.get_follower(user=currentuser_)
        output_list=[]

        #for every id number present in follower object; which is a user, retrive it's data
        for i_d in followerobj:
            serializer = UserSerializer(instance=i_d)
            #get only the user name of the user, append it output list and send that list 
            output_list.append(serializer.data['username'])
            

        return Response(output_list,status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@csrf_exempt

def view_profile_api(request):
    #retrive the data from request
    requsteduser = request.data.get('otherUserName',None)
    token = request.data.get('token',None)
   

    #Proceed only if received token is not empty
    if token is not None:

        #from the received username, get the matching data of that user
        requsted_user = User.objects.get(username=requsteduser)
        
        requesteddata={}
        requesteddata['firstname']= requsted_user.first_name
        requesteddata['lastname']= requsted_user.last_name
        requesteddata['username']= requsted_user.username
        
        #retrive bio of that user,depending on its username
        requstedbio = UserData.objects.get(user=requsted_user.id)
      
        requesteddata['bio']= requstedbio.userbio
        # requested_user_id=(requsted_user.id)

        #retrive fields of that user depending on its username
        requestedtweets = TweetData.objects.filter(user= requsted_user).order_by('-time_created')
        alltweets= TweetSerializer(requestedtweets,many=True)

        #send the user information and tweets
        return Response([requesteddata,alltweets.data],status= status.HTTP_200_OK)
    return Response(status= status.HTTP_400_BAD_REQUEST)
