from django.urls import path,include
from .views import login_api, registration_api
urlpatterns = [
    path('LoginPage/',login_api),
    path('RegistrationPage/',registration_api)
]