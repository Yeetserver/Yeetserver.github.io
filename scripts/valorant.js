
function randomMap () {
    const maps = ["Bind", "Haven", "Fracture", "Breeze", "Icebox", "Ascent", "Split", "Pearl"];
    var map = maps[random(maps.length)];
    console.log(map);   
}

function randomAgent () {
    const agents = ["Astra", "Breach", "Brimstone", "Chamber", "Cypher", "Jett", "Kay/O", "Killjoy", "Neon", "Omen",
    "Phoenix", "Raze", "Reyna", "Sage", "Skye", "Sova", "Viper", "Yoru"];
    var agent = agents[random(agents.length)];
    console.log(agent);
}

function randomWeapon () {
    const weapons = ["Knife", "Classic", "Shorty", "Frenzy", "Ghost", "Sheriff", "Stinger", "Spectre" ,
    "Bucky", "Jugde", "Bulldog", "Guardian", "Phantom", "Vandal", "Marshal", "Operator", "Ares", "Odin"];
    var weapon = weapons[random(weapons.length)];
    console.log(weapon);
}