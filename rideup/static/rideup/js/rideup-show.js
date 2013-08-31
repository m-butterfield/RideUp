var initialLocation;
var cleveland = new google.maps.LatLng(41.49917035057174, -81.69371168017138);
var browserSupportFlag = new Boolean();
var map;

function initialize() {
    google.maps.visualRefresh = true;
    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    // Try W3C Geolocation (Preferred)
    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            map.setCenter(initialLocation);
            }, function() { handleNoGeolocation(browserSupportFlag);
        });
     }

    // Browser doesn't support Geolocation
    else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
            console.log("Geolocation service failed.");
            initialLocation = cleveland;
        }
        else {
            initialLocation = cleveland;
        }
        map.setCenter(initialLocation);
    }

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    // add markers to the map
    var markers = [];
    var image = {
        url: '/static/rideup/img/green-bike.gif',
        size: new google.maps.Size(70, 70),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(35, 70),
        scaledSize: new google.maps.Size(70, 70)
    };
    for (var i = 0; i < Rideup.rides.length; i++) {
        var position = new google.maps.LatLng(
            Rideup.rides[i][0], Rideup.rides[i][1])
        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: "title",
            position: position
        });
    }
}

google.maps.event.addDomListener(window, 'load', initialize);
