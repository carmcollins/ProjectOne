var x = document.getElementById("map-canvas");

  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var latx=position.coords.latitude;    
    var lonx=position.coords.longitude;   
    var resultx=new google.maps.LatLng(latx,lonx);
    var locations = [ 
    ['Helooo',40, 30 ,0] , ['Helooo',41.04564,28.97862 ,1] , ];


    var map = new google.maps.Map(document.getElementById('map-canvas'), { 
      zoom: 14,  
      scrollwheel: false,
      center: resultx,
      mapTypeId: google.maps.MapTypeId.ROADMAP 
    }); 

    var infowindow = new google.maps.InfoWindow(); 

    var marker, i; 

    for (i = 0; i < locations.length; i++) {   
      marker = new google.maps.Marker({ 
        position: new google.maps.LatLng(locations[i][1], locations[i][2]), 
        disableAutoPan: true,
        map: map 
      }); 

      google.maps.event.addListener(marker, 'click', (function(marker, i) { 
        return function() { 
          infowindow.setContent(locations[i][0]); 
          infowindow.open(map, marker); 
        } 
      })(marker, i)); 
    }



}