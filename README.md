RideUp
======
 A webapp that helps bike riders meet up to ride  
 See it in action here: [rideup.mattbutterfield.com](http://rideup.mattbutterfield.com)

**Setup for Linux:**  
First, make sure PostgreSQL, Python2.7, and Virtualenv are installed, then:

    $ git clone git@github.com:m-butterfield/RideUp.git
    $ cd RideUp
    $ mkvirtualenv --python=python2.7 --no-site-packages rideup
    $ pip install -r requirements.txt
    $ cp rideup_site/sample_settings.py rideup_site/settings.py
    $ createdb rideup

At this point, make sure you have a postgres username and password setup with full access to the rideup database you just created.  
Edit the 'rideup_site/settings.py' file.  Change the 'user' and 'password' settings in the DATABASES section accordingly.  Then run:

    $ python manage.py syncdb

Follow the prompts to create a superuser, then run:

    $ python manage.py runserver

Then point a browser to: [http://localhost:8000](http://localhost:8000) And you are ready to go!

