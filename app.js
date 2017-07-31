'use strict';

var express = require("express");
var app = express();
var routes = require("./routes");

var jsonParser = require("body-parser").json;
var logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Using `mongoose.connect`...
var promise = mongoose.connect("mongodb://localhost:27017/postcodes", {
  useMongoClient: true,
  /* other options */
});

// Or `createConnection`
var promise = mongoose.createConnection('mongodb://localhost:27017/postcodes', {
  useMongoClient: true,
  /* other options */
});

promise.then(function(db) {
	console.log("Connection with database succeeded.");
	// All database communication goes here
});

app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if(req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
		return res.status(200).json({});
	}
	next();
});

app.use("/postcodes", routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next){
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error Handler
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server is listening on port", port);
});