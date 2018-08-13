

// Reference to the clicks in Firebase.
// var clicks = database.ref('clicks');
var database = firebase.database();

//Data object to be written to Firebase.

var data = {
    sender: null,
    timestamp: null,
    lat: null,
    lng: null
};

var heatmap = null;
database.ref().on("child_added", function(childSnapshot){
    var title = childSnapshot.parkName;
    var position = childSnapshot.location;
    console.log(title);
    console.log(position);
    
});


//CREATE INITIAL MAP WITH MARKERS 
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



    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: "geolocation"
            });


            marker.setMap(map);
            // infoWindow.setPosition(pos);
            // infoWindow.setContent();
            // infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }


    // add marker array
    var markers = [


        {
            coords: { lat: 30.291163, lng: -97.787247 },
            title: 'Red Bud Isle'

        },

        {

            coords: { lat: 30.249140, lng: -97.736471 },
            title: 'Norwood Estates Dog Park'

        },

        {

            coords: { lat: 30.263507, lng: -97.753170 },
            title: 'Auditorium Shores Dog Park'

        },

        {
            coords: { lat: 30.266909, lng: -97.772870 },
            title: 'Zilker Metropolitan'
        }
    ];

  
  


    // marker.setMap(map);
    for (var j = 0; j < markers.length; j++) {
        createMarker(j);
    };

    function createMarker(i){

    
        var marker = new google.maps.Marker({
            position: markers[i].coords,
            map: map,
            icon: markers[i].iconImage,
            title: markers[i].title,
            // parkKey: parkKey
        });
        console.log(markers[i]);
        marker.setIcon(markers[i].iconImage);
        // addMarker(markers[i]);
        console.log('marker added');

        //create info window to pop up over marker
        var infoWindow = new google.maps.InfoWindow({
            content: '<div id="infoWindow">'
                + '<div id="bodyContent">'
                + '<h3>' + marker.title + '</h3>'
                + '<span>' + "Recent Checkins: " + "0" + '</span>' + '<button id="checkIn">Check In ' + '</button><br>'    //replace X with num clicks in last hour for specific park

                + "<form method='get' action='park.html'>" +
                "<button type='submit button' class='btn btn-primary more-info' data-key='" + "marker.parkKey" + "'" + ">" + "More Info" + "</button>" 
                + "</form>"  //needs to populate with 'this' park.html
                + '<button id="distance">Drive distance: ' + 'X miles' + '</button>'
                + '</div>'
                + '</div>'
        });
        //check for marker function
        console.log('this works');
        if (props.iconImage) {
            //set icon image
            marker.setIcon(props.iconImage)
        }
        // check contant
        if (props.content) {
            // console.log(props.content);
            // var infoWindow = new google.maps.InfoWindow({
            // 	content:props.content
            //  })

            //create info window to pop up over marker
            var infoWindow = new google.maps.InfoWindow({
                content: '<div id="infoWindow">' +
                    '<div id="bodyContent">' +
                    '<h3>' + 'marker.title(FIX)' + '</h3>' +
                    '<span>' + "Recent Checkins: " + "0" + '</span>' + '<button id="checkIn">Check In ' + '</button><br>' //replace X with num clicks in last hour for specific park

                    +
                    '<a href="../../park.html" id="moreInfo">More Info</a>' //needs to populate with 'this' park.html
                    +
                    '<button id="distance">Drive distance: ' + 'X miles' + '</button>' +
                    '</div>' +
                    '</div>'
            });

        }

        marker.addListener('click', function(e) {
            
            console.log("marker click")
            infoWindow.open(map, marker);
    
            $('#checkIn').bind('click', function (e) {
                console.log("check in")
                data.lat = e.latLng.lat();
                data.lng = e.latLng.lng();
                addToFirebase(data);
            });  
        });
       
  
    }




    heatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        map: map,
        radius: 16
    });

} // end init map 


//CREATE HEATMAP 
//==========================================================================



