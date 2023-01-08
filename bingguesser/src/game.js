import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getDatabase, ref, onValue, set, child, get, push, update } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js';

const gameid = window.location.search

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }}
    return "";
}

function getRandomFloat () {
    if (Math.random() > 0.5) {return Math.random()/10}
    else {return -(Math.random()/10)};
};

async function getJSON() {
    try {
      const response = await fetch('/bingguesser/src/locations.json');
      return response.json();
    } catch (error) {
      console.error(error);
    }
}

const playerName = getCookie("username")
const firebaseConfig = JSON.parse(document.getElementById("key").innerHTML)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

// refs

const refGame = ref(db, 'bingguesser/' + gameid); // reference to the game
const refLocation = ref(db, 'bingguesser/' + gameid + '/location')
const refPlayers = ref(db, 'bingguesser/' + gameid + '/player'); // reference to all players
const refPlayer = ref(db, 'bingguesser/' + gameid + '/player/' + playerName); // reference to a specific player
const refPlayerGuess = ref(db, 'bingguesser/' + gameid + '/player/' + playerName + '/guess');

// global vars

var street_view_location
var center_map_location

var map
var street_view
var locationsJSON
var userClicked = {lat: undefined, lng: undefined}

// async functions

async function getHost() {
    return new Promise((resolve) => {
      onValue(refPlayer, (snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val().isHost)} else {
          resolve(false);
}})})};

async function getMaxRounds() {
    return new Promise((resolve) => {
        onValue(refGame, (snapshot) => {
        resolve(snapshot.val().maxRounds)}
)})};

async function getRound() {
    return new Promise((resolve) => {
        onValue(refGame, (snapshot) => {
        resolve(snapshot.val().round)}
)})};

async function getDifficulty() {
    return new Promise((resolve) => {
        onValue(refGame, (snapshot) => {
        resolve(snapshot.val().difficulty)}
)})};

var maxRounds = await getMaxRounds();
var round = await getRound();
var difficulty = await getDifficulty();
var isHost = await getHost();

// functions

function getRandomLocation() {
    const city = Object.keys(locationsJSON)[Math.floor(Math.random() * Object.keys(locationsJSON).length)];
    return {name: city, ...locationsJSON[city]};
};

function newRound(lat, lng) {
    document.getElementById("street-view").style.visibility = "hidden";

    street_view_location = new Microsoft.Maps.Location(lat, lng)

    center_map_location = new Microsoft.Maps.Location(lat+Math.random(), lng+Math.random())

    map = new Microsoft.Maps.Map(document.getElementById('map'), {
        center: center_map_location,
        zoom: Math.max(0, 2 - difficulty),
        showDashboard: false,
        enableClickableLogo: false,
        showTermsLink: false,
        showProblemReporting: false,
    });
    
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

    Microsoft.Maps.Events.addHandler(map, 'click', function(e) {
        var clickedAt = new Microsoft.Maps.Point(e.getX(), e.getY());
        var location = e.target.tryPixelToLocation(clickedAt);
        var map_location = new Microsoft.Maps.Location(location.latitude, location.longitude);
        map.entities.clear();
        addPushpin(map_location, "Guess", "Dein Guess", "O");

        userClicked = {lat: location.latitude, lng: location.longitude};
    });

    document.getElementById("street-view").style.visibility = "visible";
};

function addPushpin(position, title, subtitle, text) {
    var Pushpin = new Microsoft.Maps.Pushpin(position,{
        title: title,
        subTitle: subtitle,
        text: text
    });
    map.entities.push(Pushpin)
};

function addPolyline(position, color, thickness) {
    var Polyline = new Microsoft.Maps.Polyline(position, {
        strokeColor: color,
        strokeThickness: thickness
    });
    map.entities.push(Polyline);
};

// onvalue refs

