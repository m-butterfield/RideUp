from django.shortcuts import render

def index(request):
    return render(request, 'rideup/index.html')

def create(request):
    return render(request, 'rideup/create.html')