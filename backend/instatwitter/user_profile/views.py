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
    
    
    #Proceed only is 
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

        if receivedbio is not None :
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
        

        return Response(data=data)
          
    
        
@api_view(['POST'])
@csrf_exempt
def user_profile_api(request):
    received_token_ = request.data.get('token',None)
    # print(received_token_)
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
    # print(receivedToken)
    
    #Proceed only if received token is not empty
    if receivedToken is not None:

        #retrive user related to that token
        followuser = Token.objects.get(key=receivedToken)
        currentUser = followuser.user

        try:#create object of the requested following user 
            followingobj = Follow.get_following(user=currentUser)
            output =[]
            
            for eachuser in followingobj:
            #for every user present in following object, retrive it's data
                serializer = UserSerializer(instance= eachuser)
                output.append(serializer.data)
                # print(output)
            return Response([serializer.data,output],status= status.HTTP_200_OK)
        except:
            data={}
            data['message']= 'Start following !!'
            return Response(data,status=status.HTTP_204_NO_CONTENT)
    return Response(status= status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@csrf_exempt
def follower_api(request):
    #retrive the given token
    token = request.data.get('token',None)
    # print(token)

    #Proceed only if received token is not empty
    if token is not None:

        #retrive user related to that token
        followertoken = Token.objects.get(key=token)
        current_user = followertoken.user


        try:
            #create onject of the requested follower
            followerobj = Follow.get_follower(user=current_user)
            output_list=[]

            #for every id number present in follower object; which is a user, retrive it's data
            for i_d in followerobj:
                serializer = UserSerializer(instance=i_d)
                #get only the user name of the user, append it output list and send that list 
                output_list.append(serializer.data['username'])
            return Response(output_list,status=status.HTTP_200_OK)
        except:
            data={'message':'Help people find you !'}
            return Response(data,status=status.HTTP_204_NO_CONTENT)

    return Response(data,status=status.HTTP_400_BAD_REQUEST)



'''
API for displaying user's profile containing, 
it's full name,username and tweets made by him.
'''
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
        
        requested_data={}
        requested_data['firstname']= requsted_user.first_name
        requested_data['lastname']= requsted_user.last_name
        requested_data['username']= requsted_user.username
        
        #retrive bio of that user,depending on its username
        requsted_bio = UserData.objects.get(user=requsted_user.id)
      
        requested_data['bio']= requsted_bio.userbio
        # requested_user_id=(requsted_user.id)

        try:
            #retrive tweets of that user depending on its username
            requested_tweets = TweetData.objects.filter(user= requsted_user).order_by('-time_created')
            all_tweets= TweetSerializer(requested_tweets,many=True)
            #send the user information and tweets
            return Response([requested_data,all_tweets.data],status= status.HTTP_200_OK)
        except:
            response_message={'message':'Start tweeting !'}
            return Response([requested_data,response_message],status= status.HTTP_204_NO_CONTENT)

    return Response(status= status.HTTP_400_BAD_REQUEST)


'''
API to unfollow requested user.
'''
@api_view(['POST'])
@csrf_exempt
def unfollow_api(request):
    token = request.data.get('token',None)
    userto_unfollow = request.data.get('otheruser',None)

    if token is not None:
        unfollow_token = Token.objects.get(key=token)
        current_user = unfollow_token.user
        user_to_unfollow = User.objects.get(username=userto_unfollow)

        #check if already following
        following= Follow.objects.filter(user= current_user,followed= user_to_unfollow)
        is_following = True if following else False


        #if already following, unfollow him and set the negative value to is_following
        if is_following:
            Follow.unfollow(user= current_user,another_user=user_to_unfollow)
            is_following= False
            return Response(status= status.HTTP_200_OK)


@api_view(['POST'])
@csrf_exempt
def follow_api(request):
    token = request.data.get('token',None)
    userto_follow = request.data.get('otheruser',None)

    if token is not None:
        follow_token = Token.objects.get(key=token)
        current_user = follow_token.user
        user_to_follow = User.objects.get(username=userto_follow)

        #check if already following
        following= Follow.objects.filter(user= current_user,followed= user_to_follow)
        is_following = True if following else False


        #if already following, unfollow him and set the negative value to is_following
        if is_following:
            # Follow.unfollow(user= current_user,another_user=user_to_unfollow)
            
            is_following= False
            return Response(status= status.HTTP_208_ALREADY_REPORTED)
        else:
            Follow.follow(user=current_user,another_user=user_to_follow)
            return Response(status= status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)



