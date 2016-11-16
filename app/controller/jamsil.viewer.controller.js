var config = require('../../config/config');
var path = require('path');

module.exports = function(app) {

	app.get('/', function(req, res, next) {
		req.url = '/jamsil';
		next('route');
	});

	app.get('/jamsil', function(req, res){
		res.sendFile(path.join(__dirname, '../../public/html/jamsil.html'));
	});

};
