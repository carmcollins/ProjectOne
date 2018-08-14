var config = {
    apiKey: "AIzaSyBIdeaYIvc47L5bC-9iBvfqZIu8Mt7BAcs",
    authDomain: "tailwag-fa1c7.firebaseapp.com",
    databaseURL: "https://tailwag-fa1c7.firebaseio.com",
    projectId: "tailwag-fa1c7",
    storageBucket: "tailwag-fa1c7.appspot.com",
    messagingSenderId: "542472737315"
};
// firebase.initializeApp(config);

var database = firebase.database();


//CREATE INITIAL MAP WITH MARKERS AND HEATMAP
//==================================================================================

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

    var positionLat = 0;
    var positionLng = 0;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            positionLat = position.coords.latitude;
            positionLng = position.coords.longitude;

            getCoords(positionLat, positionLng);

            //set icon image
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
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function getCoords(lat, lng) {
        console.log(lat)
        console.log(lng)

        database.ref('parks').on('child_added', function (snapshot) {
            console.log("in db " + snapshot.val().parkLat); /// this is printing for every entry in db.
        })

    }



    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }


    // Add marker array
    var markers = [];

    // Reference parks in firebase
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



    // Create markers
    for (var j = 0; j < markers.length; j++) {
        createMarker(j);
    };

    function createMarker(i) {



        var iconImage = "assets/photos/paw24.png"

        var marker = new google.maps.Marker({
            position: markers[i].coords,
            map: map,
            icon: iconImage,
            title: markers[i].title,
        });
        
        marker.setIcon(iconImage);
        marker.setMap(map);

        // Create info window to pop up over marker
        var infoWindow = new google.maps.InfoWindow({

            content: '<div id="infoWindow">'
                + '<div id="bodyContent">'
                + '<h6>' + marker.title + '</h6>'
                + '<p>' + '10' + ' miles away</p>'
                + "<a href='park.html' class='btn btn-success btn-sm more-info' data-key='" + markers[i].parkKey + "'>" + "More Info" + "</a>"
                + '</div>'
        });


        // Listener to open infoWindow
        marker.addListener('click', function (e) {
            infoWindow.open(map, marker);
        });


        // Create heat map
        var heatmapData = [
            new google.maps.LatLng(markers[i].coords.lat, markers[i].coords.lng)
        ]


        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            map: map,
            radius: (markers[i].checkIns) * 3
        });
        
        heatmap.setMap(map);


    } // End createMarker

} // End initMap
