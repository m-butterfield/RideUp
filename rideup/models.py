from django.db import models
from django.forms import ModelForm

class Ride(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    created_date = models.DateTimeField()
    ride_time = models.DateTimeField()
    description = models.CharField(max_length=500)

    def __unicode__(self):
        return self.address

class CreateRideForm(ModelForm):
    class Meta:
        model = Ride
        fields = ['name', 'address', 'description']
