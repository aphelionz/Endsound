

/* window.onload = function() {
  Shadowbox.open({
    content:    $("#modal-connect").html(),
    player:     "html",
    title:      "Would you like to participate?",
    height:     180,
    width:      320
  });
}; */

$(document).ready(function() {
  // Read config file and apply changes
  $.getJSON("/config.json", function(data) {
    var config = data;
    
    config["debug"] && $("#debug").show();
  });
});