from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.utils import timezone
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.core import serializers
from rideup.models import Ride, CreateRideForm

import datetime, json

def index(request):
    return render(request, 'rideup/index.html')

@login_required
def create(request):
    if request.method == 'POST':
        form = CreateRideForm(request.POST.copy())
        form.data['created_date'] = timezone.now()
        form.data['ride_time'] = timezone.now() + datetime.timedelta(days=1)
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

        response = serializers.serialize('json', Ride.objects.raw(qry))
        response = json.loads(response)

        return HttpResponse(json.dumps(response),
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
