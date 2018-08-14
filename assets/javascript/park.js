$(document).ready(function () {

    $(".check-out").hide();

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

    var keyNeeded = sessionStorage.getItem("key")

    // miles away stuff
//     var positionLat = 0;
//     var positionLng = 0;

//  if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function (position) {

//             lat= position.coords.latitude,
//             lng= position.coords.longitude
//         });}

//         positionLat = position.coords.latitude;
//         positionLng = position.coords.longitude;
//         console.log("lat: " + positionLat);
//         console.log("lng: " + positionLng);

        // getCoords(positionLat, positionLng);
        // function getCoords(lat, lng) {
        //     console.log(lat) 
        //     console.log(lng) 

    
            // $("#park-name").text(snapshot.val().parkName);
        //     database.ref('parks').on('child_added', function (snapshot) {
        //         console.log("in db " + snapshot.val().parkLat); /// this is printing for every entry in db.
        //     })
    
        // }
//end of miles away stuff


    database.ref('parks').child(keyNeeded).on('value', function (snapshot) {
        $("#park-name").text(snapshot.val().parkName);
        $("#miles-away").text(snapshot.val().milesAway);
        $("#recent-check-ins").text(snapshot.val().checkIns);
        $("#leash").text(snapshot.val().leashCheck);
        $("#fence").text(snapshot.val().fenceCheck);
        $("#swim").text(snapshot.val().swimCheck);
        $("#shade").text(snapshot.val().shadeCheck);
        $("#picnic").text(snapshot.val().picnicCheck);
        $("#water").text(snapshot.val().waterCheck);

        var checkIns= snapshot.val().checkIns;

        $(document).on("click", ".check-in", function (event) {
            event.preventDefault()
            checkIns++;
            $(".check-in").hide();
            $(".check-out").show();

            database.ref('parks').child(keyNeeded).update({
                checkIns: checkIns
            });
            database.ref('parks').child(keyNeeded).on('value', function (snapshot) {
                $("#recent-check-ins").text(snapshot.val().checkIns);
            });

        });

        $(document).on("click", ".check-out", function (event) {
            event.preventDefault()
            checkIns--;
            $(".check-out").hide();
            $(".check-in").show();

            database.ref('parks').child(keyNeeded).update({
                checkIns: checkIns
            });
            database.ref('parks').child(keyNeeded).on('value', function (snapshot) {
                $("#recent-check-ins").text(snapshot.val().checkInCount);
            });

        });

    });

});