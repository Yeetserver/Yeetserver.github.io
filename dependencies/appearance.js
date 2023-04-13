function changeAppearance(appearance) {
    setCookie("appearance", appearance)
    if (appearance == "darkmode") {
    document.documentElement.style.setProperty('--background_appearance', 'rgb(32, 32, 32)');
    document.documentElement.style.setProperty('--foreground_appearance', 'rgb(255, 255, 255)');
    }
    else if (appearance == "whitemode") {
        document.documentElement.style.setProperty('--background_appearance', 'rgb(248, 246, 237)');
        document.documentElement.style.setProperty('--foreground_appearance', 'rgb(0, 0, 0)');
    }
    else if (appearance == "sunrise") {
        document.documentElement.style.setProperty('--background_appearance', 'rgb(32, 32, 32)');
        document.documentElement.style.setProperty('--foreground_appearance', 'rgb(248, 149, 0)');
    }
    else if (appearance == "terminal") {
        document.documentElement.style.setProperty('--background_appearance', 'rgb(0, 0, 0)');
        document.documentElement.style.setProperty('--foreground_appearance', 'rgb(65, 200, 0)');
    }
    else if (appearance == "random") {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max)}
        document.documentElement.style.setProperty('--background_appearance', `rgb(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)})`);
        document.documentElement.style.setProperty('--foreground_appearance', `rgb(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)})`);
    }
}

function appearanceButton() {
    var selectedValue = document.getElementById("appearances").value;
    changeAppearance(selectedValue)
}

function loadAppearance() {
    changeAppearance(getCookie("appearance"));
    if (getCookie("visited") != "true") {
        changeAppearance("darkmode")
        on()
    }
    try {document.getElementById("appearances").value = getCookie("appearance");}
    catch (e) {};

}


function on() {
    try {document.getElementById("overlay").style.display = "block";}
    catch (e) {}
}

function off() {
    try {document.getElementById("overlay").style.display = "none";}
    catch (e) {}
    document.cookie = "visited=true";
}