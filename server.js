var http = require('http'),
    url = require("url"),
    fs = require('fs'),
    io = require('socket.io'),
    config,

send404 = function(res){
  res.writeHead(404);
  res.write('Something horrible has happened. Please look away and never come back.');
  res.end();
},

getExtension = function(path) {
  return (/[.]/.exec(path)) ? /[^.]+$/.exec(path)[0] : undefined;
};

// Load Configuration settings
fs.readFile(__dirname + "/config.json", function(err, data) {
  if(err) { console.log("No configuration file, dawg?"); } else {
    config = JSON.parse(data);
  }  
});

var server = http.createServer(function(req, res){
  var mime = {}
  var path = url.parse(req.url).pathname;
  if(path === "/") path = "/index.html";

  fs.readFile(__dirname + path, function(err, data){
    if (err) return send404(res);
    switch (getExtension(path)){
      case 'html':  mime = {'Content-Type': 'text/html'};         break;
      case "jpg":   mime = {'Content-Type': 'image/jpeg'};        break;
      case "png":   mime = {'Content-Type': 'image/png'};         break;
      case "gif":   mime = {'Content-Type': 'image/gif'};         break;
      case "css":   mime = {'Content-Type': 'text/css'};          break;  
      case "js":    mime = {'Content-Type': 'text/javascript'};   break;
      case "json":  mime = {"Content-Type": "application/json"};  break;
      default:      send404(res);                                 break;
    }
    
    res.writeHead(200, mime)
    res.write(data, 'utf8');
    res.end();
  });
}),

io = io.listen(server),  
buffer = [];
  
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

server.listen(666);

console.log('Server running at http://127.0.0.1:666/');
