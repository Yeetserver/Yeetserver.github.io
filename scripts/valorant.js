
function randomMap () {
    const maps = ["Bind", "Haven", "Fracture", "Breeze", "Icebox", "Ascent", "Split", "Pearl"];
    const random = Math.floor(Math.random() * maps.length);
    document.getElementById("text").innerHTML =
        `${maps[random]}`;
}

function randomAgent () {
    const agents = ["Astra", "Breach", "Brimstone", "Chamber", "Cypher", "Jett", "Kay/O", "Killjoy", "Neon", "Omen",
    "Phoenix", "Raze", "Reyna", "Sage", "Skye", "Sova", "Viper", "Yoru"];
    const random = Math.floor(Math.random() * agents.length);
    document.getElementById("text").innerHTML =
        `${agents[random]}`;
}

function randomWeapon () {
    const weapons = ["Knife", "Classic", "Shorty", "Frenzy", "Ghost", "Sheriff", "Stinger", "Spectre" ,
    "Bucky", "Jugde", "Bulldog", "Guardian", "Phantom", "Vandal", "Marshal", "Operator", "Ares", "Odin"];
    const random = Math.floor(Math.random() * weapons.length);
    document.getElementById("text").innerHTML =
        `${weapons[random]}`;
}