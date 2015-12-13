
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

//Returns a random integer between min (included) and max (excluded)
//Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomFiveDigits() {
	return getRandomInt(10000, 99999);
}

var fs = require('fs');
var easyimg = require('easyimage');
exports.makePhoto = function(filename) {
	
	var randomNumber = getRandomFiveDigits();
	var filenamewithpath = './uploadphoto/' + filename;
	easyimg.convert({
		src: filenamewithpath
		, dst: filenamewithpath + '_convert.jpg'
		, quality: 60
		, background: 'white'
	})
	.then(function(file) {
		easyimg.resize({
			src: filenamewithpath + '_convert.jpg'
			, dst: filenamewithpath + '_resize.jpg'
			, width: 420
			, height: 350
		}).then(
			function(image) {
				// 파일명에 랜덤5자리 숫자를 붙인 이름으로 복사한다.
				fs.createReadStream(filenamewithpath + '_resize.jpg')
				.pipe(fs.createWriteStream(filenamewithpath + '_' + randomNumber + '.jpg'));
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

exports.registerPhoto = function(filename) {

	try {
		fs.accessSync('./uploadphoto/' + filename, fs.R_OK);
	}
	catch(err) {
		return;
	}
	
	try {
		fs.createReadStream('./uploadphoto/' + filename)
		.pipe(fs.createWriteStream('./photo/' + filename.replace(/_[0-9]{5}$/, '.jpg')));
	}
	catch(err) {
		console.error(err);
	}
}