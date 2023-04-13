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

function readJSON(filename) {
    $(function() {
    $.getJSON(filename, function(data) {
        return data
})})}