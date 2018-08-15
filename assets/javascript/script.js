var config = {
    apiKey: "AIzaSyBIdeaYIvc47L5bC-9iBvfqZIu8Mt7BAcs",
    authDomain: "tailwag-fa1c7.firebaseapp.com",
    databaseURL: "https://tailwag-fa1c7.firebaseio.com",
    projectId: "tailwag-fa1c7",
    storageBucket: "tailwag-fa1c7.appspot.com",
    messagingSenderId: "542472737315"
};

var database = firebase.database();

function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30.307182,
            lng: -97.755996
        },
        zoom: 12,
        styles: [{
            featureType: 'poi',
            stylers: [{
                visibility: 'off'
            }] // Turn off POI.
        },
        {
            featureType: 'transit.station',
            stylers: [{
                visibility: 'off'
            }] // Turn off bus, train stations etc.
        }
        ],
        disableDoubleClickZoom: true,
        streetViewControl: false,

    });

    var positionLat;
    var positionLng;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            positionLat = position.coords.latitude;
            positionLng = position.coords.longitude;

            var image = 'assets/photos/star32.png';

            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: image,
                title: "geolocation"
            });

            marker.setMap(map);
            map.setCenter(pos);
            return pos;

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });

    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    var markers = [];

    database.ref('parks').on("child_added", function (childSnapshot) {
        var title = childSnapshot.val().parkName;
        var checkIns = childSnapshot.val().checkIns;
        var latitude = parseFloat(childSnapshot.val().parkLat);
        var longitude = parseFloat(childSnapshot.val().parkLng);
        var parkKey = childSnapshot.key;

        console.log(title);
        console.log(latitude);
        console.log(longitude);
        console.log(checkIns);

        var newPark = {
            coords: {
                lat: latitude,
                lng: longitude
            },
            title: title,
            parkKey: parkKey,
            checkIns: checkIns
        }

        markers.push(newPark);
        for (var j = 0; j < markers.length; j++) {
            createMarker(j);

        };

    }); 

    for (var j = 0; j < markers.length; j++) {
        createMarker(j);
    };

    function createMarker(i) {

        var iconImage = "assets/photos/paw16.png"

        var marker = new google.maps.Marker({
            position: markers[i].coords,
            map: map,
            icon: iconImage,
            title: markers[i].title,
        });
        
        marker.setIcon(iconImage);
        marker.setMap(map);

        var infoWindow = new google.maps.InfoWindow({

            content: '<div id="infoWindow">'
                + '<div id="bodyContent">'

                    + '<h6>' + marker.title + '</h6>'
                    + '<p>' + '<span class="miles-away"></span>' + ' miles away</p>'
                    + "<a href='park.html' class='btn btn-success btn-sm more-info' data-key='" + markers[i].parkKey + "'>" + "More Info" + "</a>"
                + '</div>'
        });

        $(document).on("click", ".more-info", function () {
            var key = $(this).attr("data-key");
            console.log($(this).attr("data-key"));
            sessionStorage.setItem("key", key);
        });

        marker.addListener('click', function(e) {
            
            infoWindow.open(map, marker);
             lat1 = parseFloat(e.latLng.lat());
             lon1 = parseFloat(e.latLng.lng());
             lat2 = positionLat;
             lon2 = positionLng;
            
            var miles;
            
            function calcDistance(lat1, lon1, lat2, lon2) {
                var R = 6371;
                var dLat = toRad(lat2-lat1);
                var dLon = toRad(lon2-lon1);
                var lat1 = toRad(lat1);
                var lat2 = toRad(lat2);
        
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                var d = R * c;
                miles = (0.62137119 * d);
                miles = miles.toFixed(2);
                $(".miles-away").text(miles);
            };

            calcDistance(lat1, lon1, lat2, lon2);
            
            function toRad(x) {
                return x * Math.PI / 180;
            };
        });
            
        var heatmapData = [
            new google.maps.LatLng(markers[i].coords.lat, markers[i].coords.lng)
        ];

        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            map: map,
            radius: (markers[i].checkIns) * 3
        });
        
        heatmap.setMap(map);

    }; // End createMarker

}; // End initMap