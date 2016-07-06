var marker;

function initMap() {
  var center = {lat: 30.1383467, lng: -97.6306428}; // perfect center

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    scrollwheel: false,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });

  getMarkers(function(data) {
    setMarkers(data, map);
  });
}

function getMarkers(callback) {
  var cb = callback || function() {};

  $.get('markers.json')
  .done(function(data) {
    cb(data);
  })
  .fail(function(err) {
    window.alert( 'error retrieving markers.json: ' + err);
  })
  .always(function() {});
}

function setMarkers(markers, map) {

  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };

  // Create a marker and set its position.
  for (var i = 0; i < markers.length; i++) {
    marker = new google.maps.Marker({
      map: map,
      draggable: true,
      shape: shape,
      animation: google.maps.Animation.DROP,
      label: (i+1).toString(),
      position: markers[i]
    });

    marker.addListener('mouseup', function(data) {
      console.log('lat: ' + data.latLng.lat() + ', lng: ' + data.latLng.lng());
    });
  }
}
