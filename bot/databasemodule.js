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
document.getElementById('showpfps').addEventListener('click', show_pfps);

const reference = ref(db, 'dashboard');

function send() {
    var channel = document.getElementById('channel').value;
    var message = document.getElementById('message').value;
    var name = document.getElementById('name').value;
    var pfpUrl = document.getElementById('pfpUrl').value;
    if (channel + message + name + pfpUrl == "") {return}
    set(ref(db, 'dashboard/message'), {
    channel: channel,
    pfpUrl: pfpUrl,
    name: name,
    message: message
})
console.log(`Nachricht erfolgreich gesendet.\nName: "${name}"\nProfilbild: "${pfpUrl}"\nChannel ID: "${channel}"\nNachricht: "${message}"`)};

function update() {
    var status = document.getElementById('status').value;
    var type = Number(document.getElementById('statusdropdown').value);

    set(ref(db, 'dashboard/status'), {
    type: type,
    status: status
})
console.log(`Neuer Status: ${status}\nTyp: ${type}`)};


function show_pfps() {
  const show_pfps_doc = document.getElementById('showpfps').value
  const pfps_doc = document.getElementById('pfps').value
  if (show_pfps_doc == "+") {
    onValue(reference, (snapshot) => {
      const raw_pfp_list = snapshot.val().pfps;
      var pfp_list = ""
      for (const object of raw_pfp_list) {
        pfp_list = pfp_list.concat(`${object.name}:<br>${object.url}<br>`)
      };
      document.getElementById('pfps').innerHTML = `Liste an Profilbildern:<br>${pfp_list}`;
      document.getElementById('showpfps').value = "-"
    });
  } else {
    document.getElementById('pfps').innerHTML = "";
    document.getElementById('showpfps').value = "+"
  }
}

async function updateUptime(uptime) {
    document.getElementById('uptime').innerHTML = uptime;
};

onValue(reference, (snapshot) => {
  const uptime = snapshot.val().uptime;
  if (uptime >= 3600000) {
    updateUptime(Math.round((uptime/1000/60/60)*10)/10 + " Stunden")
  }//hour
  else {
    updateUptime(Math.round((uptime/1000)*10)/10 + " Minuten")
  }//minute
}); // FUNKTIONIERT NICHT RICHTIG PROP


onValue(reference, (snapshot) => {
  const enabled = snapshot.val().enabled;
  if (!enabled) {window.location.replace("https://yeetserver.github.io/settings/login")}
});