var config = require('./config');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var Swag = require('swag');

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
	// app.use('/image', express.static('image'));
	// app.use('/photo', express.static('photo'));

	require('../app/controller/jamsil.server.controller.js')(app);
	require('../app/controller/umyeon.server.controller.js')(app);
	// require('../app/controller/photo.server.controller.js')(app);

	return app;
};
