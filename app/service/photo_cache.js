var _log = function() {};

var photo_cache_map = {};

var _ = require('underscore');
var fs = require('fs');

exports.init = function(logger) {
	photo_cache_map = _.chain(fs.readdirSync("./photo/"))
		.filter(function(e) {
			return e.indexOf("-") > -1 && e.indexOf("jpg") > -1;
		})
		.map(function(e) {
			return "/photo/" + e;
		})
		.groupBy(function(e) {
			return e.replace("/photo/", "").replace(".jpg", "").split("-")[0];
		})
		.value();
	
	if( logger && typeof logger === "function" ) {
		console.info("logger set : ", logger.name);
		_log = logger;
	}
	
	console.info("photo cache initialized : ", Object.keys(photo_cache_map).length);
};

// 캐쉬되도록 이미지 저장하고 캐쉬에 등록
exports.put = function(food_id, food_photo_filename) {
	
	if( photo_cache_map[food_id] ) {
		photo_cache_map[food_id].push("/photo/" + food_photo_filename);
		console.info("photo cache increased : ", food_id, " : ", photo_cache_map[food_id].length);
	}
	else {
		photo_cache_map[food_id] = ["/photo/" + food_photo_filename];
		console.info("photo cache increased : ", Object.keys(photo_cache_map).length);
	}
};

// 캐쉬해놓은 이미지 파일이 있는 경우 배열 리턴, 없으면 null 리턴
exports.get = function(food_id) {

	if( photo_cache_map[food_id] ) {
		return photo_cache_map[food_id]; 
	}
	else {
		return null;
	}
};

