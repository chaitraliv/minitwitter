from django.urls import path,include
from .views import ( 
    new_user_api, user_profile_api,
    following_api,follower_api,
    view_profile_api,follow_api,
    unfollow_api
    )
from main.views import follow_unfollow_api

urlpatterns = [
    path('NewUser/',new_user_api),
    path('CreateEditProfile/',new_user_api),    
    path('UserProfile/',user_profile_api),    
    path('Followings/',following_api),
    path('Followers/',follower_api),
    path('Followings/Unfollow/',unfollow_api),
    path('Followers/Follow/',follow_api),
    path('OtherUserProfile/',view_profile_api),
]