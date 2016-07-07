/* jshint strict: false */
/* globals $:false */
/* globals google:false */
/* globals Mustache:false */
/* exported init */

window.Circuit = window.Circuit || {};
var position, marker, available, image;

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

  $.extend(site, window.Circuit.sitePlans[site.sitePlanId]);

  $.get('site.mst', function(template) {
    var rendered = Mustache.render(template, site);
    $('#site-plan').html(rendered);
  });
}


/* Display marker coordinates */
function displayMarkerCoordinates(marker) {
  $.get('marker.mst', function(template) {
    var rendered = Mustache.render(template, marker);
    $('#marker').html(rendered);
  });
}



/* Mouse event on dragging marker */
function markerMouseUp(marker) {
  marker.addListener('mouseup', function(data) {
    displayMarkerCoordinates({
      id: marker.id,
      lat: data.latLng.lat(),
      lng: data.latLng.lng()
    });
  });
}



/* Click event on marker */
function markerClickListener(marker) {
  marker.addListener('click', function() {
    displaySite(window.Circuit.sites[marker.id]);
  });
}


/* Helper to make coords object */
function makeLatLng(lat, lng) {
  return {
    lat: lat,
    lng: lng
  };
}



/* Set markers on map */
function setMarkers(markers, map) {

  // Create a marker and set its position.
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].lat && markers[i].lng) {
      position = makeLatLng(markers[i].lat, markers[i].lng);
    } else {
      position = makeLatLng(map.center.lat(), map.center.lng());
    }

    available = markers[i].available ? '328c78' : '6a6a6a';
    image = 'http://www.googlemapsmarkers.com/v1/'+i+'/'+available+'/f2f2f2/f2f2f2';

    marker = new google.maps.Marker({
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
    zoom: 15,
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
