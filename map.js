/* jshint strict: false */
/* globals $:false */
/* globals google:false */
/* globals Mustache:false */

window.Circuit = window.Circuit || {};
var position;



/* Load sitePlans.json */
function loadSitePlans(callback) {
  $.get('sitePlans.json', function(sitePlans) {
    window.Circuit.sitePlans = sitePlans;
    callback();
  });
}


/* Load sites.json */
function loadSites(callback) {
  $.get('sites.json', function(sites) {
    window.Circuit.sites = sites;
    callback();
  });
}


/* Display site Mustache template */
function displaySite(site) {
  site = site || window.Circuit.sites[0];

  var data = window.Circuit.sitePlans[site.sitePlanId];
  data.available = site.available;

  $.get('site.mst', function(template) {
    var rendered = Mustache.render(template, data);
    $('#site-plan').html(rendered);
  });
}



/* Mouse event on dragging marker */
function markerMouseUp(marker) {
  marker.addListener('mouseup', function(data) {
    console.log('lat: ' + data.latLng.lat() + ', lng: ' + data.latLng.lng());
  });
}



/* Click event on marker */
function markerClickListener(marker) {
  marker.addListener('click', function() {
    displaySite(window.Circuit.sites[marker.id]);
  });
}



/* Set markers on map */
function setMarkers(markers, map) {

  // Create a marker and set its position.
  for (var i = 0; i < markers.length; i++) {
    position = {
      lat: markers[i].lat,
      lng: markers[i].lng
    };

    var available = markers[i].available ? '008000' : 'ff0000';
    var image = 'http://www.googlemapsmarkers.com/v1/'+(i+1)+'/'+available+'/';
    // debugger;

    var marker = new google.maps.Marker({
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: image,
      position: position
    });

    marker.set('id', i);

    markerMouseUp(marker);
    markerClickListener(marker);
  }
}



/* Initialize map and load data */
function init() {
  var center = {lat: 30.1383467, lng: -97.6306428}; // perfect center

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    scrollwheel: false,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });

  // :/ damn...three deep.
  loadSitePlans(function() {
    loadSites(function() {
      displaySite();
      setMarkers(window.Circuit.sites, map);
    });
  });
}
