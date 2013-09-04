from django.db import models
from django.forms import ModelForm
from django.contrib.auth.models import User

class Ride(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    created_date = models.DateTimeField()
    ride_time = models.DateTimeField()
    description = models.CharField(max_length=500)
    lat = models.DecimalField(max_digits=20, decimal_places=15)
    lng = models.DecimalField(max_digits=20, decimal_places=15)
    user = models.ForeignKey(User)

    def __unicode__(self):
        return self.address

class CreateRideForm(ModelForm):
    class Meta:
        model = Ride
