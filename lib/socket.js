var socket = new io.Socket("127.0.0.1", {port: 666});
socket.connect();
socket.on('connect', function(){ 
  console.log("connect");
}); 

socket.on('message', function(msg){
  console.log(msg);
});

socket.on('disconnect', function(){
  console.log("disconnect");
});