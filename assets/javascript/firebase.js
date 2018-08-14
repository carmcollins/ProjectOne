//initialize firebase    
var config = {
    apiKey: "AIzaSyBIdeaYIvc47L5bC-9iBvfqZIu8Mt7BAcs",
    authDomain: "tailwag-fa1c7.firebaseapp.com",
    databaseURL: "https://tailwag-fa1c7.firebaseio.com",
    projectId: "tailwag-fa1c7",
    storageBucket: "tailwag-fa1c7.appspot.com",
    messagingSenderId: "542472737315"
};

firebase.initializeApp(config);

$(document).ready(function () {



    var database = firebase.database();

   

    //when submit button is clicked, push form info to database
    $("#submit-btn").on("click", function (event) {
        event.preventDefault()

        if (!$("#park-name-input").val()) {
            $(".error-message").text("Please enter a park name");
        } else {
            var checkIns = 0;
            var parkName = $("#park-name-input").val().trim();
            var parkLat = $("#add-park-map").attr("lat");
            var parkLng = $("#add-park-map").attr("lng");
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

            database.ref('parks').push({
                parkName: parkName,
                parkLat: parkLat,
                parkLng: parkLng,
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
            $("input[type=checkbox]").prop('checked', false);
            $(".error-message").text("");
        }


    });

    //push park info to dog park page
    database.ref('parks').on("child_added", function (childSnapshot) {
        var parkName = childSnapshot.val().parkName;
        var milesAway = 0; //need to figure this one out
        var parkKey = childSnapshot.key;

        newCardDiv = $("<div class='card card-body mt-3 mb-3'>");
        newMediaDiv = $("<div class='media'>");
        newCardDiv.append(newMediaDiv);
        newImageDiv = $("<div class='col-sm-6 p-0'>");
        newMediaDiv.append(newImageDiv);
        newImageTag = $("<img class='align-self-start mr-3 responsive' src='assets/photos/pup2.jpeg' alt='pup'>")
        newImageDiv.append(newImageTag);
        newBodyDiv = $("<div class='col-sm-6 pl-4 pr-0'>");
        newMediaDiv.append(newBodyDiv);
        newMediaBodyDiv = $("<div class='media-body'>")
        newBodyDiv.append(newMediaBodyDiv);
        newMediaBodyDiv.html(
            "<h5 class='mt-0'>" + parkName +
            "<h6 class='card-subtitle mb-2 text-muted'>" + milesAway + " miles away" + "<br>" + "<br>" +
            "<form method='get' action='park.html'>" +
            "<button type='submit button' class='btn btn-success more-info' data-key='" + parkKey + "'" + ">" + "More Info" + "</button>" 
            + "</form>"
        )
        //$(".more-info-" + parkKey).attr("key", parkKey);
        $("#listWrapper").append(newCardDiv);


        //when more info is clicked on list page populate the park.html page

        //});

        $(document).on("click", ".more-info", function () {
            var key = $(this).attr("data-key");
            console.log($(this).attr("data-key"));
            sessionStorage.setItem("key", key);
        });

    });





});