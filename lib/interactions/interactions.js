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
  $("#options").mouseover(function() {
    $(this).find("*").animate({"opacity": "1"}, 1000);
  });
});