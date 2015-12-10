var _ = require('underscore');
var fs = require('fs');

var img_cache_map = _.chain(fs.readdirSync('photo'))
	.filter(function(e) {
		return e.indexOf('jpg', e.length - 'jpg'.length) !== -1;
	})
	.map(function(e) {
		return e.substr(0, e.length - 3 - 1);
	})
	.map(function(e) {
		return [e, '/photo/' + e + '.jpg'];
	})
	.object()
	.value();
console.info("image cached : ", Object.keys(img_cache_map).length);

var request = require('request');
var easyimg = require('easyimage');

// 캐쉬되도록 이미지 저장하고 캐쉬에 등록
exports.put = function(food_id, food_img_src) {
	
	request({url: food_img_src, encoding: 'binary'}, function(error, response, body) {
//			console.log('image');
		fs.writeFile('downloadphoto/' + food_id + '.png', body, 'binary', function(){
			easyimg.convert({src:'downloadphoto/' + food_id + '.png', dst: 'photo/' + food_id + '.jpg', quality:60, background: 'white'}).then(function (file) {
//					console.log(file);
				img_cache_map[food_id] = '/photo/' + food_id + '.jpg';
			});
		});
	});
};

// 캐쉬해놓은 이미지 파일이 있는 경우 src 리턴, 없으면 null 리턴
exports.get = function(food_id) {

	if( img_cache_map[food_id] ) {
//		console.log('hit');
		
		return img_cache_map[food_id]; 
	}
	else {
//		console.log('miss');

		return null;
	}
};

