import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
import { getDatabase, ref, onValue, set, child, get } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js';

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

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

function generateId() {
  return Math.random().toString(36).substr(2, 20);
};

function getCurrentDate() {
  var today = new Date();
  return today.getDate().toString().padStart(2, '0') + '/' + (today.getMonth()+1).toString().padStart(2, '0') + '/' + today.getFullYear();
}

function success () {
  alert("Erfolgreich Registriert")
  setCookie("acskey", document.getElementById("acskey").value, 10)
  if (window.location.search) {
    const URL = `${window.location.search}`;
    window.location.href = URL.replace("?", "");
  };
}

function login() {

const firebaseConfig = JSON.parse(document.getElementById("key").innerHTML);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

const refUsers = ref(db, 'website/users');

const username = document.getElementById("name").value
var userid = getCookie("userid")

if (userid == "") {
  userid = generateId();
  setCookie("userid", userid, 365);
}

get(refUsers).then((snapshot) => {
if (!snapshot.exists()) {
set(child(refUsers, userid),{
  username: username,
  date: getCurrentDate()
});
success()
} else {
let users = snapshot.val()

function getNames() {
for (let user of Object.keys(users)) {
  if (users[user].username == username && user != userid) {return true};
}; return false};

if (getNames()) {
  alert("Ein Nutzer mit diesem Namen existiert bereits")
  window.location.href = '/settings/login.html'+window.location.search
} else {

setCookie("username", username, 10);
set(child(refUsers, userid),{
  username: username,
  date: getCurrentDate()
});

success()
}}})};

const observer = new MutationObserver(() => login());
observer.observe(document.getElementById('key'), { childList: true });