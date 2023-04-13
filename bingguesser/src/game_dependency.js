function getRandomFloat () {
    if (Math.random() > 0.5) {return Math.random()/10}
    else {return -(Math.random()/10)};
};

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const deg2rad = deg => deg * (Math.PI / 180);
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

async function getJSON() {
    try {
      const response = await fetch('/bingguesser/src/locations.json');
      return response.json();
    } catch (error) {
      console.error(error);
}};

const firebaseConfig = {
    apiKey: "AIzaSyDygJhI4xE5DFcpa-rYJMwZCQfFTtUKWW4",
    authDomain: "ftu-yeetserver-database.firebaseapp.com",
    databaseURL: "https://ftu-yeetserver-database-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ftu-yeetserver-database",
    storageBucket: "ftu-yeetserver-database.appspot.com",
    messagingSenderId: "507214979949",
    appId: "1:507214979949:web:dc35fecee3db897d9ff064"
};

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

function addButton(div, id, text) {
    let divElement = document.getElementById(div);
    let buttonElement = document.createElement(id);
    buttonElement.type = 'button';
    buttonElement.id = id;
    buttonElement.innerText = text;
    divElement.appendChild(buttonElement);
}

export {firebaseConfig, getRandomFloat, getDistance, getJSON, getCookie, addButton}