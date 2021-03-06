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
            initialLocation = nyc;
        }
        else {
            initialLocation = nyc;
        }
        map.setCenter(initialLocation);
    }

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    var input = /** @type {HTMLInputElement} */(document.getElementById('id_address')),
        searchBox = new google.maps.places.SearchBox(input),
        markers = [];

    google.maps.event.addListener(searchBox, 'places_changed', function() {

        // only want the first place from autocomplete
        var place = searchBox.getPlaces()[0];

        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        markers = [];
        var bounds = new google.maps.LatLngBounds();
        var image = {
            url: '/static/rideup/img/green-bike.gif',
            size: new google.maps.Size(70, 70),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(35, 70),
            scaledSize: new google.maps.Size(70, 70)
        };

        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });

        markers.push(marker);

        bounds.extend(place.geometry.location);

        map.fitBounds(bounds);
        map.setZoom(17);
        $("#id_lat").val(place.geometry.location.lat());
        $("#id_lng").val(place.geometry.location.lng());
        $("#id_name").val(place.name);
        $("#id_address").val(place.formatted_address);
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });

}

google.maps.event.addDomListener(window, 'load', initialize);
