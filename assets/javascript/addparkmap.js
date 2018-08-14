var addParkMap;
var addParkMarkers = [];

function initMap() {
    addParkMap = new google.maps.Map(document.getElementById('add-park-map'), {
        center: {lat: 30.267, lng: -97.743},
        zoom: 13,
        styles: [{
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
            },
            {
            featureType: 'transit.station',
            stylers: [{ visibility: 'off' }]
        }]
    })
};

$(document).ready(function() {

    addParkMap.addListener('click', function(e) {
        placeMarker(e.latLng, addParkMap);
    });

    function placeMarker(position, addParkMap) {
        var addParkMarker = new google.maps.Marker({
            position: position,
            map: addParkMap,
        });
        addParkMap.panTo(position);
        addParkMarkers.push(addParkMarker);

        var lat = addParkMarker.getPosition().lat();
        var lng = addParkMarker.getPosition().lng();

        $("#add-park-map").attr("lat", lat);
        $("#add-park-map").attr("lng", lng);
    };

    function setMapOnAll(addParkMap) {
        for (var i = 0; i < addParkMarkers.length; i++) {
            addParkMarkers[i].setMap(addParkMap);
        }
    };

    function clearMarkers() {
        setMapOnAll(null);
        addParkMarkers = [];
    };

    $("#submit-btn").on("click", function() {
        clearMarkers();
    });

});