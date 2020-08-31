from django.contrib import admin

from .models import UserData, TweetData, Follow
# Register your models here.
admin.site.register(UserData)
admin.site.register(TweetData)
admin.site.register(Follow)

