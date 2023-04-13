import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getDatabase, ref, onValue, set, child, get } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js';
import { firebaseConfig } from './game_dependency.js';

var username = document.getElementById("username").value
var id = document.getElementById("gameid").value;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

function host_game(gameid) {
    return new Promise((resolve, reject) => {
      set(ref(db, 'bingguesser/?'+gameid), {
        round: 0,
        maxRounds: Number(document.getElementById("max-rounds-slider").value),
        time: Number(document.getElementById("time-slider").value)+1,
        location: {lat: 0, lng: 0, name: ""},
        player: {[username]:{
          isHost: true,
          score: 0,
          guess: {hasGuessed: false, lat: 0, lng: 0
        }}}
      }).then(resolve);
    }).then(() => {
        window.location.href = `${window.location.origin}/bingguesser/game.html?${gameid}`;
    })
}

document.getElementById('host-button').addEventListener('click', function() {
  if (username == "") {invaildUsername(); return}
  host_game(generateGameID())
})

document.getElementById('join-button').addEventListener('click', function() {
  
  
  if (username == "") {invaildUsername(); return}
  if (!id) {invaildGameID()}
  if (id.includes("?")) {id = id.replace("?", "")}

  get(ref(db, 'bingguesser')).then(snapshot => {

    if (!snapshot.exists()) {invaildGameID(); return};
    if (!Object.keys(snapshot.val()).includes(`?${id}`)) {invaildGameID(); return};
    window.location.href = `${window.location.origin}/bingguesser/game.html?${id}`;
  
  }).catch(error => {invaildGameID(); return});
});

document.getElementById("gameid").addEventListener("animationend", function() {
  document.getElementById("gameid").classList.remove("shake");
});

function invaildGameID() {
  document.getElementById("gameid").classList.add("shake");
}

document.getElementById("username").addEventListener("animationend", function() {
  document.getElementById("username").classList.remove("shake");
});

function invaildUsername() {
  document.getElementById("username").classList.add("shake");
}

function generateGameID() {
  return Array.from({length: 10}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 'a'.charCodeAt(0))).join('');
}
  