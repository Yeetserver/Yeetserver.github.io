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

if (getCookie("DBAKEYVAL") != "") {}
else {window.location.replace("https://yeetserver.github.io/settings/login")};

const firebaseConfig = JSON.parse(getCookie("DBAKEYVAL"));

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getDatabase();
document.getElementById('send').addEventListener('click', send);
document.getElementById('update').addEventListener('click', update);

const reference = ref(db, 'dashboard');

function send() {
    var channel = document.getElementById('channel').value;
    var message = document.getElementById('message').value;
    var name = document.getElementById('name').value;
    var pfpUrl = document.getElementById('pfpUrl').value;
    set(ref(db, 'dashboard/message'), {
    channel: channel,
    pfpUrl: pfpUrl,
    name: name,
    message: message
})
console.log(`${name}: ${message}`)};

function update() {
    var status = document.getElementById('status').value;
    var type = Number(document.getElementById('statusdropdown').value);

    set(ref(db, 'dashboard/status'), {
    type: type,
    status: status
})
console.log(`New status: ${status}, ${type}`)};

async function updateUptime(uptime) {
    document.getElementById('uptime').innerHTML = uptime;
};

const uptime = ref(db, 'dashboard');
onValue(uptime, (snapshot) => {
  const uptime = snapshot.val().uptime;
  if (uptime >= 3600000) {
    updateUptime(Math.round((uptime/1000/60/60)*10)/10 + " Stunden")
  }//hour
  else {
    updateUptime(Math.round((uptime/1000)*10)/10 + " Minuten")
  }//minute
}); // FUNKTIONIERT NICHT RICHTIG PROP

const enabledref = ref(db, 'dashboard');
onValue(enabledref, (snapshot) => {
  const enabled = snapshot.val().enabled;
  if (!enabled) {window.location.replace("https://yeetserver.github.io/settings/login")}
});