var initialLocation;
var cleveland = new google.maps.LatLng(41.49917035057174, -81.69371168017138);
var browserSupportFlag = new Boolean();
var map

function initialize() {
    google.maps.visualRefresh = true;
    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

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

//    google.maps.event.addListener(map, 'center_changed', function() {
//        $("#coordinates").val(map.center.lat().toFixed(4) + "  " + map.center.lng().toFixed(4));
//        marker.setPosition(map.getCenter());
//    });

    var input = /** @type {HTMLInputElement} */(document.getElementById('target'));
    var searchBox = new google.maps.places.SearchBox(input);
    var markers = [];

    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        for (var i = 0, marker; marker = markers[i]; i++) {
          marker.setMap(null);
        }

        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            markers.push(marker);

            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });

}

google.maps.event.addDomListener(window, 'load', initialize);