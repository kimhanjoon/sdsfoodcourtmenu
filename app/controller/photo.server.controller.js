module.exports = function(app) {

	var photo_management = require("./photo_management.js");
	app.post('/uploadphoto', photo_management.getUploadFn(), function(req, res, next) {
		photo_management.makePhoto(req.file.filename);
		res.end();
	});

	app.get('/registerphoto', function(req, res, next) {
		var msg = photo_management.registerPhoto(req.query.filename);
		res.end(msg);
	});
	app.get('/rejectphoto', function(req, res, next) {
		var msg = photo_management.rejectPhoto(req.query.filename);
		res.end(msg);
	});

	app.use('/uploadphoto', express.static('uploadphoto'));
};
