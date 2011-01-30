Shadowbox.init({
  skipSetup: true
});

window.onload = function() {
  Shadowbox.open({
    content:    $("#modal-connect").html(),
    player:     "html",
    title:      "Would you like to participate?",
    height:     180,
    width:      320
  });
};

$(document).ready(function() {
  // Read config file and apply changes
  $.getJSON("/config.json", function(data) {
    var config = data;
    
    config["debug"] && $("#debug").show();
    
    // Analytics
    if(false !== config["analytics"]) {
      // This won't work but this is where I want to put the analytic code
      var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
      (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
      g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
      s.parentNode.insertBefore(g,s)}(document,'script'));
    }
  });
  
  // Interactions
  $("#options").mouseover(function() {
    $(this).find("*").animate({"opacity": "1"}, 1000);
  });
});