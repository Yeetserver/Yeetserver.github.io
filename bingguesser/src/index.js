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

function host_game(gameid) {
    return new Promise((resolve, reject) => {
      set(ref(db, 'bingguesser/?'+gameid), {
        round: 0,
        maxRounds: Number(document.getElementById("max-rounds-slider").value),
        difficulty: Number(document.getElementById("difficulty").value),
        time: Number(document.getElementById("time-slider").value)+1,
        location: {lat: 0, lng: 0, name: ""},
        player: {[playerName]:{
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
  host_game(generateGameID())
})

document.getElementById('join-button').addEventListener('click', function() {
  let id = document.getElementById("id").value;
  if (id) {
    if (id.includes("?")) {id = id.replace("?", "");}
    get(ref(db, 'bingguesser')).then(snapshot => {
      if (snapshot.exists()) {
        if (Object.keys(snapshot.val()).includes(`?${id}`)) {
          window.location.href = `${window.location.origin}/bingguesser/game.html?${id}`;
        } else {
          falseInput();
        }
      } else {
        falseInput();
      }
    }).catch(error => {
      falseInput();
    });
  } else {
    falseInput();
  }
});

document.getElementById("id").addEventListener("animationend", function() {
  document.getElementById("id").classList.remove("shake");
});

function falseInput() {
  document.getElementById("id").classList.add("shake");
}


function generateGameID() {
  return Array.from({length: 10}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 'a'.charCodeAt(0))).join('');
}
  