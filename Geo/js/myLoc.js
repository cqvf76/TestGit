window.onload = getMyLocation;

var map;
var watchId = null;

var hfCoords = {
	latitude: 47.624851,
	longitude: -122.52099
};

function getMyLocation() {
	document.getElementById("location").innerHTML = "Wait for location ";
	if (navigator.geolocation) {
		//navigator.geolocation.getCurrentPosition(displayLocation,displayError);
		document.getElementById("watch").onclick = watchLocation;
		document.getElementById("clearWatch").onclick = clearWatch;
	} else {
		alert("no Geo Support");
	}

}

function displayLocation(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	document.getElementById("location").innerHTML = "You are at Latitude: "+latitude+", Longitude: "+longitude;
	document.getElementById("location").innerHTML += "(with "+ position.coords.accuracy + " meters accuracy)";

	var km = computeDistance(position.coords, hfCoords);
	document.getElementById("distance").innerHTML = "You are "+ km + " km away from the HF";

	showMap(position.coords);
}

function displayError(error){
	var errorTypes = {
		0: "Unknown Error",
		1: "Permission Denied",
		2: "Position not Available",
		3: "Time out"
	};

	var errorMessage = errorTypes[error.code];

	document.getElementById("location").innerHTML = errorMessage;
}

//function to calculate distance between 2 points of sphere.
function computeDistance(startCoords, destCoords){
	var startLatRads = degreesToRadians(startCoords.latitude);
	var startLongRads = degreesToRadians(startCoords.longitude);
	var destLatRads = degreesToRadians(destCoords.latitude);
	var destLongRads = degreesToRadians(destCoords.longitude);

	var Radius = 6371; //radius of earth in KM
	var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
					Math.cos(startLatRads) * Math.cos(destLatRads) *
					Math.cos(startLongRads - destLongRads)) * Radius;

	return distance;
}

function degreesToRadians(degrees){
	var radians = (degrees * Math.PI)/180;
	return radians;
}

function showMap(coords){
	var googleLatAndLong = new google.maps.LatLng(coords.latitude,coords.longitude);

	var mapOptions = {
		zoom: 15,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);

	var title = "Marathahalli"
	var content = "You are here: "+ coords.latitude + ", " + coords.longitude;
	addMarker(map, googleLatAndLong, title, content);

}

function addMarker(map, latlong, title, content){
	var markerOptions = {
		position: latlong,
		map: map,
		title: title,
		clickable: true
	};
	var marker = new google.maps.Marker(markerOptions);

	var infoWindowOptions = {
		content: content,
		position: latlong
	};
	var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

	google.maps.event.addListener(marker, "click", function(){
		infoWindow.open(map);
	});
}

function watchLocation(){
	watchId = navigator.geolocation.watchPosition(displayLocation,displayError);
}

function clearWatch(){
	if(watchId){
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
	}
}
