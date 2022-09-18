const none = null

function readJSON(filename) {
    $(function() {
    $.getJSON(filename, function(data) {
        return data
})})}

function setCookie(name, value, exdays) {
    if (exdays == undefined || exdays == null || exdays == none) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }
    else {
        document.cookie = `${name}=${value}`;

    }
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

function deleteCookie(cookie) {
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 2000 00:00:00 UTC;`;
}
    
function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 2000 00:00:00 GMT";
}}

function startup() {
    loadAppearance()
}

function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}

function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}