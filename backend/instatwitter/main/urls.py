from django.urls import path,include
from .views import (
    login_api, registration_api,  
    menu_api,home_page_api)
urlpatterns = [
    path('LoginPage/',login_api),
    path('RegistrationPage/',registration_api),
    path('HomePage/',home_page_api),
    path('Menu/',menu_api),
    
]