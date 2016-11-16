var config = require('../../config/config');
var path = require('path');

module.exports = function(app) {

	app.get('/sangam', function(req, res){
		res.sendFile(path.join(__dirname, '../../public/html/sangam.html'));
	});

};
