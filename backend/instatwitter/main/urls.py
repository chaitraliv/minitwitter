from django.urls import path,include
from .views import (
    login_api, registration_api, create_user_profile_api, 
    menu_api,username_api,user_profile_api,following_api,follower_api,
    view_profile_api)
urlpatterns = [
    path('LoginPage/',login_api),
    path('RegistrationPage/',registration_api),
    path('NewUser/',create_user_profile_api),
    path('CreateEditProfile/',create_user_profile_api),
    path('Menu/',menu_api),
    path('UserProfile/',user_profile_api),
    path('HomePage/',username_api),
    path('Followings/',following_api),
    path('Followers/',follower_api),
    path('OtherUserProfile/',view_profile_api),
]