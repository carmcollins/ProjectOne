// $(document).ready(function(){




// Initialize Firebase
var config = {
  apiKey: "AIzaSyC5OV8bUEldiBqtoJPICU_Vxgr6kn0bzR8",
  authDomain: "test-project-one-d1d19.firebaseapp.com",
  databaseURL: "https://test-project-one-d1d19.firebaseio.com",
  projectId: "test-project-one-d1d19",
  storageBucket: "",
  messagingSenderId: "1054884338656"
};
firebase.initializeApp(config);

// var firebase = firebase.database();

//================================================================


//Data object to be written to Firebase.

var data = {
  sender: null,
  timestamp: null,
  lat: null,
  lng: null
};

function makeInfoBox(controlDiv, map) {
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '2px';
  controlUI.style.marginBottom = '22px';
  controlUI.style.marginTop = '10px';
  controlUI.style.textAlign = 'center';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '100%';
  controlText.style.padding = '6px';
  controlText.textContent = 'The map shows all clicks made in the last 10 minutes.';
  controlUI.appendChild(controlText);
}


//Creates a map object with a click listener and a heatmap.

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



  // TEMP MARKER, REPLACE WITH LOOP FOR ALL MARKERS========================================================================

  var marker = new google.maps.Marker({
    position: { lat: 30.291163, lng: -97.787247 },
    map: map,
    title: 'Red Bud Isle'
  });
  

  //create info window to pop up over marker
  var infoWindow = new google.maps.InfoWindow({
    content: '<div id="infoWindow">'
      + '<div id="bodyContent">'
      + '<h3>' + marker.title + '</h3>'
      + '<span>' + "Recent Checkins: " + "0" + '</span>' + '<button id="checkIn">Check In ' + '</button><br>'    //replace X with num clicks in last hour for specific park

      + '<a href="../../park.html" id="moreInfo">More Info</a>'    //needs to populate with 'this' park.html
      + '<button id="distance">Drive distance: ' + 'X miles' + '</button>'
      + '</div>'
      + '</div>'

    
  });



  //================================================================================================
  
  // Create the DIV to hold the control and call the makeInfoBox() constructor
  // passing in this DIV.
  var infoBoxDiv = document.createElement('div');
  makeInfoBox(infoBoxDiv, map);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);



  // Listen for marker click, opens infoWindow, listens for check in click
  marker.addListener('click', function (e) {
    infoWindow.open(map, marker);

    $('#checkIn').bind('click', function () {
      console.log("check in")
      data.lat = e.latLng.lat();
      data.lng = e.latLng.lng();
      addToFirebase(data);
    });

  });




  // Create a heatmap.
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map,
    radius: 16
  });



  initFirebase(heatmap);
  marker.setMap(map);

} // ---------------------------------end initMap --------------------------------------------

// initMap();



/**
 * Set up a Firebase with deletion on clicks older than expirySeconds
 * @param {!google.maps.visualization.HeatmapLayer} heatmap The heatmap to
 * which points are added from Firebase.
 */
function initFirebase(heatmap) {

  // 10 minutes before current time. ----------------------------Need to change to 60 min before current time
  var startTime = new Date().getTime() - (60 * 10 * 1000);

  // Reference to the clicks in Firebase.
  var clicks = firebase.database().ref('clicks');

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
    while (snapshot.val().lat != heatmapData.getAt(i).lat()
      || snapshot.val().lng != heatmapData.getAt(i).lng()) {
      i++;
    }
    heatmapData.removeAt(i);
  });

} //------------------------------------end initFirebase ------------------------------------------




/**
 * Updates the last_message/ path with the current timestamp.
 * @param {function(Date)} addClick After the last message timestamp has been updated,
 *     this function is called with the current timestamp to add the
 *     click to the firebase.
 */
function getTimestamp(addClick) {
  // Reference to location for saving the last click time.
  var ref = firebase.database().ref('last_message/' + data.sender);

  ref.onDisconnect().remove();  // Delete reference from firebase on disconnect.


  // Set value to timestamp.
  ref.set(firebase.database.ServerValue.TIMESTAMP, function (err) {
    if (err) {  // Write to last message was unsuccessful.
      console.log(err);
    } else {  // Write to last message was successful.
      ref.once('value', function (snap) {
        addClick(snap.val());  // Add click with same timestamp.
      }, function (err) {
        console.warn(err);
      });
    }
  });
}

/**
 * Adds a click to firebase.
 * @param {Object} data The data to be added to firebase.
 *     It contains the lat, lng, sender and timestamp.
 */
function addToFirebase(data) {
  getTimestamp(function (timestamp) {
    // Add the new timestamp to the record data.
    data.timestamp = timestamp;
    var ref = firebase.database().ref('clicks').push(data, function (err) {
      if (err) {  // Data was not written to firebase.
        console.warn(err);
      }
    });
  });
}


// });


