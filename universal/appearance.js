function changeAppearance(appearance) {
    const mode_button = document.getElementById("appearance-button");
    if (appearance == "darkmode") {
    document.documentElement.style.setProperty('--background_appearance', 'hsl(0, 0%, 12%)');
    document.documentElement.style.setProperty('--foreground_appearance', 'hsl(0, 0%, 100%)');
    mode_button.firstChild.data = "Darkmode";
    }
    else if (appearance == "whitemode") {
        document.documentElement.style.setProperty('--background_appearance', 'hsl(0, 0%, 100%)');
        document.documentElement.style.setProperty('--foreground_appearance', 'hsl(0, 0%, 0%)');
    mode_button.firstChild.data = "Whitemode";
    }
    else if (appearance == "colorful") {
        document.documentElement.style.setProperty('--background_appearance', 'hsl(32, 100%, 48%)');
        document.documentElement.style.setProperty('--foreground_appearance', 'hsl(0, 0%, 20%)');
        mode_button.firstChild.data = "Colorful";
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
        on()
    }
}

function start() {
    changeAppearance(getCookie("appearance"));
    if (getCookie("visited") !== "true") {
        on()
    }
}