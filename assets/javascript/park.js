$(document).ready(function () {

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
    console.log("keyNeeded: " , keyNeeded);
    
    database.ref().child(keyNeeded).on('value', function(snapshot){
        console.log(snapshot.val().parkName);
    
        $("#park-name").text(snapshot.val().parkName);
        $("#miles-away").text(snapshot.val().milesAway);
        $("#recent-check-ins").text(snapshot.val().checkIns);
        $("#leash").text(snapshot.val().leashCheck);
        $("#fence").text(snapshot.val().fenceCheck);
        $("#swim").text(snapshot.val().swimCheck);
        $("#shade").text(snapshot.val().shadeCheck);
        $("#picnic").text(snapshot.val().picnicCheck);
        $("#water").text(snapshot.val().waterCheck);

     });

}); 