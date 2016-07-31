var fs = require('fs');
var request = require('request');
var easyimg = require('easyimage');

module.exports = function(location) {

	// 디렉토리
	var _dirDownloaded = './private/image/food/' + location + '/downloaded/';
	var _dirConverted = './public/image/food/' + location + '/';

	// 디렉토리가 없으면 만들고 시작
	var mkdirp = require('mkdirp');
	mkdirp.sync(_dirDownloaded);
	mkdirp.sync(_dirConverted);

	var imageConverter = {};

	// 이미지 다운로드 받고 사이즈 줄여서 저장
	imageConverter.put = function(food_id, food_img_src) {
		
		var fileDownloaded = _dirDownloaded + food_id + '.png';
		var fileConverted = _dirConverted + food_id + '.jpg';

		fs.access(fileConverted, function(err) {

			// 이미지가 없을 떄만 새로 처리한다.		
			if( err ) {
				console.log('new image : ', food_id);

				console.log('image requested : ', food_img_src);
				request({url: food_img_src, encoding: 'binary'}, function(err, response, body) {
					
					console.log('image response : ', food_id);
					
					if( err ) {
						console.error('image response error : ', err);
					}
					
					fs.writeFile(fileDownloaded, body, 'binary', function(){
						
						console.log('image downloaded : ', food_id);
						
						easyimg.convert({
							src:fileDownloaded, 
							dst:fileConverted, 
							quality:60, 
							background: 'white'
						}).then(function (file) {
							
							console.log("image converted : ", file.path);
						});
					});
				});
			}
		})
	};

	return imageConverter;
};

