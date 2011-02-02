$(document).ready(function() {
  var truedisconnect = false 
  socket.connect();
  
  socket.on('connect', function() { }); 

  socket.on('message', function(msg){
    if("undefined" !== typeof msg.message) {
      if("undefined" !== typeof msg.message[1].play) {
        event = msg.message[1].play;
        synthesizer.play(event.keyId, event.hz, event.volume);
      }
      if("undefined" !== typeof msg.message[1].stop) {
        event = msg.message[1].stop;
        synthesizer.stop(event.keyId);
      }
      if("undefined" !== typeof msg.message[1].sustain) {
        event = msg.message[1].sustain;
        synthesizer.setSustain(event);
      }
    }
  });

  socket.on('disconnect', function(){
    !truedisconnect && socket.connect();
  });
  
  $(window).bind('beforeunload', function() {
    truedisconnect = true;
    socket.disconnect();
  });
})
