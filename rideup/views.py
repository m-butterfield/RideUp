from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from rideup.models import Ride, CreateRideForm

import datetime

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
            return HttpResponseRedirect('/rideup/showrides/')
        else:
            return HttpResponseRedirect('')
    else:
        form = CreateRideForm()
    return render(request, 'rideup/create.html', {'form' : form})


def showrides(request):
    all_rides = Ride.objects.all()
    return render(request, 'rideup/showrides.html', {'all_rides': all_rides})
