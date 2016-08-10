require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

process.env.NODE_ENV = process.env.NODE_ENV || 'local';

var config = require('./config/config');

var imageConverter = require('./app/service/image.converter');

var express = require('./config/express');

var app = express();

app.listen(config.port);

module.exports = app;

console.log("Server running at %d", config.port);
