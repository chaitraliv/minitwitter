from django.shortcuts import render
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.utils import timezone
from .models import UserData, TweetData, Follow
from .serializers import UserSerializer, TweetSerializer, FollowSerializer


# Create your views here.


'''
API to check login credentials of user and log him in. 
'''

@api_view(['POST'])
@csrf_exempt
def login_api(request):
    #retrive the username and password from request.
    userName = request.data.get('userName',None)
    passWord = request.data.get('passWord',None)
    
    
    if userName is None or passWord is None:                         #if fields are blank
        return Response(status= status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=userName, password=passWord)       #check if the login credentials are correct
    
    if user is None:                         #if wrong login credentials,no matching data found
        return Response(status= status.HTTP_404_NOT_FOUND)

    logintoken, created = Token.objects.get_or_create(user=user)
    data={}
    #Return the token again after registration
    data['token'] = logintoken.key   
         
    # login is successful
    return Response(data,status=status.HTTP_200_OK)


'''
API to register a new user, check if the requested username is available, if so register it.
'''


@api_view(['POST'])
@csrf_exempt
def registration_api(request):
    #retrive data from request
    username = request.data.get('username',None)
    password = request.data.get('password',None)
    firstname = request.data.get('firstname',None)
    lastname = request.data.get('lastname',None)
    email = request.data.get('email',None)

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
        token, created = Token.objects.get_or_create(user=user)         #create token for the user
        data = {}
        data['token']=token.key                                 #send the token to backend
        userdata = UserData.objects.create(user=user, userbio='create your bio')         #createe instance for that user
       
        return Response(data, status= status.HTTP_201_CREATED)        #user is created
    return Response(status= status.HTTP_226_IM_USED)          #user already taken 



'''
API to log out
'''

@api_view(['POST'])
@csrf_exempt
def menu_api(request):
    #retrive the given data from request
    receivedtoken = request.data.get('token',None)
 
    #if token is not received, log the user out
    if receivedtoken is  None:
        return Response(status= status.HTTP_504_GATEWAY_TIMEOUT)
    return Response(status= status.HTTP_200_OK)



'''
To follow the requested user from the current user's profile
and add that to the following list of current user
and current user to followers list of requested user
'''

@api_view(['POST'])
@csrf_exempt
def follow_unfollow_api(request):   
    
    receivedtoken = request.data.get('token',None)
    userto_follow = request.data.get('otheruser',None)

    if userto_follow != 'user' and receivedtoken is not None:
        #retrive current user from token received 
        followingtoken = Token.objects.get(key=receivedtoken)
        current_user = followingtoken.user
        

        #retrive object of user to be followed
        user_to_follow = User.objects.get(username=userto_follow)

        #check if already following
        following= Follow.objects.filter(user= current_user,followed= user_to_follow)
        is_following = True if following else False


        #if already following, unfollow him and set the negative value to is_following
        if is_following:
            Follow.unfollow(user= current_user,another_user=user_to_follow)
            is_following= False
            return Response(status= status.HTTP_200_OK)

        else:
            #if not following, follow the user

            Follow.follow(user= current_user,another_user=user_to_follow)
            #add the current user to requsted user's follower
            Follow.followers(user=user_to_follow,another_user=current_user)
            is_following = True
            return Response(status= status.HTTP_200_OK)
        return Response(status= status.HTTP_400_BAD_REQUEST)
    return Response(status= status.HTTP_400_BAD_REQUEST)



'''
API to save the posted tweet of logged user
'''

@api_view(['POST'])
@csrf_exempt
def tweet_api(request):
    receivedtweet = request.data.get('tweets',None)
    receivedtoken = request.data.get('token',None)
    
    if receivedtoken is not None:
            #else, get the user related to that token
            tweettoken = Token.objects.get(key=receivedtoken)  
            user = tweettoken.user

            #Check if tweet is not empty, only procced if it has some content
            if receivedtweet is not None:
                mytweet = TweetData(user= user, tweet=receivedtweet,time_created=timezone.now())
                mytweet.save()      #save the tweet for respective user
                return Response(status= status.HTTP_200_OK)  
    return Response(status= status.HTTP_400_BAD_REQUEST)        
                


'''
API to display list of all the available users who current user does not follow
'''

@api_view(['POST'])
@csrf_exempt
def all_users_api(request):
    receivedtoken = request.data.get('token',None)

    #Proceed only if received token is not empty
    if receivedtoken is not None:        
        all_user_token = Token.objects.get(key=receivedtoken)
        user= all_user_token.user    
        data={}

        #pass the username of that object
        data['username'] = user.username
        data['firstname'] = user.first_name
        data['lastname'] = user.last_name
        currentuser = user.username   #set that username name as current 
        

        '''Function to get list of all user's, the logged in user is
        not following'''

        def getAllUser(user_list):
            all_user_data={}
            counter=0
            for single_user in user_list:
                all_user_data[counter]= single_user.username 
                counter+=1
            return all_user_data

        # function to retrive following user's full name
        def getFullNames(user_List):
            user_full_name = {}
            counter1 = 0
            for every_user in user_List:
                user_full_name[counter1]= every_user.get_full_name()
                counter1 +=1
            return user_full_name

        #Exclude the following users from the list    
        try:
            following_users = Follow.get_following(user=user)
            all_users = User.objects.exclude(pk__in=following_users).exclude(username= user.username)
            all_users_data = getAllUser(all_users)
            user_fullnames = getFullNames(all_users)
            return Response([data,all_users_data,user_fullnames],status=status.HTTP_200_OK)

        #Else diaplay all the users from the database
        except:
            all_users = User.objects.all().exclude(username= currentuser)
            all_users_data = getAllUser(all_users)
            user_fullnames = getFullNames(all_users)
            return Response([data,all_users_data,user_fullnames],status=status.HTTP_200_OK)
    return Response(status= status.HTTP_400_BAD_REQUEST)

        


'''
To display posts (tweets) of the users; logged in user follows, and his own tweets.
'''

@api_view(['POST'])
@csrf_exempt
def timeline_api(request):

    #retrive the token from the request data
    token = request.data.get('token',None)

    #Proceed only if received token is not empty
    if token is not None:
        #Get the logged in user's object from the token
        timeline_token = Token.objects.get(key=token)
        current_user= timeline_token.user
        try:
            followingobj = Follow.get_following(user= current_user)
            all_tweets = TweetData.objects.all().order_by('-time_created')
            tweets=[]
            for tweet in all_tweets:
                if tweet.user in followingobj or tweet.user == current_user:
                    
                    serializer= TweetSerializer(tweet).data
                    serializer['username']= tweet.user.username
                    serializer['firstname'] = tweet.user.first_name
                    serializer['lastname'] = tweet.user.last_name
                    tweets.append(serializer)
            return Response(tweets,status= status.HTTP_200_OK)

        except:
            response_message={}
            response_message['message']='Your feed is empty. Start browsing!'
            return Response(data=response_message,status=status.HTTP_202_ACCEPTED)
    return Response(status=status.HTTP_400_BAD_REQUEST)

