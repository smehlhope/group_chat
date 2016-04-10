// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
// require body-parser
var bodyParser = require('body-parser');
// create the express app
var app = express();

// using bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

// static content
app.use(express.static(path.join(__dirname, "./static")));

// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// tell the express app to listen on port 6767
var server = app.listen(6767, function() {
	console.log("listening on port 6767");
})

// this gets the socket.io module  
var io = require('socket.io').listen(server); // notice we pass the server object


//here instead of posting data we use the route - remember the route module takes in the app and the server
var route = require('./routes/index.js')(app, io);


