from django.conf.urls import patterns, url

from rideup import views

urlpatterns = patterns('', 
    url(r'^$', views.index, name='index'),
    url(r'^create/$', views.create, name='create'),
    url(r'^showrides/$', views.showrides, name='showrides'),
    url(r'^login/$', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout',
        {'next_page': '/rideup/'}, name='logout'),
)
