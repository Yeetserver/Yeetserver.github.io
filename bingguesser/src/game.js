import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getDatabase, ref, onValue, set, child, get, push, update } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js';
import { firebaseConfig, getDistance, getJSON, getRandomFloat, getCookie, addButton } from './game_dependency.js';

const gameid = window.location.search
const playerName = getCookie("username")

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
var spawn_location
var map
var street_view
var locationsJSON
var userClicked = {lat: undefined, lng: undefined}
var hasGuessed = false
var roundOver = false
var timeRanOut = false
var timerInterval

// async functions


function playSound(path) {
    let sound = new Audio(String(path));
    sound.play();
}

async function timeProcessor (inptime) {
    let time = Number(inptime)

    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    document.getElementById("timer-display").innerHTML = `Verbleibende Zeit: ${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (time == 10) {
        playSound('/assets/audio/clock.mp3')
    }
    if (time < 1) {
        clearInterval(timerInterval);
        document.getElementById("timer-display").innerHTML = 'Verbleibende Zeit: 0:00';
        if (!hasGuessed && !roundOver) {
            userClicked = {lat: 0, lng: 0};
            set(refPlayerGuess, {hasGuessed: true, lat: 0, lng: 0})
        }
    }
}

function guess() {
    if (userClicked.lat == undefined && userClicked.lng == undefined) {userClicked = {lat: 0, lng: 0}}
    if ((!roundOver) && (userClicked.lat != 0 && userClicked.lng != 0)) {
        if (!hasGuessed) {
            playSound('/assets/audio/success.mp3')
        set(refPlayerGuess, {hasGuessed: true, lat: userClicked.lat, lng: userClicked.lng})};
        userClicked = {lat: 0, lng: 0};
        hasGuessed = true
    } else if (!roundOver) {set(refPlayerGuess, {hasGuessed: true, lat: 0, lng: 0})}
}

async function setTimer (seconds) {
    clearInterval(timerInterval);
    const time = Number(seconds) * 1000
    timerInterval = setInterval(() => timeProcessor(Math.abs(--seconds)), 1000);
    await new Promise(resolve => setTimeout(resolve, time));
};

async function getData(reference, element) {
    return new Promise((resolve) => {
        get(child(reference, element)).then((snapshot) => {
            if (snapshot.exists()) {
            resolve(snapshot.val());
            } else {resolve(false);}
        });
})};

const maxRounds = await getData(refGame, 'maxRounds');
const timerTime = await getData(refGame, 'time');

const isHost = await getData(refPlayer, 'isHost');
var round = await getData(refGame, 'round');

// functions

function getRandomLocation() {
    const city = Object.keys(locationsJSON)[Math.floor(Math.random() * Object.keys(locationsJSON).length)];
    return {name: city, ...locationsJSON[city]};
};

function newRound(lat, lng) {
    document.getElementById("street-view").style.visibility = "hidden";

    street_view_location = new Microsoft.Maps.Location(lat, lng)
    spawn_location = new Microsoft.Maps.Location(lat, lng)

    map = new Microsoft.Maps.Map(document.getElementById('map'), {
        zoom: 1,
        showDashboard: false,
        enableClickableLogo: false,
        showTermsLink: false,
        showProblemReporting: false
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
            onSuccessLoading: function () {spawn_location = street_view.getCenter()},
            onErrorLoading: function () {}
        }
    });

    Microsoft.Maps.Events.addHandler(map, 'click', function(e) {
        if (!roundOver) {
        var clickedAt = new Microsoft.Maps.Point(e.getX(), e.getY());
        var location = e.target.tryPixelToLocation(clickedAt);
        var map_location = new Microsoft.Maps.Location(location.latitude, location.longitude);
        map.entities.clear();
        addPushpin(map_location, "Guess", "Dein Guess", "O");

        userClicked = {lat: location.latitude, lng: location.longitude};
    }});

    document.getElementById("street-view").style.visibility = "visible";

    setTimer(timerTime)
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
    let players = snapshot.val();
    let allGuessed = Object.values(players).every(player => player.guess.hasGuessed == true);

    if (allGuessed == true) {
        if (Math.round(getDistance(spawn_location.latitude, spawn_location.longitude, userClicked.lat, userClicked.lng)) > 10000 || (userClicked.lat == 0 && userClicked.lng == 0)) {
            playSound()
        };
        roundOver = true
        hasGuessed = false
        if (map.entities) {map.entities.clear();}
        addPushpin(spawn_location, "Position", "Gesuchter Ort", "X");
    for (let playerId in players) {
        let player = players[playerId];
        let guess = new Microsoft.Maps.Location(player.guess.lat, player.guess.lng);
        
        let distance = Math.round(getDistance(spawn_location.latitude, spawn_location.longitude, player.guess.lat, player.guess.lng));

        if (player.guess.lat != 0 && player.guess.lng != 0) {
        addPushpin(guess, playerId, `${distance}km entfernt`, String(playerId).charAt(0).toUpperCase());
        addPolyline([spawn_location, guess], "red", 1);
        };
        
        if (isHost) {
        let newScore = player.score + Math.max(0, 1000 - distance);
        set(child(refPlayers, playerId), {
            guess: {
                hasGuessed: false,
                lat: 0,
                lng: 0
            },
            score: newScore,
            isHost: player.isHost,
        });
    }};
}});

onValue(refGame, (snapshot) => {
    let player = snapshot.val().player;
    let dbRound = snapshot.val().round
    if (round != dbRound) {
        round = dbRound
        roundOver = false
        clearInterval(timerInterval);
        
        document.getElementById("round-counter").innerText = `Runde ${round}/${maxRounds}`

        if (round <= maxRounds) {
            const location = snapshot.val().location;
            newRound(location.lat, location.lng)
            playSound('/assets/audio/start.mp3')
        }
        else {document.getElementById("round-counter").innerText = ``};
    }
    if (round > maxRounds) {
        clearInterval(timerInterval)
        document.getElementById("game").style.visibility = "hidden"
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
    else if (round == 0) {
        if (isHost) {
            for (var playerId in player) {
                set(child(refPlayers, playerId), {
                    guess: {
                        hasGuessed: false,
                        lat: 0,
                        lng: 0
                    },
                    score: 0,
                    isHost: player[playerId].isHost,
                });
        }};
        document.getElementById("game").style.visibility = "visible"
        document.getElementById("endscreen").style.visibility = "hidden"
    };
});

document.getElementById('guess-button').addEventListener('click', function() {
    guess()
});

document.getElementById('center-button').addEventListener('click', function() {
    street_view.setView({ center: spawn_location});
});

document.getElementById("round-counter").innerText = `Runde ${round}/${maxRounds}`
document.getElementById("game").style.visibility = "visible"

// host script

if (isHost) {
console.log("You're hosting this game 🚩");

addButton("h-access", "new-round-button", "Nächste Runde")
addButton("h-access", "copy-link-button", "Link Kopieren")

addButton("endscreen", "restart-button", "Neustarten")

document.getElementById('new-round-button').addEventListener('click', function() {
    const location = getRandomLocation()

    get(refPlayers).then((snapshot) => {
        let player = snapshot.val()
        let playerKey = Object.keys(player)
        playerKey.forEach(player => {
            set(child(refPlayers, player+'/guess'), {
                hasGuessed: false, lat: 0, lng: 0
            })
        });
    });

    set(refLocation, {
        lat: location.lat+getRandomFloat(), lng: location.lng+getRandomFloat(), name: location.name
    });
    
    get(child(refGame, 'round')).then((snapshot) => {
        set(child(refGame, 'round'), snapshot.val() + 1);
    });
});

document.getElementById('restart-button').addEventListener('click', function() {
    set(child(refGame, 'round'), 0);
})

document.getElementById('copy-link-button').addEventListener('click', function() {
    console.log("Copied link to clipboard 📋")
    navigator.clipboard.writeText(window.location.href)
})

await getJSON().then(data => locationsJSON = data);
};