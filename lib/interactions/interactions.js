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
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-21107634-1']);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    }
  });
  
  // Interactions
  $("#options").mouseover(function() {
    $(this).find("*").animate({"opacity": "1"}, 1000);
  });
  
  $("#avatars dd")
    .mouseover(function() {
      $(this).css({"opacity":   parseFloat($(this).css("opacity")) + .1});
    })
    .mouseout(function() { 
      if($(this).is(":animated")) {
        $(this).stop();
      } else {
        $(this).css({"opacity": parseFloat($(this).css("opacity")) - .1});
      }
    })
    .click(function() { $(this).stop();
      if($(this).css("opacity") === "0.75") { 
        $(this).css({"opacity": .3});   return; 
      }
      if ($(this).css("opacity") === "0.3") { 
        $(this).css({"opacity": .75});  return; 
      } 
    });

});
  