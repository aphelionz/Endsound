var http = require('http'),
    url = require("url"),
    fs = require('fs'),
    io = require('socket.io'),
    //app = require('express').createServer(),
    
server = http.createServer(function(req, res){
  var path = url.parse(req.url).pathname;
  
  switch (path){
    case '/':
      path = "/index.html"
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
        res.write(data, 'utf8');
        res.end();
      });
      break;
    
    case "/lib/keymap.js":
    case "/lib/audio.js":
    case "/lib/vendor/jquery-1.4.4.js":
      fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        res.writeHead(200, {'Content-Type': 'text/javascript'})
        res.write(data, 'utf8');
        res.end();
      });
      break;

    default: send404(res);
  }
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