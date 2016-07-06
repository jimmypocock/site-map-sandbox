// http://stackoverflow.com/questions/14644558/call-javascript-function-after-script-is-loaded

function loadScript( url, callback ) {
  var script = document.createElement( "script" );
  script.type = "text/javascript";
  if(script.readyState) {  //IE
    script.onreadystatechange = function() {
      if ( script.readyState === "loaded" || script.readyState === "complete" ) {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  //Others
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName( "head" )[0].appendChild( script );
}

$.get('key.json')
.done(function(data) {
  loadScript('https://maps.googleapis.com/maps/api/js?key=' + data.key +'&callback=init', function() {
    console.log('script loaded.');
  });
})
.fail(function(err) {
  window.alert( 'error retrieving markers.json: ' + err);
})
.always(function() {});