// Create a heatmap.
// var heatmap = new google.maps.visualization.HeatmapLayer({
//     data: [],
//     map: map,
//     radius: 16
// });



//Set up a Firebase with deletion on clicks older than expirySeconds
// @param {!google.maps.visualization.HeatmapLayer} heatmap The heatmap to
// which points are added from Firebase.
 
function initFirebase(heatmap) {

    // 10 minutes before current time. ----------------------------Need to change to 60 min before current time
    var startTime = new Date().getTime() - (60 * 10 * 1000);

    

    // Listener for when a click is added.
    clicks.orderByChild('timestamp').startAt(startTime).on('child_added',
        function (snapshot) {
            console.log(snapshot.val());
            // Get that click from firebase.
            var newPosition = snapshot.val();
            var point = new google.maps.LatLng(newPosition.lat, newPosition.lng);
            var elapsed = new Date().getTime() - newPosition.timestamp;

            // Add the point to  the heatmap.
            heatmap.getData().push(point);

            // Requests entries older than expiry time (10 minutes).
            var expirySeconds = Math.max(60 * 10 * 1000 - elapsed, 0);
            // Set client timeout to remove the point after a certain time.
            window.setTimeout(function () {
                // Delete the old point from the database.
                snapshot.ref().remove();
            }, expirySeconds);
        }
    );

    // Remove old data from the heatmap when a point is removed from firebase.
    clicks.on('child_removed', function (snapshot, prevChildKey) {
        var heatmapData = heatmap.getData();
        var i = 0;
        while (snapshot.val().lat != heatmapData.getAt(i).lat() ||
            snapshot.val().lng != heatmapData.getAt(i).lng()) {
            i++;
        }
        heatmapData.removeAt(i);
    });

    initFirebase(heatmap);

} //------------------------------------end initFirebase ------------------------------------------





 //Updates the last_message/ path with the current timestamp.
 //@param {function(Date)} addClick After the last message timestamp has been updated,
 //    this function is called with the current timestamp to add the
 //    click to the firebase.
 
function getTimestamp(addClick) {
    // Reference to location for saving the last click time.
    var ref = database.ref('last_message/' + data.sender);

    ref.onDisconnect().remove(); // Delete reference from firebase on disconnect.


    // Set value to timestamp.
    ref.set(firebase.database.ServerValue.TIMESTAMP, function (err) {
        if (err) { // Write to last message was unsuccessful.
            console.log(err);
        } else { // Write to last message was successful.
            ref.once('value', function (snap) {
                addClick(snap.val()); // Add click with same timestamp.
            }, function (err) {
                console.warn(err);
            });
        }
    });
}


//Adds a click to firebase.
//@param {Object} data The data to be added to firebase.
//   It contains the lat, lng, sender and timestamp.

function addToFirebase(data) {
    getTimestamp(function (timestamp) {
        // Add the new timestamp to the record data.
        data.timestamp = timestamp;
        var ref = database.ref('clicks').push(data, function (err) {
            if (err) { // Data was not written to firebase.
                console.warn(err);
            }
        });
    });
}



//ADD WEATHER API
//===========================================================================================

// Info for weather page
var APIKey = "11631bfd75b571a520255fbeaeaeef02";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=austin&appid=" + APIKey;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    // Logs the object
    console.log(response);

    $("#description").text(response.weather[0].main);

    var sunriseTime = moment(response.sys.sunrise, "X").format("h:mm A");
    var sunsetTime = moment(response.sys.sunset, "X").format("h:mm A");


    $("#sunrise-time").text(sunriseTime);
    $("#sunset-time").text(sunsetTime);

    // Adds humidity and wind to HTML
    $("#humidity").text(response.main.humidity + "%");
    $("#wind").text(response.wind.speed + " MPH");

    // Converting temp from Kelvin to Farenheit
    var kTemp = response.main.temp;
    var fTemp = Math.floor((kTemp - 273.15) * 1.80 + 32);
    $("#temp").text(fTemp + " F");

});

