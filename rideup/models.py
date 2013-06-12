from django.db import models

class Ride(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    created_date = models.DateTimeField()
    ride_time = models.DateTimeField()
