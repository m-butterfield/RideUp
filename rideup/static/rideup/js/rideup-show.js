function initialize() {
    google.maps.visualRefresh = true;

    var initialLocation,
        cleveland = new google.maps.LatLng(41.49917035057174, -81.69371168017138),
        browserSupportFlag = new Boolean(),
        map;

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
            initialLocation = cleveland;
        }
        else {
            initialLocation = cleveland;
        }
        map.setCenter(initialLocation);
    }

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    var markers = [];

    google.maps.event.addListener(map, 'tilesloaded', function() {
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
            for (var i = 0, marker; marker = markers[i]; i++) {
                marker.setMap(null);
            }
            markers = [];
            $("#rides_list").empty();
            if (!response.length) {
                $("#rides_list").append($('<li>No Rides found within map! ' +
                    'Keep looking around or go <a href="' + mapRidesUrl +
                    '">create a ride!</a></li>'));
            } else {
                var image = {
                    url: '/static/rideup/img/green-bike.gif',
                    size: new google.maps.Size(70, 70),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(35, 70),
                    scaledSize: new google.maps.Size(70, 70)
                };
                for (var i = 0; i < response.length; i++) {
                    var position = new google.maps.LatLng(
                        response[i].lat, response[i].lng)
                    var marker = new google.maps.Marker({
                        map: map,
                        icon: image,
                        title: "title",
                        position: position
                    });
                    markers.push(marker);
                    $("#rides_list").append($('<li class="list-group-item">' +
                            '<strong>' + response[i].name + '</strong><br />' +
                            '<strong>Ride time: </strong>' + response[i].ride_time + '<br />' +
                            '<strong>Description: </strong>' + response[i].description + '<br />' +
                            '<strong>User: </strong>' + response[i].user + '<br />' +
                            '<strong>Address: </strong>' + response[i].address +
                            '</li>'));
                }
            }
        });
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
