function randomMap () {
    const maps = ["Bind", "Haven", "Fracture", "Breeze", "Icebox", "Ascent", "Split", "Pearl"];
    const random = Math.floor(Math.random() * maps.length);
    document.getElementById("displayText").innerHTML =
        `${maps[random]}`;
}

function randomAgent () {
    const agents = ["Astra", "Breach", "Brimstone", "Chamber", "Cypher", "Jett", "Kay/O", "Killjoy", "Neon", "Omen",
    "Phoenix", "Raze", "Reyna", "Sage", "Skye", "Sova", "Viper", "Yoru"];
    const random = Math.floor(Math.random() * agents.length);
    document.getElementById("displayText").innerHTML =
        `${agents[random]}`;
}

function randomWeapon () {
    const sidearms = ["Knife", "Classic", "Shorty", "Frenzy", "Ghost", "Sheriff"]
    const weapons = ["Stinger", "Spectre", "Bucky", "Jugde", "Bulldog", "Guardian", "Phantom", "Vandal", "Marshal", "Operator", "Ares", "Odin"];
    const random_sidearm = Math.floor(Math.random() * sidearms.length);
    const random_weapon = Math.floor(Math.random() * weapons.length);
    if (getCookie("useSidearms") == "false" || getCookie("useSidearms") == "") {
        document.getElementById("displayText").innerHTML =
        `${sidearms[random_sidearm]} + ${weapons[random_weapon]}`;
    }
    else {
        document.getElementById("displayText").innerHTML =
        `${weapons[random_weapon]}`;
    }
    
}

function randomChallenge () {

    var randomChallenges = [];
    var difficultySymbol = "*"
    var translatedDifficulty = "Einfach"

    var difficulty = getCookie("difficulty");
    var count = getCookie("count");

    if (count === "") {count = 1};
    if (difficulty === "") {difficulty = "easy"};

    function convertDifficulty () {
        if (difficulty == "easy") {difficultySymbol = "*"; translatedDifficulty = "Einfach";}
        else if (difficulty == "medium") {difficultySymbol = "⁑"; translatedDifficulty = "Normal";}
        else if (difficulty == "hard") {difficultySymbol = "⁂"; translatedDifficulty = "Schwer";}}
    
    convertDifficulty();

    const challenges = ["Nur das Messer benutzen¹²⁂", "Nur Zweitwaffen benutzen¹*", "Nur Hauptwaffen benutzen¹*", "Keine Waffen aufsammeln²⁶*",
    `Nur Waffen über ${randomInt(1, 40)*100} ¤ kaufen²⁑`, `Nur Waffen unter ${randomInt(1, 40)*100} ¤ kaufen²⁑`,
    "Nur aufgesammelte Waffen benutzen²*", "Nur Zweitwaffen aufsammeln²*", "Nicht Springen*", "Nur Schleichen⁴*", "Keine Fähigkeiten einsetzen*",
    "Campen³⁑", "Pushen³⁑", "Nur Rückwärts laufen⁂", "Nur Crouchen⁴⁑", "Einen Gegner Messern¹²⁑", "Nur Rennen⁴*", "Nur Waffen vom Gegner benutzen¹²⁶⁑",
    "Nur auf die Füße zielen⁂", "Einmal um die Map laufen³⁂", "Nach A gehen³⁵*", "Nach B gehen³⁵*", "Nach C(A) gehen³⁵*", `Maximal ${randomInt(1, 5)} Gegner töten²⁑`];
    
    function duplicateExists (symbol) {if (!randomChallenges.find(a =>a.includes(symbol)) + !randomChallenge.includes(symbol)) {return true} else {return false}}
    if (challenges.length/2 < count) {count = Math.round(challenges.length/4)}

    for (let i = 1; i <= count; i++) {
        var random = Math.floor(Math.random() * challenges.length);
        var randomChallenge = challenges[random];
        if (!randomChallenges.includes(randomChallenge)) {
            if (duplicateExists("¹") && duplicateExists("²") && duplicateExists("³") && duplicateExists("⁴") && duplicateExists("⁵") && duplicateExists("⁶")) {
                if (randomChallenge.includes(difficultySymbol)) {
                    randomChallenges.push(randomChallenge);
                }
                else {
                    i -= 1;
                }
            }
            else {
                i -= 1;
            }
        }
        else {
            i -= 1;
        }
    }

    for(var i = 0; i < count; i++) {
        var item = randomChallenges[i];
        item = item.replace("¹", "");
        item = item.replace("²", "");
        item = item.replace("³", "");
        item = item.replace("⁴", "");
        item = item.replace("⁵", "");
        item = item.replace("⁶", "");
        item = item.replace("*", "");
        item = item.replace("⁑", "");
        item = item.replace("⁂", "");
        randomChallenges[i] = item;
    }

    document.getElementById("displayText").innerHTML =
        `${randomChallenges.join('<br>')}`;
}

function difficultySlider () {
    var slider = document.getElementById("difficulty_slider");
    var difficultyValue = document.getElementById("difficultyValue");
    if (slider.value == 1) {document.cookie = "difficulty=easy"; var translatedDifficulty = "Einfach";}
    else if (slider.value == 2) {document.cookie = "difficulty=medium"; var translatedDifficulty = "Normal";}
    else if (slider.value == 3) {document.cookie = "difficulty=hard"; var translatedDifficulty = "Schwer";}
    difficultyValue.innerHTML = `Schwierigkeit: ${translatedDifficulty}`
}

function countSlider () {
    var slider = document.getElementById("count_slider");
    var countValue = document.getElementById("countValue");
    document.cookie = `count=${slider.value}`;
    countValue.innerHTML = `Anzahl: ${getCookie("count")}`
}

function useSidearm () {
    var useSidearm = document.getElementById("use_sidearms");
    document.cookie = `useSidearms=${useSidearm.checked}`;
    console.log(getCookie("useSidearms"));
}

function deleteValorantData () {
    deleteCookie("count");
    deleteCookie("difficulty");
    deleteCookie("useSidearms");
}