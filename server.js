var http = require('http'),
    url = require("url"),
    fs = require('fs'),
    io = require('socket.io'),
    //app = require('express').createServer(),
    
server = http.createServer(function(req, res){
  var path = url.parse(req.url).pathname;
  if(path === "/") path = "/index.html";
  var mime = {}
  
  fs.readFile(__dirname + path, function(err, data){
    if (err) return send404(res);
    switch (getExtension(path)){
      case 'html':  mime = {'Content-Type': 'text/html'};       break;
      case "jpg":   mime = {'Content-Type': 'image/jpeg'};      break;
      case "png":   mime = {'Content-Type': 'image/png'};       break;
      case "gif":   mime = {'Content-Type': 'image/gif'};       break;
      case "css":   mime = {'Content-Type': 'text/css'};        break;  
      case "js":    mime = {'Content-Type': 'text/javascript'}; break;
      default:      send404(res);                               break;
    }
    
    res.writeHead(200, {'Content-Type': mime})
    res.write(data, 'utf8');
    res.end();
  });
}),

send404 = function(res){
  res.writeHead(404);
  res.write('Something horrible has happened. Please look away and never come back.');
  res.end();
};

server.listen(666);

// socket.io 
var io = io.listen(server)
  , buffer = [];
  
io.on('connection', function(client){
  client.send({ buffer: buffer });
  client.broadcast({ announcement: client.sessionId + ' connected' });
  
  client.on('message', function(message){
    var msg = { message: [client.sessionId, message] };
    buffer.push(msg);
    if (buffer.length > 15) buffer.shift();
    client.broadcast(msg);
  });

  client.on('disconnect', function(){
    client.broadcast({ announcement: client.sessionId + ' disconnected' });
  });
});

console.log('Server running at http://127.0.0.1:666/');

function getExtension(path) {
  return (/[.]/.exec(path)) ? /[^.]+$/.exec(path)[0] : undefined;
}