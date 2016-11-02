var config = require('./config');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var Swag = require('swag');
var path = require('path');

module.exports = function() {

	var app = express();

	if( process.env.NODE_ENV === 'local' ) {
		app.use(morgan('combined'));
	}
	else if( process.env.NODE_ENV === 'development' ) {
		app.use(morgan('combined'));
	}
	else if( process.env.NODE_ENV === 'production' ) {
		app.use(compress());
	}

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	// parse application/json
	app.use(bodyParser.json())
	
	var hbs = exphbs.create({
		defaultLayout: 'default',
		extname: '.hbs',
		layoutsDir: 'app/view/layout/',
		partialsDir: 'app/view/partial/'
	});

	app.set('views', 'app/view/')
	app.set('view engine', '.hbs');
	app.engine('.hbs', hbs.engine);
	
	Swag.registerHelpers(hbs.handlebars);

	app.use(express.static('public'));

	require('../app/controller/jamsil.server.controller.js')(app);
	require('../app/controller/umyeon.server.controller.js')(app);
	require('../app/controller/sangam.server.controller.js')(app);

	app.use(function(req, res, next) {
		res.status(404).sendFile(path.join(__dirname, '/../public/image/no_image_available.jpg'));
	});
	
	return app;
};
