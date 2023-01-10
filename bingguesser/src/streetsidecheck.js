
var street_view
var street_view_location
var map

var map_location = {}
var location_list = {}

var existing
var mode = 0

function switchLocation () {
map_location = {name: document.getElementById("name").value, lat: document.getElementById("lat").value, lng: document.getElementById("lng").value,}

street_view_location = new Microsoft.Maps.Location(map_location.lat, map_location.lng)

street_view = new Microsoft.Maps.Map(document.getElementById('street-view'), {
    center: street_view_location,
    mapTypeId: Microsoft.Maps.MapTypeId.streetside,
    showDashboard: false,
    showTermsLink: false,
    enableClickableLogo: false,
    streetsideOptions: {
        overviewMapMode: Microsoft.Maps.OverviewMapMode.hidden,
        showCurrentAddress: false,
        showProblemReporting: false,
        showExitButton: false,
        disablePanoramaNavigation: false,
        panoramaLookupRadius: 10000,
        showHeadingCompass: false,
        showZoomButtons: false,
        onSuccessLoading: function () {console.log('Streetside loaded')},
        onErrorLoading: function () {console.log('Birdseye loaded')}
    }
});
};

function onLatLngInput() {
    let lat = document.getElementById("lat").value
    let lng = document.getElementById("lng").value
    map.entities.clear();
    addPushpin(new Microsoft.Maps.Location(lat, lng), 'Position', `${Number(lat).toFixed(4)} ${Number(lng).toFixed(4)}`)
}

document.getElementById("lat").addEventListener('change', onLatLngInput);
document.getElementById("lng").addEventListener('change', onLatLngInput);

function loadMap() {
map = new Microsoft.Maps.Map(document.getElementById('map'), {
    center: new Microsoft.Maps.Location(0, 0),
    mapTypeId: Microsoft.Maps.MapTypeId.canvasLight,
    zoom: 0,
    showDashboard: false,
    showTermsLink: false,
    enableClickableLogo: false,
});

Microsoft.Maps.Events.addHandler(map, 'click', function(e) {
        map.entities.clear();
        var clickedAt = new Microsoft.Maps.Point(e.getX(), e.getY());
        var location = e.target.tryPixelToLocation(clickedAt);
        addPushpin(new Microsoft.Maps.Location(location.latitude, location.longitude), 'Position', `${location.latitude.toFixed(6)} ${location.longitude.toFixed(6)}`)
        document.getElementById("lat").value = location.latitude.toFixed(6)
        document.getElementById("lng").value = location.longitude.toFixed(6)
});

Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
    var options = {
        maxResults: 4,
        map: map
    };
    var manager = new Microsoft.Maps.AutosuggestManager(options);
    manager.attachAutosuggest('#searchBox', '#searchBoxContainer', selectedSuggestion);
});

};

function selectedSuggestion(suggestionResult) {
    map.entities.clear();
    map.setView({ bounds: suggestionResult.bestView });
    let location_name = suggestionResult.formattedSuggestion.split(",")
    addPushpin(suggestionResult.location, location_name[0], `${suggestionResult.location.latitude.toFixed(6)} ${suggestionResult.location.longitude.toFixed(6)}`)
    document.getElementById("lat").value = suggestionResult.location.latitude.toFixed(6)
    document.getElementById("lng").value = suggestionResult.location.longitude.toFixed(6)
    document.getElementById("name").value = location_name
}

function addPushpin(position, title, subtitle) {
    var Pushpin = new Microsoft.Maps.Pushpin(position,{
        title: title,
        subTitle: subtitle
    });
    map.entities.push(Pushpin)
};

function saveLocation() {
    let lat = document.getElementById("lat").value
    let lng = document.getElementById("lng").value
    let name = document.getElementById("name").value
    if (name != "" && (lat != "" && lng != "")) {
    if (!existing[name]) {
    location_list[name] = {"lat": Number(lat), "lng": Number(lng)};
    document.getElementById("list").innerText = `${Object.keys(location_list)} ~ ${Number(lat).toFixed(2)} ~ ${Number(lng).toFixed(2)}`;
} else {alert("Dieser Ort ist bereits gespeichert")};
} else {alert("Name, Latitude oder Longitude fehlt")};
};

function copyLocations() {
    navigator.clipboard.writeText(JSON.stringify(location_list));
};

async function loadExisting () {
    async function getJSON() {
    try {
      const response = await fetch('/bingguesser/src/locations.json');
      return response.json();
    } catch (error) {
      console.error(error);
    }
};
existing = await getJSON()
document.getElementById("existing-list").innerText = Object.keys(existing);
loadMap()
};

alert('💾 Laden => Lädt bereits gespeicherte Orte und die Karte\n💾 Speichern => Speichert den makierten Punk\n📋 Kopieren => Kopiert deine gespeicherten Orte in die Zwischenablage\n🗺 Spawnen => Startet Streetview auf der Markierten stelle\n📄 Ortsnamen => Suche einen beliebigen Ort mithilfe des Namen\n📄 Name => Der Name der zum Speichern verwendet wird\n📄 Latitude => Breitengrad der zum Speichern verwendet wird\n📄 Longitude => Längengrad der zum Speichern verwendet wird')