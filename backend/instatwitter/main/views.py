from django.shortcuts import render
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .models import UserData, TweetData, Follow
from .serializers import UserSerializer, TweetSerializer, FollowSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.utils import timezone


# Create your views here.



@api_view(['POST'])
@csrf_exempt
def login_api(request):
    #retrive the username and password from request.
    userName = request.data.get('userName',None)
    passWord = request.data.get('passWord',None)
    print(userName,passWord)
    if userName is None or passWord is None:                         #if fields are blank
        return Response(status= status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=userName, password=passWord)       #check if the login credentials are correct
    
    if user is None:                         #if wrong login credentials,no matching data found
        return Response(status= status.HTTP_404_NOT_FOUND)

    logintoken, created = Token.objects.get_or_create(user=user)
    data={}
    data['token'] = logintoken.key   
         
    # login is successful
    return Response(data,status=status.HTTP_200_OK)
    


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
        data['token']=token.key 
        userdata = UserData.objects.create(user=user, userbio='create your bio')
       
        return Response(data, status= status.HTTP_201_CREATED)        #user is created
    return Response(status= status.HTTP_226_IM_USED)          #user already taken 


@api_view(['POST'])
@csrf_exempt
def username_api(request):
    received_token = request.data.get('token',None)
    
    if received_token is not None:
        usernametoken = Token.objects.get(key= received_token)
        user = usernametoken.user
        data={}
        data['username'] = user.username
        data['firstname'] = user.first_name
        data['lastname'] = user.last_name

        return Response(data,status= status.HTTP_200_OK)
    return Response(status= status.HTTP_504_GATEWAY_TIMEOUT)



@api_view(['POST'])
@csrf_exempt
def create_user_profile_api(request):
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
        # userbio = UserData.objects.update
        data ={}
        data['firstname'] = firstname
        data['lastname'] = lastname
        data['username'] = username
        receivedbio = request.data.get('bio',None)
        if receivedbio is not None :
            
            user_bio.userbio=receivedbio
            user_bio.save()
            data['bio'] = user_bio.userbio
            return Response(data,status= status.HTTP_200_OK)
        else:
            mybio = UserData.objects.get(user= user)
            data['bio']= mybio.userbio
            print('\n',mybio.userbio)
            return Response(data,status= status.HTTP_200_OK)
        return Response(data)
    
   
    

@api_view(['POST'])
@csrf_exempt
def menu_api(request):
    #retrive the given data from request
    receivedtoken = request.data.get('token',None)
    receivedtweet = request.data.get('tweets',None)
    userto_follow = request.data.get('otheruser',None)

    # print(receivedtoken)
    # print(userto_follow)
    #if token is not received, do not proceed
    if receivedtoken is None:
        return Response(status= status.HTTP_504_GATEWAY_TIMEOUT)
    elif userto_follow != 'user' and receivedtoken is not None:
        # print('\n',userto_follow, receivedtoken)
    
        #retrive current user from token received 
        followingtoken = Token.objects.get(key=receivedtoken)
        current_user = followingtoken.user

        #retrive onject of user to be followed
        user_to_follow = User.objects.get(username=userto_follow)

        #check if already following
        following= Follow.objects.filter(user=current_user,followed= user_to_follow)
        is_following = True if following else False

        # if current_user is not user_to_follow:
            #if already following, promt so and set the negative value to is_following
        if is_following:
            is_following= False
            return Response(status= status.HTTP_406_NOT_ACCEPTABLE)
        else:
                #if not following, follow the user
            Follow.follow(user= current_user,another_user=user_to_follow)
            print('Followed')
            # Follow.save()
            is_following = True
            return Response(status= status.HTTP_200_OK)
        return Response(status= status.HTTP_400_BAD_REQUEST)            #self follow
       
    elif receivedtoken is not None:
        #else, get the user related to that toek
        tweettoken = Token.objects.get(key=receivedtoken)  
        user = tweettoken.user
        data={}
        #pass the username of that object
        data['username'] = user.username
        currentuser = user.username   #set that username name as current 
        #get a list of all the users present, except the logged in one
        myusers = User.objects.values_list('username',flat=True).exclude(username=currentuser)  

        #Check if tweet is not empty, only procced if it has some content
        if receivedtweet is not None:
            mytweet = TweetData(user= user, tweet=receivedtweet,time_created=timezone.now())
            mytweet.save()      #save the tweet for respective user

            #return a list of all users and username of current user along with appropriate response code
            return Response([data,myusers],status= status.HTTP_200_OK)          
        return Response([data,myusers])     #otherwise send the same data without status code, resulting failure.
    
        
    
        


@api_view(['POST'])
@csrf_exempt
def user_profile_api(request):
    received_token_ = request.data.get('token',None)
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
        usertweets = TweetData.objects.filter(user=user)
        serializer = TweetSerializer(usertweets,many=True)
        #return the serialized tweets along with the basic information of user with status code       
        return Response([requireddata,serializer.data], status= status.HTTP_200_OK)


@api_view(["POST"])
@csrf_exempt

def following_api(request):
    receivedToken = request.data.get('token',None)
    print(receivedToken)

    if receivedToken is not None:
        followuser = Token.objects.get(key=receivedToken)
        currentUser = followuser.user
        followingobj = Follow.objects.get(user=currentUser)
        serializer = FollowSerializer(instance=followingobj)
        print('200')
        followers_id = serializer.data['followed']
        output =[]
        for id in followers_id:
            print(id)
            follower = User.objects.get(pk=id)
            serializer = UserSerializer(instance= follower)
            output.append(serializer.data)

       
        return Response([serializer.data,output],status= status.HTTP_200_OK)
    return Response(status= status.HTTP_400_BAD_REQUEST)




