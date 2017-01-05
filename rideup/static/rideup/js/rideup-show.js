function initialize() {
    google.maps.visualRefresh = true;

    var initialLocation,
        nyc = new google.maps.LatLng(40.764799, -73.973062),
        browserSupportFlag = new Boolean(),
        map;

    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
    };

    var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    // Try W3C Geolocation (Preferred)
    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            map.setCenter(initialLocation);
            },
            function() {
                handleNoGeolocation(browserSupportFlag);
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
            initialLocation = nyc;
        }
        else {
            initialLocation = nyc;
        }
        map.setCenter(initialLocation);
    }

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    var markers = [];

    var image = {
        url: '/static/rideup/img/green-bike.gif',
        size: new google.maps.Size(70, 70),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(35, 70),
        scaledSize: new google.maps.Size(70, 70)
    };

    google.maps.event.addListener(map, 'idle', function() {
        if (!map.getBounds()) {
            return;
        }
        var data = {
            northeastLat: map.getBounds().getNorthEast().lat(),
            northeastLng: map.getBounds().getNorthEast().lng(),
            southwestLat: map.getBounds().getSouthWest().lat(),
            southwestLng: map.getBounds().getSouthWest().lng()
        };
        $.ajax({
            url: mapRidesUrl,
            data: data
        }).done(function(response) {
            var rides = response.rideList,
                rideIDs = response.rideIDs;
            $("#rides_list").empty();
            if (!rides.length) {
                $("#rides_list").append($('<li>No Rides found within map! ' +
                    'Keep looking around or go <a href="' + mapRidesUrl +
                    '">create a ride!</a></li>'));
                markers.forEach(function(marker) {
                    marker.setMap(null);
                });
                markers.length = 0;
                return;
            }
            var markersCopy = markers.slice(),
                existingRideMarkerIDs = [];
            markersCopy.forEach(function(marker) {
                if (rideIDs.indexOf(marker.ride_id) === -1) {
                    marker.setMap(null);
                    markers.splice(markers.indexOf(marker), 1);
                } else {
                    existingRideMarkerIDs.push(marker.ride_id);
                }
            });
            rides.forEach(function(ride) {
                if (existingRideMarkerIDs.indexOf(ride.ride_id) === -1) {
                    var position = new google.maps.LatLng(ride.lat, ride.lng)
                    var marker = new google.maps.Marker({
                        ride_id: ride.ride_id,
                        map: map,
                        icon: image,
                        title: "title",
                        position: position
                    });
                    markers.push(marker);
                }
                $("#rides_list").append($('<li class="list-group-item rides-list-item" ' +
                    'ride_id="' + ride.ride_id + '" >' +
                    '<strong>' + ride.name + '</strong><br />' +
                    '<strong>Ride time: </strong>' + ride.ride_time + '<br />' +
                    '<strong>Description: </strong>' + ride.description + '<br />' +
                    '<strong>User: </strong>' + ride.user + '<br />' +
                    '<strong>Address: </strong>' + ride.address +
                    '</li>'));
            });
        });
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

