from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_GET
from django.db.models import Q
from django.contrib.auth import authenticate,login,logout
from rest_framework.decorators import api_view
import json
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse, HttpResponse
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.views.decorators.csrf import csrf_exempt
from .models import Jobs,Application,Profile,Messages,Posts,CustomUserCreationForm
from datetime import datetime
import re 
import random

def get_posts(request):
    posts = Posts.objects.select_related('created_by').order_by('created_at')
    current_user = list(Profile.objects.filter(user_id = request.user.id).values())
    
    result = []
    for post in posts:
        profile = Profile.objects.filter(user_id = post.created_by).first()
        date_only = post.created_at.strftime("%Y-%m-%d %H:%M:%S")
        
        result.append({
            'id' : post.id,
            'caption' : post.caption,
            'feed' : post.feed.url if post.feed else None,
            'created_at' : date_only,
            'username' : post.created_by.username ,
            'profile_pic' : profile.pic.url if profile else 'media/defaults/defaultProfile.png',
            'bio' : profile.bio if profile else ''

        })
        random.shuffle(result)
    return JsonResponse({'posts' : result,'current_user' : current_user},safe=False)


def Create_post(request):
    if request.method == 'POST':
       
        picture = request.FILES.get('Picture')
        caption = request.POST.get('Caption')
        post = Posts.objects.create(feed = picture,caption= caption,created_by_id = request.user.id)
        post.save()
           
    return JsonResponse({'message' : 'request reached'})


def display_Msgs(request):
    receiver = request.GET.get('receiver')
    messages = list(Messages.objects.filter(Q(sender_id = request.user.id,receiver_id = receiver) | Q(sender_id = receiver,receiver_id = request.user.id)).order_by("timestamp").values())
    
    return JsonResponse({'output' : messages})


def send_message(request):
    data = json.loads(request.body)
    print('body' , data)
    receiver = data.get('receiver')
    message = data.get('message')
    message = Messages(sender_id = request.user.id,receiver_id = receiver,message = message)
    message.save()
    return JsonResponse({'output' : "message sent successfully" })


def fetch_all_users(request):
    search = request.GET.get('search')
    profiles = Profile.objects.select_related('user').filter(user__username__icontains= search)
    
   
    result = []

    for profile in profiles:
        message = (Messages.objects.filter(sender_id = profile.user_id).order_by('-timestamp').values().first())
        
        if message:
            dt = message['timestamp']
            monthname = dt.strftime('%B')[:3]
            day = dt.day
           
        
        result.append({
            'id' : profile.user.id,
            'username' : profile.user.username,
            'pic' : profile.pic.url,
            'month' : monthname if monthname is not None else '',
            'day' : day if day is not None else ''            

        })

    
    return JsonResponse({"users" : result,'current_user' : request.user.id})


def addBio(request):
    profile = Profile.objects.filter(user_id = request.user.id).first()
    data = json.loads(request.body)
    profile.bio =data.get('bio',profile.bio)
    profile.save()
    return JsonResponse({"message" : "updated bio"})

@csrf_protect
def upload_profile(request):
    if request.method == 'POST' and request.FILES.get('profilePic'):
        
        profile, created = Profile.objects.get_or_create(user = request.user)
        profile.pic = request.FILES['profilePic']
        profile.save()
        
        print("Saved file:", profile.pic)  
        return JsonResponse({'profile' : profile.pic.url})
    return JsonResponse({'error' : 'No file uploaded'},status = 400)

def fetch_user(request):
    print(request.user)
    try :
        requested_user = request.user 
        user =  User.objects.filter(id = requested_user.id).values().first()
        profile = list(Profile.objects.filter(user_id = requested_user.id).values())
        print('profile :',profile)
        return JsonResponse({"user" : user,"profile": profile})
    except:
        return JsonResponse({"error" : "User not found1"},status=404)

