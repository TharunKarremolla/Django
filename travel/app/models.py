from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.core.validators import MinLengthValidator
# Create your models here.


class Jobs(models.Model):
    title = models.CharField(max_length=100)
    description =  models.CharField(max_length=2000)
    company =  models.CharField(max_length=100)
    salary =  models.IntegerField()
    location = models.CharField(max_length=100)
    posted_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name="job", default=1)

class Application(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="applications")
    job = models.ForeignKey(Jobs,on_delete=models.CASCADE,related_name="job_id")
    applied_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "job") 
    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    pic = models.ImageField(upload_to='profile_pics/',blank=True,null=True,default='defaults/defaultProfile.png')
    bio = models.TextField(blank=True,null=True)


class Messages(models.Model):
    sender = models.ForeignKey(User,on_delete=models.CASCADE,related_name='sender')
    receiver = models.ForeignKey(User,on_delete=models.CASCADE,related_name='receiver')
    message = models.CharField()
    timestamp = models.DateTimeField(auto_now_add = True)


class Posts(models.Model):
    created_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name='created_by')
    created_at = models.DateTimeField(auto_now_add=True)
    feed = models.ImageField(upload_to='feed/',blank=True,null=True)
    caption = models.CharField(default='')


class CustomUserCreationForm(UserCreationForm):
    username = forms.CharField(
        max_length = 150,
        validators = [MinLengthValidator(5)],
        help_text="Required. Minimum 5 characters.",
    
    )

    class Meta: 
        model = User
        fields = ("username", "email", "password1", "password2")