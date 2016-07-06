/* jshint strict: false */
/* globals $:false */
/* globals google:false */
/* globals Mustache:false */

window.Circuit = window.Circuit || {};
var marker, position;

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

  $.get('sites.json')
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
    position = {
      lat: markers[i].lat,
      lng: markers[i].lng
    };

    marker = new google.maps.Marker({
      map: map,
      draggable: true,
      shape: shape,
      animation: google.maps.Animation.DROP,
      label: (i+1).toString(),
      position: position
    });

    marker.addListener('mouseup', function(data) {
      console.log('lat: ' + data.latLng.lat() + ', lng: ' + data.latLng.lng());
    });
  }
}

function loadSitePlan(id) {
  id = id || 0;
  $.get('sitePlan.mst', function(template) {
    var rendered = Mustache.render(template, window.Circuit.sitePlans[id]);
    $('#site-plan').html(rendered);
  });
}

function loadSitePlans() {
  $.get('sitePlans.json', function(data) {
    window.Circuit.sitePlans = data;
    loadSitePlan();
  });
}
loadSitePlans();

