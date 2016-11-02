require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

process.env.NODE_ENV = process.env.NODE_ENV || 'local';

var config = require('./config/config');

var imageConverter = require('./app/service/image.converter');

var express = require('./config/express');

var app = require('letsencrypt-express').create({
	server: config.https.server,
	email: config.https.email,
	agreeTos: true,
	approveDomains: config.https.domains,
	app: express()
});

app.listen(config.port, config.https.port);

module.exports = app;

console.log("Server running at %d, %d", config.port, config.https.port);
