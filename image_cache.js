
var img_cache_map = {};


var _ = require('underscore');
var fs = require('fs');

var _log = _.noop;

exports.init = function(logger) {
	img_cache_map = _.chain(fs.readdirSync("./photo/"))
		.filter(function(e) {
			return e.indexOf('jpg', e.length - 'jpg'.length) !== -1;
		})
		.map(function(e) {
			return e.substr(0, e.length - 3 - 1);
		})
		.map(function(e) {
			return [e, "./photo/" + e + '.jpg'];
		})
		.object()
		.value();
	
	if( logger && typeof logger === "function" ) {
		console.info("logger set : ", logger);
		_log = logger;
	}
	
	console.info("image cached initially : ", Object.keys(img_cache_map).length);
};

var request = require('request');
var easyimg = require('easyimage');

// 캐쉬되도록 이미지 저장하고 캐쉬에 등록
exports.put = function(food_id, food_img_src) {
	
	request({url: food_img_src, encoding: 'binary'}, function(error, response, body) {
		_log('image requested : ', food_img_src);
		fs.writeFile('./downloadphoto/' + food_id + '.png', body, 'binary', function(){
			_log('image downloaded : ', food_id);
			easyimg.convert({src:'./downloadphoto/' + food_id + '.png', dst: './photo/' + food_id + '.jpg', quality:60, background: 'white'}).then(function (file) {
				_log("image converted : ", file.path);
				img_cache_map[food_id] = './photo/' + food_id + '.jpg';
			});
		});
	});
};

// 캐쉬해놓은 이미지 파일이 있는 경우 src 리턴, 없으면 null 리턴
exports.get = function(food_id) {

	if( img_cache_map[food_id] ) {
		_log('hit : ', food_id);
		return img_cache_map[food_id]; 
	}
	else {
		_log('miss : ', food_id);
		return null;
	}
};

