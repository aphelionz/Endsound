var socket = new io.Socket("ec2-184-72-196-220.compute-1.amazonaws.com", {port: 666});
socket.connect();

socket.on('connect', function() {
  $("#avatars").append('<dl class="user" id="u-6"><dt>FWIGGLES</dt><dd></dd></dl>');
}); 

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
  socket.connect(); // prevent timeout disconnects for continuous listening
  console.log("disconnect");
});