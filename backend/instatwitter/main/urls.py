from django.urls import path,include
from .views import (
    login_api, registration_api,  
    menu_api,timeline_api,
    follow_unfollow_api,
    tweet_api,all_users_api)
urlpatterns = [
    path('LoginPage/',login_api),
    path('RegistrationPage/',registration_api),
    path('HomePage/',timeline_api),
    path('Menu/',menu_api),
    path('Menu/Follow/',follow_unfollow_api),
    path('Menu/Tweets/',tweet_api),
    path('Menu/Allusers/',all_users_api),
]