def appied_Jobs(request):
    user = User.objects.get(username = request.user)
    applied = list(Application.objects.filter(user_id = user.id).values())
    return JsonResponse({'applied' : applied})


def apply(request):
    print("Raw Body " ,request.body.decode())
    user = User.objects.get(username = request.user)
    data = json.loads(request.body)
    job_id = data.get('jobId')
    apply = Application(job_id=job_id,user_id = user.id)
    apply.save()
    applied = list(Application.objects.filter(user_id = user.id).values())
    return JsonResponse({"applied" : applied,"jobId" : job_id})


def fetch_jobs(request):
    try :
            jobs = list(Jobs.objects.all().values())
            
            return JsonResponse({"jobs" : jobs})
    except :
        return JsonResponse({"error" : "sdjfnas"},status = 400)


def new_job(request):
        
        print(request.body.decode())
        if request.user.is_authenticated:
            user = User.objects.get(username = request.user.username)
            if user.is_superuser:
                print("super user")
        
                try:
                    
                    data = json.loads(request.body)
                    title = data.get("Title")
                    description = data.get("Description")
                    company = data.get("Company")
                    salary = int(data.get("Salary"))
                    location = data.get("Location")
                    
                    job = Jobs(title=title,description=description,salary = salary,company=company,location=location)
                    job.save()
                    return JsonResponse({"message" : "Created New JOb Post"})
                except:
                    return JsonResponse({"error": "Invalid JSON"}, status=400)
            else:
                return JsonResponse({'message' : 'Job seekers cannot post Job'},status = 400)


@csrf_protect
def create_account(request):
    if request.method == 'POST':

        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        is_recruiter = data.get("is_recruiter")
    
       
        if not username or len(username)<5:
            return JsonResponse({"NameError": "Username must contain atleast 5 letters"}, status=400)
        
        
        if not email or len(email)<8 :
            return JsonResponse({"EmailError": "email must contain atleast 8 letters"}, status=400)
    
        valid = re.fullmatch(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email)

        if  valid is  None:
            return JsonResponse({'EmailError' : 'Invalid Email Address'},status=400)

        if not password or len(password)<5:
            return JsonResponse({"PasswordError": "Password must contain atleast 5 letters"}, status=400)        


        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)
        
        user = User.objects.create_user(username=username,email=email,password=password)
        user.is_staff = is_recruiter
        user.save()

        from app.models import Profile
        Profile.objects.get_or_create(user=user)
    return JsonResponse({'message': 'account created successfully'})

@api_view(["GET"])
def verify(request):
    print("Verify response:", request.user);
    cur_user = list(User.objects.filter(id = request.user.id).values())

    if request.user.is_authenticated:
        return JsonResponse({"authenticated" : True,"user" :cur_user})
    else:
        return JsonResponse({"authenticated" : False},status=401)        

# @api_view(["POST"])
@csrf_protect
def verify_password(request):
    print("RAW BODY:", request.body.decode())

    if request.method == "POST":
        
        try:
            
            data = json.loads(request.body)
            identifier = data.get("email")
            password = data.get("password")
        except:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        
        try:
            user = User.objects.get(Q(username = identifier) | Q(email = identifier))
            print("user",user)
            username = user.username
            
        except:
            return JsonResponse({"error": "User Doesn't Exist"}, status=400)
        
        user = authenticate(request,username = username,password = password)
        
        if user  is not None:
            login(request,user)
        else:
            return JsonResponse({'error' : 'invalid credentails'},status = 400 )     

        if check_password(password, user.password):
            return JsonResponse({"message": "Login Successful"})
        else:
            return JsonResponse({"error": "Incorrect Password"}, status=400)

    return JsonResponse({"error": "Only POST allowed"}, status=405)


@require_GET
@ensure_csrf_cookie
def get_csrf_token(request):
    
    return  JsonResponse({"csrfToken":get_token(request)})


@csrf_exempt
def log_out(request):
    logout(request)
    return JsonResponse({'message' : "logged out Successfully"})