import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getDatabase, ref, onValue, set, child, get } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js';

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

var playerName = getCookie("username")
const firebaseConfig = JSON.parse(document.getElementById("key").innerHTML)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

// global vars
var unloading = false
var isHost
const gameid = window.location.search

// refs
const refGame = ref(db, 'bingguesser/' + gameid); // reference to the game
const refPlayers = ref(db, 'bingguesser/' + gameid + '/player'); // reference to all players
const refPlayer = ref(db, 'bingguesser/' + gameid + '/player/' + playerName); // reference to a specific player

onValue(refPlayer, (snapshot) => {
    if (snapshot.exists()) {isHost = snapshot.val().isHost} else {isHost = false}
});

function updatePlayerList(playerNames) {
    const playerList = document.getElementById('score-list');
    playerList.innerHTML = '';
    playerNames.forEach(playerName => {
      const li = document.createElement('li');
      li.textContent = playerName;
      playerList.appendChild(li);
    });
}

onValue(refPlayers, (snapshot) => {
    if (!unloading) {
    updatePlayerList(Object.keys(snapshot.val()))}
});

onValue(ref(db, 'bingguesser'), (snapshot) => {
    if (snapshot.exists()) {
    if ((snapshot.val()[gameid].round > 0) && (!Object.keys(snapshot.val()[gameid].player).includes(playerName))) { // game started?
        unloading = true
        window.location.href = window.location.origin + "/bingguesser/?Das!Spiel!hat!bereits!begonnen"
    }
    if (!Object.keys(snapshot.val()).includes(gameid)) { // game exists?
        window.location.href = window.location.origin + "/bingguesser/?Es!gibt!kein!Spiel!mit!dieser!id"
    }
    } else {
        console.log(1);
        window.location.href = window.location.origin + "/bingguesser/?Es!gibt!kein!Spiel!mit!dieser!id"
    }
});

onValue(refPlayers, (snapshot) => {
    if ((!Object.keys(snapshot.val()).includes(playerName)) && (unloading == false)) {
        set(refPlayer, {
            score: 0,
            guess: {hasGuessed: false, lat: 0, lng: 0}
        })}
});

function onunload () {
    unloading = true
    if (isHost) {
    set(refGame, {})
    } else {
    set(refPlayer, {})}
};

window.onunload = onunload;