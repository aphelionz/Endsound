var keyMap = { 81:  {note: "a", freq: 440.0},
               87:  {note: "bb", freq: 466.16},
               69:  {note: "b", freq: 493.88},
               82:  {note: "c", freq: 523.25},
               84:  {note: "cs", freq: 554.37},
               89:  {note: "d", freq: 587.33},
               85:  {note: "ds", freq: 622.25},
               73:  {note: "e", freq: 659.26},
               79:  {note: "f", freq: 698.46},
               80:  {note: "fs", freq: 739.99},
               219: {note: "g", freq: 783.99},
               221: {note: "gs", freq: 830.61} },
    
    soundPlaying = {};

$(document).ready(function() {
  $(document).keydown(function(e) { 
    var note = keyMap[e.keyCode];
    
    if("undefined" !== typeof note) {
      console.log(note.freq, soundPlaying[note.freq]);
      if(true !== soundPlaying[note.freq]) {
        start();
        soundPlaying[note.freq] = true;
      }
    }
  });
  
  $(window).keyup(function(e) {
    var note = keyMap[e.keyCode];
    stop();
    soundPlaying[note.freq] = false;
  });
  
  window.focus();
});