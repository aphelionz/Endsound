var http = require('http'),
    io = require('socket.io');

var buffer = [], json = JSON.stringify;
  
var server = http.createServer(function (request, response) {
  // Normal Server Code
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
});
server.listen(666);
    
io.listen(server, {

	onClientConnect: function(client){
		client.send(json({ buffer: buffer }));
		client.broadcast(json({ announcement: client.sessionId + ' connected' }));
	},

	onClientDisconnect: function(client){
		client.broadcast(json({ announcement: client.sessionId + ' disconnected' }));
	},

	onClientMessage: function(message, client){
		var msg = { message: [client.sessionId, message] };
		buffer.push(msg);
		if (buffer.length > 15) buffer.shift();
		client.broadcast(json(msg));
	}

});