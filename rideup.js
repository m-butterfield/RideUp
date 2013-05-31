var initialLocation;
var cleveland = new google.maps.LatLng(41.49917035057174, -81.69371168017138);
var browserSupportFlag =    new Boolean();
var map

function initialize() {
    google.maps.visualRefresh = true;
    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Try W3C Geolocation (Preferred)
    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            map.setCenter(initialLocation);
            }, function() { handleNoGeolocation(browserSupportFlag); });
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
      } else {
        console.log("nope");
        initialLocation = cleveland;
      }
      map.setCenter(initialLocation);
    }

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    google.maps.event.addListener(map, 'center_changed', function() {
        $("#coordinates").val(map.center.lat().toFixed(4) + "  " + map.center.lng().toFixed(4));
    });

}

google.maps.event.addDomListener(window, 'load', initialize);
