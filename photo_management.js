
// Http Multipart에서 업로드된 파일 처리
var multer  = require('multer');
exports.getUploadFn = function() {
	var storage = multer.diskStorage({
		destination : function(req, file, cb) {
			cb(null, 'uploadphoto');
		},
		filename : function(req, file, cb) {
			cb(null, req.body.foodId + '-' + Date.now());
		}
	});
	var upload = multer({ storage: storage });
	return upload.single('foodPhoto');
}

var easyimg = require('easyimage');
exports.makePhoto = function(filename) {
	easyimg.convert({
		src: './uploadphoto/' + filename
		, dst: './uploadphoto/' + filename + '_convert.jpg'
		, quality: 60
		, background: 'white'
	})
	.then(function(file) {
		easyimg.resize({
			src: './uploadphoto/' + filename + '_convert.jpg'
			, dst: './uploadphoto/' + filename + '_resize.jpg'
			, width: 420
			, height: 350
		}).then(
			function(image) {
			},
			function (err) {
				console.error(err);
			}
		);
    },
	function (err) {
		console.error(err);
	});
};