var http = require('http'),
    url = require("url"),
    fs = require('fs'),
    io = require('socket.io'),
    //app = require('express').createServer(),
    
server = http.createServer(function(req, res){
  // your normal server code
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

    default: send404(res);
  }
}),

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};

server.listen(666);


console.log('Server running at http://127.0.0.1:666/');