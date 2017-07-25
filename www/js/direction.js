 
 function initMap() {
   var myLatLng =  new google.maps.LatLng( -25.363, 131.044);
        directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById("map"), {
          zoom: 7,
          center: myLatLng
        });
    
    var infoWindow = new google.maps.InfoWindow({map: map});
    
    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
        
            var pos = {
        enableHighAcuracy:true,
        timeOut:Infinity,
        maximumAge:0,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
      var marker = new google.maps.Marker({
          position: pos,
          map: map,
      title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + pos.lat + "<br />Longitude: " + pos.lng
        });
      
    google.maps.event.addListener(marker, "click", function (e) {
             infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(marker.title);
            infoWindow.open(map, marker);
        });
    google.maps.event.addDomListener(document.getElementById('map'), 'click', addMarker);
  
          
      
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
    
    var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker']
          },
          markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      draggable:true,
      editable:true,
      clickable:true
      }
        });
        drawingManager.setMap(map);
        directionsDisplay.setMap(map);
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
        var onChangeHandler = function() {
          calculateAndDisplayRoute(directionsService, directionsDisplay);
        };
        document.getElementById('start').addEventListener('change', onChangeHandler);
        document.getElementById('end').addEventListener('change', onChangeHandler);
      }
   

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        directionsService.route({
          origin: document.getElementById('start').value,
          destination: document.getElementById('end').value,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
    