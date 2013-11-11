from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from rideup.models import Ride, CreateRideForm
from datetime import datetime
import json

def index(request):
    return render(request, 'rideup/index.html')

@login_required
def create(request):
    if request.method == 'POST':
        form = CreateRideForm(request.POST.copy())
        ride_time = datetime.strptime(form.data['ride_time'], '%B %d %Y @ %I:%M %p')
        form.data['ride_time'] = ride_time
        form.data['created_date'] = datetime.now()
        form.data['user'] = request.user.id
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/showrides/')
        else:
            return HttpResponseRedirect('')
    else:
        form = CreateRideForm()
    return render(request, 'rideup/create.html', {'form' : form})


def showrides(request):
    return render(request, 'rideup/showrides.html')


def get_map_rides(request):
    if request.is_ajax():
        northeastLat = request.GET['northeastLat']
        northeastLng = request.GET['northeastLng']
        southwestLat = request.GET['southwestLat']
        southwestLng = request.GET['southwestLng']

        qry = """
            select * from rideup_ride
            where lat < %s
                and lng < %s
                and lat > %s
                and lng > %s
            """ % (northeastLat, northeastLng, southwestLat, southwestLng)

        ride_ids = []
        ride_list = []
        for ride in Ride.objects.raw(qry):
            ride_list.append(dict(user=User.objects.get(pk=ride.user.id).username,
                                 lat=str(ride.lat), lng=str(ride.lng), name=ride.name,
                                 address=ride.address, description=ride.description,
                                 ride_time=ride.ride_time.strftime("%b %-d, %-I:%M %p"),
                                 ride_id=ride.id))
            ride_ids.append(ride.id)

        response_dict = dict(rideIDs=ride_ids,
                             rideList=ride_list)

        return HttpResponse(json.dumps(response_dict),
                            mimetype='application/json')
    else:
        return HttpResponse()


def register(request):
    form = UserCreationForm(request.POST.copy())
    if form.is_valid():
        form.save()
        new_user = authenticate(username=request.POST['username'],
                                password=request.POST['password1'])
        login(request, new_user)
        return HttpResponseRedirect('/register_success/')
    else:
        return HttpResponseRedirect('/')

@login_required
def register_success(request):
    return render(request, 'rideup/register_success.html')
