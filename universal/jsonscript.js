function foreachJSON(filename, functionname) {
    $(function() {
    $.getJSON(filename, function(data) {
        $.each(data.messages, function(i, f) {
          var contents = `${f.name}: ${f.message} <br>`
          filename.push(contents)
})})})}

function readJSON(filename) {
    $(function() {
    $.getJSON(filename, function(data) {
        return data
})})}