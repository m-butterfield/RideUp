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

//    google.maps.event.addListener(map, 'center_changed', function() {
//        $("#coordinates").val(map.center.lat().toFixed(4) + "  " + map.center.lng().toFixed(4));
//        marker.setPosition(map.getCenter());
//    });
    
    
    var geocoder = new google.maps.Geocoder();
    $(function() {
        $("#searchbox").autocomplete({
        
          source: function(request, response) {

         if (geocoder == null){
          geocoder = new google.maps.Geocoder();
         }
            geocoder.geocode( {'address': request.term }, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {

                 var searchLoc = results[0].geometry.location;
                 var lat = results[0].geometry.location.lat();
                 var lng = results[0].geometry.location.lng();
                 var latlng = new google.maps.LatLng(lat, lng);
                 var bounds = results[0].geometry.bounds;

                 geocoder.geocode({'latLng': latlng}, function(results1, status1) {
                     if (status1 == google.maps.GeocoderStatus.OK) {
                       if (results1[1]) {
                        response($.map(results1, function(loc) {
                       return {
                           label  : loc.formatted_address,
                           value  : loc.formatted_address,
                           bounds   : loc.geometry.bounds
                         }
                       }));
                       }
                     }
                   });
           }
             });
          },
          select: function(event,ui){
     var pos = ui.item.position;
     var lct = ui.item.locType;
     var bounds = ui.item.bounds;

     if (bounds){
      console.log("fitting bounds");
      map.fitBounds(bounds);
     }
          }
        });
    });
    
    

    function showAddress(address) {
      if (geocoder) {
        geocoder.getLatLng(
          address,
          function(point) {
            if (!point) {
              alert(address + " not found");
            } else {
              map.setCenter(point, 13);
              var marker = new GMarker(point);
              map.addOverlay(marker);

              // As this is user-generated content, we display it as
              // text rather than HTML to reduce XSS vulnerabilities.
              marker.openInfoWindow(document.createTextNode(address));
            }
          }
        );
      }
    }

}

google.maps.event.addDomListener(window, 'load', initialize);