onValue(refPlayers, (snapshot) => {
    var players = snapshot.val();
    var allGuessed = Object.values(players).every(player => player.guess.hasGuessed == true);

    if (allGuessed) {
        map.entities.clear()
        addPushpin(street_view_location, "Position", "Gesuchter Ort", "X");
    for (var playerId in players) {
        var player = players[playerId];
        var guess = new Microsoft.Maps.Location(player.guess.lat, player.guess.lng);

        addPushpin(guess, "Guess", playerId, "O");
        addPolyline([street_view_location, guess], "red", 1);

        if (isHost) {
        const distance = Math.round(getDistance(street_view_location.latitude, street_view_location.longitude, player.guess.lat, player.guess.lng));
        const newScore = player.score + Math.max(0, 1000 - distance);
        var scoreObj = {};
        scoreObj['bingguesser/' + gameid + '/player/' + playerId] = {
            guess: {
                hasGuessed: false,
                lat: player.guess.lat,
                lng: player.guess.lng
            },
            score: newScore,
            isHost: isHost,
        };
        update(ref(db), scoreObj)};
    };
}});

onValue(refGame, (snapshot) => {
    let player = snapshot.val().player;
    let dbRound = snapshot.val().round
    if (round != dbRound) {
        round = dbRound
        document.getElementById("round-counter").innerText = `Runde ${round}/${maxRounds}`
        if (round <= maxRounds) {
            const location = snapshot.val().location;
            newRound(location.lat, location.lng)
        }
    }
    if (round > maxRounds) {
        document.getElementById("game").style.visibility = "hidden"
        document.getElementById("street-view").style.visibility = "hidden"
        document.getElementById("endscreen").style.visibility = "visible"
        
        let playerList = document.getElementById('score-list');
        playerList.innerHTML = '';
        let playerKey = Object.keys(player)
        playerKey.forEach(playerName => {
            let li = document.createElement('li');
            li.textContent = `${playerName}: ${snapshot.val()["player"][playerName].score} `;
            playerList.appendChild(li);
        });
    }
    else if (round === 0) {
        for (var playerId in player) {
            if (isHost) {
            var scoreObj = {};
            scoreObj['bingguesser/' + gameid + '/player/' + playerId] = {
                guess: {
                    hasGuessed: false,
                    lat: 0,
                    lng: 0
                },
                score: 0,
                isHost: isHost,
            };
            update(ref(db), scoreObj)};
        };
        document.getElementById("game").style.visibility = "visible"
        document.getElementById("endscreen").style.visibility = "hidden"
    }
});

// buttons

document.getElementById('toggle-map').addEventListener('click', function() {
    const element = document.getElementById("map");
    if (element.style.visibility == "hidden") {
        document.getElementById('toggle-map').innerHTML = "Karte Verstecken";
        element.style.visibility = "visible";
    } else {
        document.getElementById('toggle-map').innerText = "Karte Anzeigen";
        element.style.visibility = "hidden";
    }
});

document.getElementById('guess-button').addEventListener('click', function() {
    if (userClicked.lat != undefined && userClicked.lng != undefined) {
    set(refPlayerGuess, {
        hasGuessed: true,
        lat: userClicked.lat,
        lng: userClicked.lng
    });
}});

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const deg2rad = deg => deg * (Math.PI / 180);
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

document.getElementById("round-counter").innerText = `Runde ${round}/${maxRounds}`
document.getElementById("game").style.visibility = "visible"

// host script

if (isHost) {
console.log("You're hosting this game 🚩");

const host_div = document.getElementById("h-access");
const new_round_button = document.createElement("new-round-button");
new_round_button.id = "new-round-button";
new_round_button.type = "button";
new_round_button.innerText = "Nächste Runde";
host_div.appendChild(new_round_button);

await getJSON().then(data => locationsJSON = data);

document.getElementById('new-round-button').addEventListener('click', function() {
    const location = getRandomLocation()

    set(refLocation, {
        lat: location.lat+getRandomFloat(), lng: location.lng+getRandomFloat(), name: location.name
    });
    
    get(child(refGame, 'round')).then((snapshot) => {
        set(child(refGame, 'round'), snapshot.val() + 1);
    });
});

const endscreen_div = document.getElementById("endscreen");
const restart_button = document.createElement("restart-button");
restart_button.id = "restart-button";
restart_button.type = "button";
restart_button.innerText = "Neustarten";
endscreen_div.appendChild(restart_button);

await getJSON().then(data => locationsJSON = data);

document.getElementById('restart-button').addEventListener('click', function() {
    set(child(refGame, 'round'), 0);
})};