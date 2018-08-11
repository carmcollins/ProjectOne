// GOOGLE MAPS
function initMap() {

    var options = {
        zoom: 14,
        center: {lat: 30.2457,lng:-97.7688}
    }
    
    var map = new google.maps.Map(document.getElementById('map'), options);

    // var mySpot = {lat:30.2918274,lng:-97.78914559999998};
    // var marker = new google.maps.Marker({position: mySpot, map: map});
	// marker.addListener('click', function() {
    //     infoWindow.open(map,marker);
    // });
    // infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {
        
        var pos = 
            {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

        var marker = 
            new google.maps.Marker({
                position: pos,
                map: map
            });

        var infoWindow =
            new google.maps.InfoWindow({
                content:'<h1> current location </h1>'
            });

        marker.addListener('click', function() {
		 	console.log('clicked');
		 	infoWindow.open(map,marker);
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
            // If browser doesn't support geolocation
            handleLocationError(false, infoWindow, map.getCenter());
    };
        
    // Array to add markers
    var markerss = [
    
        // {coords:
        //     { lat: position.coords.latitude,
        //     lng: position.coords.longitude },
        //     content: '<h1> current location </h1>'
        // },
        
        {
            coords: { lat: 30.291163, lng: -97.787247 },
            content: '<h1>1</h1>'
        },
        {
            coords: { lat: 30.249140, lng: -97.736471},
            content: '<h1>2</h1>'
        },
        {
            coords: { lat: 30.263507, lng: -97.753170},
            content: '<h1>3</h1>'
        },
        {
            coords: { lat: 30.266909, lng: -97.772870},
            content: '<h1>4</h1>'
        }
    ];

    // marker.setMap(map);
    for(var i = 0;i < markerss.length; i++) {
        console.log(markerss[i]);
        addMarker(markerss[i]);
        console.log('this worksX');
    };
		 
    // Function for adding markers to map
    function addMarker(props) {
        var marker = new google.maps.Marker({
            position:props.coords,
            map:map,
            icon:props.iconImage
        });

        //check for marker function
        console.log('this works');
        
        if(props.iconImage) {
		    //set icon image
		    marker.setIcon(props.iconImage);
        }
        
		// check contant
		if(props.content) {
		 	console.log(props.content);
		 	var infoWindow = new google.maps.InfoWindow({content:props.content});
		}
        
        marker.addListener('click', function() {
            console.log('clicked');
            infoWindow.open(map,marker);
        });
        
        marker.setMap(map);
    }};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
};





// WEATHER PAGE
var APIKey = "11631bfd75b571a520255fbeaeaeef02";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=austin&appid=" + APIKey;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);

    $("#description").text(response.weather[0].main);
    
    var sunriseTime = moment(response.sys.sunrise, "X").format("h:mm A");
    var sunsetTime = moment(response.sys.sunset, "X").format("h:mm A");
    $("#sunrise-time").text(sunriseTime);
    $("#sunset-time").text(sunsetTime);
    
    $("#humidity").text(response.main.humidity + "%");
    $("#wind").text(response.wind.speed + " MPH"); 

    var kTemp = response.main.temp;
    var fTemp = Math.floor((kTemp - 273.15) * 1.80 + 32);
    $("#temp").text(fTemp + " F");
});




// INITIALIZING FIREBASE   
var config = {
    apiKey: "AIzaSyBIdeaYIvc47L5bC-9iBvfqZIu8Mt7BAcs",
    authDomain: "tailwag-fa1c7.firebaseapp.com",
    databaseURL: "https://tailwag-fa1c7.firebaseio.com",
    projectId: "tailwag-fa1c7",
    storageBucket: "",
    messagingSenderId: "542472737315"
};

firebase.initializeApp(config);

var database = firebase.database();

