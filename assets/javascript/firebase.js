$(document).ready(function () {

    //initialize firebase    
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

    var checkins = 0;

    //when submit button is clicked, push form info to database
    $("#submit-btn").on("click", function (event) {
        event.preventDefault()
        var checkIns = 0;
        var parkName = $("#park-name-input").val().trim();
        var location = $("#location-input").val().trim();
        var leashCheck = false;
        if (($("#leash-check").is(":checked"))) {
            leashCheck = ("Off-Leash");
        }
        else {
            leashCheck = ("Requires Leash");
        }
        var fenceCheck = false;
        if (($("#fence-check").is(":checked"))) {
            fenceCheck = ("Fenced In");
        }
        else {
            fenceCheck = ("Not Fenced-In");
        }
        var swimCheck = false;
        if (($("#swim-check").is(":checked"))) {
            swimCheck = ("Swimming Hole");
        }
        else {
            swimCheck = ("No Swimming Hole");
        }
        var shadeCheck = false;
        if (($("#shade-check").is(":checked"))) {
            shadeCheck = ("Shaded Areas");
        }
        else {
            shadeCheck = ("No Shaded Areas");
        }
        var picnicCheck = false;
        if (($("#picnic-check").is(":checked"))) {
            picnicCheck = ("Picnic Tables");
        }
        else {
            picnicCheck = ("No Picnic Tables");
        }
        var waterCheck = false;
        if (($("#water-check").is(":checked"))) {
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
            checkIns: checkIns


        });
        //clear input boxes and reset the checkboxes
        $("#park-name-input").val("");
        $("#location-input").val("");;
        $("input[type=checkbox]").prop('checked', false);


    });

    //when check-in button is pushed
    $("#checkInBtn").on("click", function (event) {
        event.preventDefault()
        checkIns++;
        //how do we connect the clicks to the specific park in firebase?

    //need to do an on click event for when the location pin is clicked do the following:

            //push park info to dog park page
            database.ref().on("child_added", function (childSnapshot) {
                var parkName = childSnapshot.val().parkName;
                var location = childSnapshot.val().location;
                //var milesAway= need to take location and translate into long and lat and connect to api
                var leashCheck = childSnapshot.val().leashCheck;
                var fenceCheck = childSnapshot.val().fenceCheck;
                var swimCheck = childSnapshot.val().swimCheck;
                var shadeCheck = childSnapshot.val().shadeCheck;
                var picnicCheck = childSnapshot.val().picnicCheck;
                var waterCheck = childSnapshot.val().waterCheck;
                var checkIns = childSnapshot.val().checkIns;

        $("#park-name").text(parkName);
        //need to populate the miles away  
        $("#recent-check-ins").text(checkIns);
        $("#leash").text(leashCheck);
        $("#fence").text(fenceCheck);
        $("#swim").text(swimCheck);
        $("#shade").text(shadeCheck);
        $("#picnic").text(picnicCheck);
        $("#water").text(waterCheck);
         
    
            });





});


});


//onclick for checkin-button