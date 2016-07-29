var _ = require('underscore');
var fs = require('fs');
var mkdirp = require('mkdirp');

mkdirp.sync('./private/image/downloaded/');
mkdirp.sync('./private/image/converted/');

var request = require('request');
var easyimg = require('easyimage');

// 이미지 다운로드 받고 사이즈 줄여서 저장
exports.put = function(food_id, food_img_src) {
	
	request({url: food_img_src, encoding: 'binary'}, function(error, response, body) {
		
		console.log('image requested : ', food_img_src);
		
		fs.writeFile('../../private/image/downloaded/' + food_id + '.png', body, 'binary', function(){
			
			console.log('image downloaded : ', food_id);
			
			easyimg.convert({
				src:'../../private/image/downloaded/' + food_id + '.png', 
				dst:'../../private/image/converted/' + food_id + '.jpg', 
				quality:60, 
				background: 'white'
			}).then(function (file) {
				
				console.log("image converted : ", file.path);
			});
		});
	});
};
