function appearanceButton() {
    const mode_button = document.getElementById("appearance-button");
    if (mode_button.firstChild.data == "Darkmode") 
    {
        document.cookie = "mode=0";
        changeAppearance(0)
    }
    else 
    {
        document.cookie = "mode=1";
        changeAppearance(1)
    }}
function start() {
    changeAppearance(getCookie("mode"));
    if (getCookie("visited") !== "true") {
        on()
    }
}

function calculator() {
    var calculation = prompt("Rechnung eingeben")
    try {
        if (calculation.includes(",")) {
            var calculation = calculation.replace(",", ".")
        }
        const result = eval(calculation)
        if (result === undefined || result === null) {
        } else {
        if (Number.isInteger(result)) {
            alert(`Ergebnis: ${result}`)
        } else {
            alert(`Genaues Ergebnis: ${result} \nGerundetes Ergebnis: ${Math.round(result)}`)
        }}
    }
    catch {
        alert(`Ungültige Rechnung: ${calculation}`)
    }
}

function on() {
    document.getElementById("overlay").style.display = "block";
}

    function off() {
    document.getElementById("overlay").style.display = "none";
    document.cookie = "visited=true";
}
