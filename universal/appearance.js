function changeAppearance(appearance) {
    if (appearance == "darkmode") {
    document.documentElement.style.setProperty('--background_appearance', 'rgb(32, 32, 32)');
    document.documentElement.style.setProperty('--foreground_appearance', 'rgb(255, 255, 255)');
    }
    else if (appearance == "whitemode") {
        document.documentElement.style.setProperty('--background_appearance', 'rgb(255, 255, 255)');
        document.documentElement.style.setProperty('--foreground_appearance', 'rgb(0, 0, 0)');
    }
    else if (appearance == "sunrise") {
        document.documentElement.style.setProperty('--background_appearance', 'rgb(40, 40, 40)');
        document.documentElement.style.setProperty('--foreground_appearance', 'rgb(248, 149, 0)');
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
    document.cookie = `appearance=${selectedValue}`;
    changeAppearance(`${selectedValue}`)
}

function loadAppearance() {
    changeAppearance(getCookie("appearance"));
    
    if (getCookie("visited") !== "true") {
        document.cookie = `appearance=darkmode`;
        on()
    }
    else {
        selectedValue = document.getElementById("appearances").value = getCookie("appearance");
    }
}

function start() {
    changeAppearance(getCookie("appearance"));
    if (getCookie("visited") !== "true") {
        on()
    }
}