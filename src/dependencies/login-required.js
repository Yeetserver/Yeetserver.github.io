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

function redirect() {
  let loginURL
  if (window.location.search != "") {
    loginURL = `/settings/login.html?${window.location.pathname}${window.location.search}`
  }
  else {
    loginURL = `/settings/login.html?${window.location.pathname}`
  }
  window.location.replace(loginURL)
}

const username = getCookie("username")
const acskey = getCookie("acskey")
const userid = getCookie("userid")

if (acskey == "" || username == "" || userid == "") {
  redirect()
}

const firebaseConfig = JSON.parse(document.getElementById("key").innerHTML);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

// refs
const refUsers = ref(db, 'website/users'); // reference to the game
get(child(refUsers, userid)).then((snapshot) => {
  if (snapshot.exists()) {
    if (snapshot.val().username == username) {}
    else {redirect()}}
  else {redirect()}
});