// When submit button is clicked, send info to database
$("#submit-btn").on("click", function (event) {
    event.preventDefault()

    var parkName = $("#park-name-input").val().trim();
    var location = $("#location-input").val().trim();

    var leashCheck = false;
    if ($("#leash-check").is(":checked")) {
        leashCheck = ("Off-Leash");
    }
    else {
        leashCheck = ("Requires Leash");
    }

    var fenceCheck = false;
    if ($("#fence-check").is(":checked")) {
        fenceCheck = ("Fenced In");
    }
    else {
        fenceCheck = ("Not Fenced-In");
    }

    var swimCheck = false;
    if ($("#swim-check").is(":checked")) {
        swimCheck = ("Swimming Hole");
    }
    else {
        swimCheck = ("No Swimming Hole");
    }

    var shadeCheck = false;
    if ($("#shade-check").is(":checked")) {
        shadeCheck = ("Shaded Areas");
    }
    else {
        shadeCheck = ("No Shaded Areas");
    }

    var picnicCheck = false;
    if ($("#picnic-check").is(":checked")) {
        picnicCheck = ("Picnic Tables");
    }
    else {
        picnicCheck = ("No Picnic Tables");
    }

    var waterCheck = false;
    if ($("#water-check").is(":checked")) {
        waterCheck = ("Water Fountains");
    }
    else {
        waterCheck = ("No Water Fountains");
    }

    database.ref().push({
        parkName: parkName,
        location: location,
        leashCheck: leashCheck,
        fenceCheck: fenceCheck,
        swimCheck: swimCheck,
        shadeCheck: shadeCheck,
        picnicCheck: picnicCheck,
        waterCheck: waterCheck,
    });

    // Clears input boxes and resets checkboxes
    $("#park-name-input").val("");
    $("#location-input").val("");;
    $("input[type=checkbox]").prop('checked', false);
});

// //when check-in button is pushed
// $("#checkInBtn").on("click", function (event) {
//     event.preventDefault()
//     checkIns++;
//how do we connect the clicks to the specific park in firebase?

//need to do an on click event for when the location pin is clicked do the following:

//push park info to dog park page
database.ref().on("child_added", function (childSnapshot) {
    var parkName = childSnapshot.val().parkName;
    var location = childSnapshot.val().location;
    var milesAway = 0; //need to figure this one out
    var leashCheck = childSnapshot.val().leashCheck;
    var fenceCheck = childSnapshot.val().fenceCheck;
    var swimCheck = childSnapshot.val().swimCheck;
    var shadeCheck = childSnapshot.val().shadeCheck;
    var picnicCheck = childSnapshot.val().picnicCheck;
    var waterCheck = childSnapshot.val().waterCheck;
    var checkIns = childSnapshot.val().checkIns;
    var parkImage = childSnapshot.val().parkImage;

    newCardDiv = $("<div class='card card-body mt-3 mb-3'>");
    newMediaDiv = $("<div class='media'>");
    newCardDiv.append(newMediaDiv);
    newImageTag = $("<img class='align-self-start mr-3' " + "src=" + parkImage + " alt='park-image'>")
    newMediaDiv.append(newImageTag);
    newMediaBodyDiv = $("<div class='media-body'>")
    newMediaDiv.append(newMediaBodyDiv);
    newMediaBodyDiv.html(
        "<h5 class='mt-0'>" + parkName +
        "<h6 class='card-subtitle mb-2 text-muted'>" + milesAway +
        "<p>" + "Recent Check Ins:" + checkIns + "<br>" +
        "<a href='park.html' class='btn btn-primary more-info'>" + "More Info" + "</a>"

    )

    $("#listWrapper").append(newCardDiv);

    //when more info is clicked on list page populate the park.html page
    $(document).on("click", ".more-info", function () {
        $("#park-name").text(parkName);
        $("#miles-away").text(milesAway);
        $("#recent-check-ins").text(checkIns);
        $("#leash").text(leashCheck);
        $("#fence").text(fenceCheck);
        $("#swim").text(swimCheck);
        $("#shade").text(shadeCheck);
        $("#picnic").text(picnicCheck);
        $("#water").text(waterCheck);
    });
});