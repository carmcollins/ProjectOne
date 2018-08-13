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
    var parkName;
    var milesAway;
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
        } else {
            leashCheck = ("Requires Leash");
        }
        var fenceCheck = false;
        if (($("#fence-check").is(":checked"))) {
            fenceCheck = ("Fenced In");
        } else {
            fenceCheck = ("Not Fenced-In");
        }
        var swimCheck = false;
        if (($("#swim-check").is(":checked"))) {
            swimCheck = ("Swimming Hole");
        } else {
            swimCheck = ("No Swimming Hole");
        }
        var shadeCheck = false;
        if (($("#shade-check").is(":checked"))) {
            shadeCheck = ("Shaded Areas");
        } else {
            shadeCheck = ("No Shaded Areas");
        }
        var picnicCheck = false;
        if (($("#picnic-check").is(":checked"))) {
            picnicCheck = ("Picnic Tables");
        } else {
            picnicCheck = ("No Picnic Tables");
        }
        var waterCheck = false;
        if (($("#water-check").is(":checked"))) {
            waterCheck = ("Water Fountains");
        } else {
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
        //clear input boxes and reset the checkboxes
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
        // var location = childSnapshot.val().location;
        var milesAway = 0; //need to figure this one out
        var leashCheck = childSnapshot.val().leashCheck;
        var fenceCheck = childSnapshot.val().fenceCheck;
        var swimCheck = childSnapshot.val().swimCheck;
        var shadeCheck = childSnapshot.val().shadeCheck;
        var picnicCheck = childSnapshot.val().picnicCheck;
        var waterCheck = childSnapshot.val().waterCheck;
        var checkIns = childSnapshot.val().checkIns;

        newCardDiv = $("<div class='card card-body mt-3 mb-3'>");
        newMediaDiv = $("<div class='media'>");
        newCardDiv.append(newMediaDiv);
        // newImageTag = $("<img class='align-self-start mr-3' " + "src=" + newParkImage + " alt='park-image'>")
        // newMediaDiv.append(newImageTag);
        newMediaBodyDiv = $("<div class='media-body'>");
        newMediaDiv.append(newMediaBodyDiv);
        newMediaBodyDiv.html(
            "<h5 class='mt-0'>" + parkName +
            "<h6 class='card-subtitle mb-2 text-muted'>" + milesAway +
            "<p>" + "Recent Check Ins:" + checkIns + "<br>" +
            "<a href='park.html' class='btn btn-primary more-info'>" + "More Info" + "</a>");
        $("#listWrapper").append(newCardDiv);

        // when more info is clicked on list page populate the park.html page
        // $("#park-name").html(this.parkName);
        // $("#park-name").text(parkName);
        // $("#miles-away").text(milesAway);
        // $("#recent-check-ins").text(checkIns);
        // $("#leash").text(leashCheck);
        // $("#fence").text(fenceCheck);
        // $("#swim").text(swimCheck);
        // $("#shade").text(shadeCheck);
        // $("#picnic").text(picnicCheck);
        // $("#water").text(waterCheck);
        //     console.log("park name inside onclick: " + parkName) // this prints all parkNames from list-view.html

        // console.log(parkName); // lists all named parks
        // *********************** UPDATE *********************** kinda working!!!!!!!!
        // It will console the name you click, but also all names that follow in the database

        $(".more-info").on("click", function () {
            var number = 15;
            console.log(number); //undefined
        }); // end of .more-info onClick

    }); // end of database.ref()


    // console.log("undefined?" + parkName); // undefined

}); // end of document.ready



// ***********************issues***********************
// fyi - having moreInfo() outside of database.ref() stops the repeative function calls per list item. one call, not three

// ***********************
// stuff that didn't work...

// var indiv = $(this).html("<h5 class='mt-0'>" + parkName +
// "<h6 class='card-subtitle mb-2 text-muted'>" + milesAway +
// "<p>" + "Recent Check Ins:" + checkIns + "<br>" +
// "<a href='park.html' class='btn btn-primary more-info'>" + "More Info" + "</a>");
// console.log(indiv);
// $("#card-body").text(indiv);

// pushing to indivdual page
// $(".more-info").on("click", function (event) {
//     event.preventDefault();
//     var parkName = $("#park-name").append(parkName);
//     var checkIns = $("#recent-check-ins").append(checkIns);
//     console.log(indParkName);

// moreInfo();
// console.log(parkName + "inside .more-info")
// database.ref().push({
// parkName: parkName,
// location: location,
// leashCheck: leashCheck,
// fenceCheck: fenceCheck,
// swimCheck: swimCheck,
// shadeCheck: shadeCheck,
// picnicCheck: picnicCheck,
// waterCheck: waterCheck,
// checkins: checkIns
// });
// })

// function moreInfo() {
//     var name = this.parkName;
//     $("#park-name").text(name);
//     // $("#park-name").text(this.parkName);
//     // $(this).text(milesAway);
//     console.log("in the moreInfo function");
//     console.log(name); // undefined
// }
// moreInfo()