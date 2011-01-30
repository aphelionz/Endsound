var socket = new io.Socket("127.0.0.1", {port: 666});

$(document).ready(function() {
});

/* function actual_connect() {
  socket.connect();
  
  socket.on('connect', function(){ 
    console.log("connect");
  }); 
  
  socket.on('message', function(msg){
    if("undefined" !== typeof msg.message) {
      if("undefined" !== typeof msg.message[1].start) {
        start(msg.message[1].start)
      }
      if("undefined" !== typeof msg.message[1].stop) {
        stop()
      }
    }
  });
  
  socket.on('disconnect', function(){
    console.log("disconnect");
  });
} */