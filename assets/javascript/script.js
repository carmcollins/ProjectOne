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

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            positionLat = position.coords.latitude;
            positionLng = position.coords.longitude;

            //getCoords(positionLat, positionLng);


           
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
            return pos;

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });

        //************************************ current location */
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    // function getCoords(lat, lng) {
    //     console.log(lat) // current positions!!
    //     console.log(lng) 
        
    //     // database.ref('parks').on('child_added', function (snapshot) {
    //     //     for (var i = 0; i<snapshot.length; i++){
    //     //         pLocationLat= snapshot.val().parkLat;
    //     //         pLocationLng= snapshot.val().parkLng;
    //     //         pLocation = (pLocationLat, pLocationLng);//lon2
    //     //         currentLocation= (lat, lng); //lon1
    //     //         dlon = pLocationLng - lng;
    //     //         dlat = pLocationLat - lat;
    //     //         a = (sin(dlat/2))^2 + cos(lat) * cos(pLocation) * (sin(dlon/2))^2;
    //     //         c = 2 * atan2 ( sqrt(a), sqrt(1-a));
    //     //         distance = 6371 * c;
    //     //         milesAway = distance * (.62137119);
    //     //         $("#miles-away").text(milesAway);

                
    //     //     }
            
    //         console.log(snapshot.parkLat)
    //         //take lat and lng current and lat lng of park snapshot.val().parkLat
    //     })

    // }



    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }


    // add marker array
    var markers = [


        // {
        //     coords: {
        //         lat: 30.291163,
        //         lng: -97.787247
        //     },
        //     title: 'Red Bud Isle'

        // },

        // {

        //     coords: {
        //         lat: 30.249140,
        //         lng: -97.736471
        //     },
        //     title: 'Norwood Estates Dog Park'

        // },

        // {

        //     coords: {
        //         lat: 30.263507,
        //         lng: -97.753170
        //     },
        //     title: 'Auditorium Shores Dog Park'

        // },

        // {

        //     coords: {
        //         lat: 30.266909,
        //         lng: -97.772870
        //     },
        //     title: 'Zilker Metropolitan'


        // }
    ];

    database.ref('parks').on("child_added", function (childSnapshot) {
        var title = childSnapshot.val().parkName;

        var latitude = parseFloat(childSnapshot.val().parkLat);
        var longitude = parseFloat(childSnapshot.val().parkLng);
        var parkKey = childSnapshot.key;
        console.log(title);
        console.log(latitude);
        console.log(longitude);
        
        var newPark = {
            coords: {
                lat: latitude,
                lng: longitude
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

    function createMarker(i) {



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
             function calcDistance(lat1, lon1, lat2, lon2) 
                {
                  var R = 6371; // km
                  var dLat = toRad(lat2-lat1);
                  var dLon = toRad(lon2-lon1);
                  var lat1 = toRad(lat1);
                  var lat2 = toRad(lat2);
            
                  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                  var d = R * c; // in kilometers
                  miles = (0.62137119 * d);
                    miles = miles.toFixed(2);
                $(".miles-away").text(miles);

                 
                }
                calcDistance(lat1, lon1, lat2, lon2);
            
                // Converts numeric degrees to radians
                function toRad(x) 
                {
                    return x * Math.PI / 180;
                }
            
                // currentLocation= (positionLat, positionLng);
                // pLocationLat1 = parseFloat(e.latLng.lat());
                // pLocationLng1 = parseFloat(e.latLng.lng());
                // dlon = pLocationLng - positionLng;
                // dlat = pLocationLat - positionLat;
                // var a = (Math.sin(dlat/2))^2 + Math.cos(positionLat) * Math.cos(pLocationLat) * (Math.sin(dlon/2))^2;
                // console.log("a", a);
                // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                // console.log("c", c);
                // var distance = 6371 * c;
                // console.log("distance", distance);
                // var milesAway = distance * .62137119;
                // console.log("milesAway type: " + typeof milesAway);
                // console.log("miles away", milesAway);
                // $("#miles-away").text(milesAway);
            
                


            // $('#checkIn').bind('click', function (e) {
            //     // console.log("check in")
            //     data.lat = e.latLng.lat();
            //     data.lng = e.latLng.lng();
            //     addToFirebase(data);
            // });
        });

// Jenni's work on heat map

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
   
 }    



// Brit heatmap starts here


//     heatmap = new google.maps.visualization.HeatmapLayer({
//         data: [],
//         map: map,
//         radius: 16
//     });

 }  //end init map 




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
//    }

