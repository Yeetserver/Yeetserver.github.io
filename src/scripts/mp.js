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
};

const firebaseConfig = {
    "apiKey": "AIzaSyBcWTZtc9FlRzWaAKdw4DheGMXTiTUcCuU",
    "authDomain": "yeetsever.firebaseapp.com",
    "databaseURL": "https://yeetsever-default-rtdb.europe-west1.firebasedatabase.app",
    "projectId": "yeetsever",
    "storageBucket": "yeetsever.appspot.com",
    "messagingSenderId": "880124899974",
    "appId": "1:880124899974:web:3985edba02af4fe89e1707",
    "measurementId": "G-DY1TGER0NF",
    "hosting": {
        "public": "./"
    }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getDatabase();
document.getElementById('send').addEventListener('click', send);

const reference = ref(db, 'dashboard');

function update() {
    var status = document.getElementById('status').value;
    var type = Number(document.getElementById('statusdropdown').value);

    set(ref(db, 'mp_game/status'), {
    type: type,
    status: status
})
console.log(`Neuer Status: ${status}\nTyp: ${type}`)};



onValue(reference, (snapshot) => {
  const enabled = snapshot.val().enabled;
});