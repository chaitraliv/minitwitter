from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class UserData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    userbio = models.CharField(max_length=100)
    
class TweetData(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    tweet=models.CharField(max_length= 500)
    time_created = models.DateTimeField(auto_now_add=True)

class Follow(models.Model): #User I will follow
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    followed = models.ManyToManyField(User,related_name= 'followed')

    #Another user logged in user will follow
    @classmethod
    def follow(cls, user, another_user):
        obj, create = cls.objects.get_or_create(user=user)
        obj.followed.add(another_user)

    # @classmethod
    # def unfollow(cls, user, another_user):
    #     obj, create = cls.objects.get_or_create(user=user)
    #     obj.followed.remove(another_user)

    #to get following users of current user
    @classmethod
    def get_following(cls, user):
        followingobj,create = cls.objects.get_or_create(user=user)
        return followingobj.followed.all()