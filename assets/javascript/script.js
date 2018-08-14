var config = {
    apiKey: "AIzaSyBIdeaYIvc47L5bC-9iBvfqZIu8Mt7BAcs",
    authDomain: "tailwag-fa1c7.firebaseapp.com",
    databaseURL: "https://tailwag-fa1c7.firebaseio.com",
    projectId: "tailwag-fa1c7",
    storageBucket: "tailwag-fa1c7.appspot.com",
    messagingSenderId: "542472737315"
};

// Reference to the clicks in Firebase.
 
var database = firebase.database();
console.log(database);

//Data object to be written to Firebase.

var data = {
    sender: null,
    timestamp: null,
    lat: null,
    lng: null
};

var heatmap = null;



//CREATE INITIAL MAP WITH MARKERS 
//==================================================================================

function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.307182, lng: -97.755996 },
        zoom: 12,
        styles: [{
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]  // Turn off POI.
        },
        {
            featureType: 'transit.station',
            stylers: [{ visibility: 'off' }]  // Turn off bus, train stations etc.
        }],
        disableDoubleClickZoom: true,
        streetViewControl: false,

    });



    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos =
            {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var image = 'assets/photos/star32.png';
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: image,
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
    }
    else {
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
    database.ref('parks').on("child_added", function(childSnapshot){
        var title = childSnapshot.val().parkName;
        var latitude = parseFloat(childSnapshot.val().parkLat);
        var longitude = parseFloat(childSnapshot.val().parkLng);
        var parkKey = childSnapshot.key;
        console.log(title);
        console.log(latitude);
        console.log(longitude);
        
        var newPark = {
            coords: {
                lat:latitude,
                lng:longitude
            },
            title: title,
            parkKey: parkKey
        }
    
        markers.push(newPark);
        for (var j = 0; j < markers.length; j++) {
            createMarker(j);
            
        };
        
    }); // end of database.refparks

    
  


    // marker.setMap(map);
    for (var j = 0; j < markers.length; j++) {
        createMarker(j);
    };

    function createMarker(i){

        var iconImage = "assets/photos/paw24.png"
        var marker = new google.maps.Marker({
            position: markers[i].coords,
            map: map,
            icon: iconImage,
            title: markers[i].title,
        });
        // console.log(markers[i]);
        
        marker.setIcon(iconImage);
        marker.setMap(map);
        //addMarker(markers[i]);
        // console.log('marker added');

        //create info window to pop up over marker
        var infoWindow = new google.maps.InfoWindow({
            content: '<div id="infoWindow">'
                + '<div id="bodyContent">'
                    + '<h6>' + marker.title + '</h6>'
                    + '<p>' + '10' + ' miles away</p>'
                    + "<a href='park.html' class='btn btn-success btn-sm more-info' data-key='" + markers[i].parkKey + "'" + "More Info" + "</a>"
                + '</div>'
        });

        

        marker.addListener('click', function(e) {
            
            // console.log("marker click")
            infoWindow.open(map, marker);
    
            $('#checkIn').bind('click', function (e) {
                // console.log("check in")
                data.lat = e.latLng.lat();
                data.lng = e.latLng.lng();
                addToFirebase(data);
            });  
        });
       
  
    }

// Jenni's work on heat map
// var map;
// var heatmap;

// heatmap = new google.maps.visualization.HeatmapLayer({
//             data: getPoints(),
//             map: map,
//         });

// function getPoints(){
//     console.log("got here")
//     database.ref('parks').child('uid').child('checkIns').observe("child_added", function (snapshot){
//        var checkInAmount = snapshot.val().checkIns;
//         var lat = parseFloat(snapshot.val().parkLat);
//         var lng = parseFloat(snapshot.val().parkLng); 
//         return [new google.maps.LatLng(lat, lng)]
//     });
   
// }    



// Brit heatmap starts here

//     heatmap = new google.maps.visualization.HeatmapLayer({
//         data: [],
//         map: map,
//         radius: 16
//     });

// } // end init map 



// //CREATE HEATMAP 
// //==========================================================================

 
// function initFirebase(heatmap) {

//     // 10 minutes before current time. ----------------------------Need to change to 60 min before current time
//     var startTime = new Date().getTime() - (60 * 10 * 1000);

    

//     // Listener for when a click is added.
//     clicks.orderByChild('timestamp').startAt(startTime).on('child_added',
//         function (snapshot) {
//             console.log(snapshot.val());
//             // Get that click from firebase.
//             var newPosition = snapshot.val();
//             var point = new google.maps.LatLng(newPosition.lat, newPosition.lng);
//             var elapsed = new Date().getTime() - newPosition.timestamp;

//             // Add the point to  the heatmap.
//             heatmap.getData().push(point);

//             // Requests entries older than expiry time (10 minutes).
//             var expirySeconds = Math.max(60 * 10 * 1000 - elapsed, 0);
//             // Set client timeout to remove the point after a certain time.
//             window.setTimeout(function () {
//                 // Delete the old point from the database.
//                 snapshot.ref().remove();
//             }, expirySeconds);
//         }
//     );

//     // Remove old data from the heatmap when a point is removed from firebase.
//     clicks.on('child_removed', function (snapshot, prevChildKey) {
//         var heatmapData = heatmap.getData();
//         var i = 0;
//         while (snapshot.val().lat != heatmapData.getAt(i).lat()
//             || snapshot.val().lng != heatmapData.getAt(i).lng()) {
//             i++;
//         }
//         heatmapData.removeAt(i);
//     });

//     initFirebase(heatmap);

// } //------------------------------------end initFirebase ------------------------------------------





//  //Updates the last_message/ path with the current timestamp.
//  //@param {function(Date)} addClick After the last message timestamp has been updated,
//  //    this function is called with the current timestamp to add the
//  //    click to the firebase.
 
// function getTimestamp(addClick) {
//     // Reference to location for saving the last click time.
//     var ref = database.ref('last_message/' + data.sender);

//     ref.onDisconnect().remove();  // Delete reference from firebase on disconnect.


//     // Set value to timestamp.
//     ref.set(firebase.database.ServerValue.TIMESTAMP, function (err) {
//         if (err) {  // Write to last message was unsuccessful.
//             console.log(err);
//         } else {  // Write to last message was successful.
//             ref.once('value', function (snap) {
//                 addClick(snap.val());  // Add click with same timestamp.
//             }, function (err) {
//                 console.warn(err);
//             });
//         }
//     });
// }


// //Adds a click to firebase.
// //@param {Object} data The data to be added to firebase.
// //   It contains the lat, lng, sender and timestamp.

// function addToFirebase(data) {
//     getTimestamp(function (timestamp) {
//         // Add the new timestamp to the record data.
//         data.timestamp = timestamp;
//         var ref = database.ref('clicks').push(data, function (err) {
//             if (err) {  // Data was not written to firebase.
//                 console.warn(err);
//             }
//         });
//     });
}