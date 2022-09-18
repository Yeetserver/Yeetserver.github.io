function changeImage(img) {
    document.getElementById("img").src="https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt26fcf1b5752514ee/5eb7cdbfc1dc88298d5d3799/V_AGENTS_587x900_Brimstone.png";
}


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
    document.getElementById("displayText").innerHTML =
        `${sidearms[random_sidearm]} + ${weapons[random_weapon]}`;
}

var count = 3;

function randomChallenge () {
    var randomChallenges = [];
    const challenges = ["Nur das Messer benutzen¹²", "Nur Zweitwaffen benutzen¹", "Nur Hauptwaffen benutzen¹", "Keine Waffen aufsammeln",
    `Keine Waffen über ${randomInt(1, 50)*100} ¤ kaufen²`, `Keine Waffen unter ${randomInt(1, 50)*100} ¤ kaufen²`,
    "Nur aufgesammelte Waffen benutzen²", "Nur Zweitwaffen aufsammeln²", "Nicht Springen", "Nur Schleichen⁴", "Keine Fähigkeiten einsetzen",
    "Campen³", "Pushen³", "Nur Rückwärts laufen", "Nur Crouchen⁴", "Einen Gegner Messern¹²", "Nur Rennen⁴"];
    function duplicateExists (symbol) {if (!randomChallenges.find(a =>a.includes(symbol)) + !randomChallenge.includes(symbol)) {return true} else {return false}}
    for (let i = 1; i <= count; i++) {
        var random = Math.floor(Math.random() * challenges.length);
        var randomChallenge = challenges[random];
        if (!randomChallenges.includes(randomChallenge) ) {
            if (duplicateExists("¹") && duplicateExists("²") && duplicateExists("³") && duplicateExists("⁴")) {
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

    for(var i = 0; i < count; i++) {
        var item = randomChallenges[i];
        item = item.replace("¹", "");
        item = item.replace("²", "");
        item = item.replace("³", "");
        item = item.replace("⁴", "");
        randomChallenges[i] = item;
    }

    document.getElementById("displayText").innerHTML =
        `${randomChallenges.join('<br>')}`;
}