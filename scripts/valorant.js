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