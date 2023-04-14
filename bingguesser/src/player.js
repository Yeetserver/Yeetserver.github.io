import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getDatabase, ref, onValue, set, child, get } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js';
import { getCookie, firebaseConfig } from './game_dependency.js';

var playerName = getCookie("username")

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

// global vars
var unloading = false
const gameid = window.location.search

// refs
const refGame = ref(db, 'bingguesser/' + gameid); // reference to the game
const refPlayers = ref(db, 'bingguesser/' + gameid + '/player'); // reference to all players
const refPlayer = ref(db, 'bingguesser/' + gameid + '/player/' + playerName); // reference to a specific player

function gameError(message) {
    alert(String(message))
    window.location.href = window.location.origin + "/bingguesser/index.html"
}

async function getData(reference, element) {
    return new Promise((resolve) => {
        get(child(reference, element)).then((snapshot) => {
            if (snapshot.exists()) {
            resolve(snapshot.val());
            } else {resolve(false);}
        });
})};

const isHost = await getData(refPlayer, 'isHost');

function updatePlayerList(playerNames, snapshot) {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = '';
    playerNames.forEach(playerName => {
        let name = playerName.substring(0, 10)
        let score = snapshot[playerName]['score']
        const li = document.createElement('li');
        li.textContent = `${name} | ${score}`;
        playerList.appendChild(li);
    });
}

onValue(ref(db, 'bingguesser'), (snapshot) => {
    if (snapshot.exists()) {
    if ((snapshot.val()[gameid].round > 0) && (!Object.keys(snapshot.val()[gameid].player).includes(playerName))) { // game started?
        unloading = true
        gameError("Das Spiel hat bereits begonnen")
    } 
    if (!Object.keys(snapshot.val()).includes(gameid)) { // game exists?
        gameError("Es gibt kein Spiel mit dieser id")
    }
    } else {
        gameError("Es gibt kein Spiel mit dieser id")
    }
});

onValue(refPlayers, (snapshot) => {
    if (!unloading) {
    if (!Object.keys(snapshot.val()).includes(playerName)) {
        set(refPlayer, {
            isHost: false,
            score: 0,
            guess: {hasGuessed: false, lat: 0, lng: 0}
    })};

    updatePlayerList(Object.keys(snapshot.val()), snapshot.val())};
});

function onunload () {
    unloading = true
    if (isHost) {
    set(refGame, {})
    } else {
    set(refPlayer, {})}
};

// window.onunload = onunload;