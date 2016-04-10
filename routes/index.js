//route file for socket.io - tells the server to listen and where and emits the messages from the server

	var users 	 = [];
	var messages = [];

	var existing_user = function(user) {
		for (var i = 0; i < users.length; i++){
			if(user == users[i]) {
				return true;
			} else {
				return false;
			}
		}
	};

module.exports = function Route(app, io) {
	// this gets the socket.io module  
	// var io = require('socket.io').listen(server); // notice we pass the server object
	
	// setup the connection event
	io.sockets.on('connection', function(socket) {
	// console.log("WE ARE USING SOCKETS!");
		socket.on('chat_load', function(data) {
		// console.log("data on connection is " + data);

			if (existing_user(data.username)) {
			//send an error to the user that their name is already in chat
				socket.emit('user_exists', {error: " Username already exists. "})
			} else {
				users.push(data.username);
				//LOAD ALL MESSAGES FOR THE NEW USER 
				console.log("users array is " + users);
				console.log("username: " + data.username);
				socket.emit('load_messages', {username: data.username, messages: messages, timestamp: data.timestamp});
				socket.emit('load_online_users', {users: users});
			}
		});

		//EMIT TO ALL USERS THE NEW MESSAGE
		socket.on('new_message', function(data) {
			console.log("data received from new_message is " + data.message);
			messages.push({username: data.username, message: data.message, timestamp: data.timestamp});
			io.emit('new_message_post', {username: data.username, new_message: data.message, timestamp: data.timestamp});
		});

		//DISCONNECT
		// socket.on('disconnect', function(data) {
		// 	io.emit('user_disconnect', {username: data.username, message: data.disconnect_msg});
		// })

	});

// render the index.ejs view
	app.get('/', function(req, res) {
		res.render('index');
	})

}