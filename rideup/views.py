from django.shortcuts import render
from django.http import HttpResponseRedirect
from rideup.models import Ride, CreateRideForm

def index(request):
    return render(request, 'rideup/index.html')

def create(request):
    if request.method == 'POST':
        form = CreateRideForm(request.POST)
        if form.is_valid():
            print form.cleaned_data()
            return HttpResponseRedirect('rideup/showrides')
        else:
            return HttpResponseRedirect('')

    else:
        form = CreateRideForm()
    return render(request, 'rideup/create.html', { 'form' : form, })

def showrides(request):
    all_rides = Ride.objects.all()
    return render(request, 'rideup/showrides.html', {'all_rides': all_rides})

def create_a_ride(request):
    form = CreateRideForm(request.POST)
    if form.is_valid():
        print form.cleaned_data()
        return HttpResponseRedirect('rideup/showrides')
    else:
        return HttpResponseRedirect('')
