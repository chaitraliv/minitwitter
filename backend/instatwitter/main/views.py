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
    #retrive the token 
    received_token = request.data.get('token',None)
    print(received_token)
    
    #Proceed only if received token is not empty
    if received_token is not None:
        usernametoken = Token.objects.get(key= received_token)
        user = usernametoken.user
        data={}
        data['username'] = user.username
        data['firstname'] = user.first_name
        data['lastname'] = user.last_name


        usertweets=[]

        mefollowing = Follow.get_following(user= user)
        for each_user in mefollowing:
            myuser= UserSerializer(instance=each_user)
            user_tweets= TweetData.objects.filter(user=each_user).order_by('-time_created')
            serializer= TweetSerializer(user_tweets,many=True)
            usertweets.append(serializer.data)
        print(usertweets)

        return Response(usertweets,status= status.HTTP_200_OK)

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
        

        return Response(data)
    
   
    

@api_view(['POST'])
@csrf_exempt
def menu_api(request):
    #retrive the given data from request
    receivedtoken = request.data.get('token',None)
    receivedtweet = request.data.get('tweets',None)
    userto_follow = request.data.get('otheruser',None)
    status_flag = request.data.get('viewFlag',None)
    print(receivedtoken)

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
            #add the current user to requsted user's follower
            Follow.followers(user=user_to_follow,another_user=current_user)
            is_following = True
            return Response(status= status.HTTP_200_OK)
        return Response(status= status.HTTP_400_BAD_REQUEST)            #already following
       
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
    #check if flag is set    
    elif  status_flag is True:
        return Response(status= status.HTTP_200_OK)
    
        
    
        


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

