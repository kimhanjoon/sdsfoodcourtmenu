var _log = function() {};

var img_cache_map = {};

var _ = require('underscore');
var fs = require('fs');

exports.init = function(logger) {
	img_cache_map = _.chain(fs.readdirSync("./image/"))
		.filter(function(e) {
			return e.indexOf("jpg") > -1;
		})
		.map(function(e) {
			return [e.replace(".jpg", ""), "/image/" + e];
		})
		.object()
		.value();
	
	if( logger && typeof logger === "function" ) {
		console.info("logger set : ", logger.name);
		_log = logger;
	}
	
	console.info("image cache initialized : ", Object.keys(img_cache_map).length);
};

var request = require('request');
var easyimg = require('easyimage');

// 캐쉬되도록 이미지 저장하고 캐쉬에 등록
exports.put = function(food_id, food_img_src) {
	
	request({url: food_img_src, encoding: 'binary'}, function(error, response, body) {
		_log('image requested : ', food_img_src);
		fs.writeFile('./downloadimage/' + food_id + '.png', body, 'binary', function(){
			_log('image downloaded : ', food_id);
			easyimg.convert({src:'./downloadimage/' + food_id + '.png', dst: './image/' + food_id + '.jpg', quality:60, background: 'white'}).then(function (file) {
				_log("image converted : ", file.path);
				img_cache_map[food_id] = '/image/' + food_id + '.jpg';
				console.info("image cached initially : ", Object.keys(img_cache_map).length);
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

