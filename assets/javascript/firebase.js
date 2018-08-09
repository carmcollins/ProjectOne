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

    //when submit button is clicked, push to database
    $("#submit-btn").on("click", function () {
        var parkName = $("#park-name-input").val().trim();
        var location = $("#location-input").val().trim();
        var leashCheck = $("#leash-check").val().trim();
        var fenceCheck = $("#fence-check").val().trim();
        var swimCheck = $("#swim-check").val().trim();
        var shadeCheck = $("#shade-check").val().trim();
        var picnicCheck = $("#picnic-check").val().trim();
        var waterCheck = $("#water-check").val().trim();

        database.ref().push({
            parkName: parkName,
            location: location,
            options: {
                leashCheck: leashCheck,
                fenceCheck: fenceCheck,
                swimCheck: swimCheck,
                shadeCheck: shadeCheck,
                picnicCheck: picnicCheck,
                waterCheck: waterCheck
            }

        })

    });

    //when a new park is added send to html
    database.ref().on("child_added", function (childSnapshot) {
        var parkName = childSnapshot.val().parkName;
        //var milesAway=
        // var recentCheckIns=
        var recentCheckins = childSnapshot.val().parkName;


        //push to park page
        for (var i = 0; i < childSnapshot.options.length; i++) { 
            if(childSnapshot.options[i]===true){
                var item= childSnapshot.val().options[i];
                var newListItem = $("<li>");
                newListItem.text(item);


            }
        }
               

        });


    });

//onclick for checkin-button