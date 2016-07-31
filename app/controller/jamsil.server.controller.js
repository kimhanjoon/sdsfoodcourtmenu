var config = require('../../config/config');
var jamsil_parser = require('../service/jamsil.parser');

var request = require('request');
var async = require('async');
var _ = require('underscore');

var requestsdsfoodcourtmenu = function(zonename, callback) {
	return request("http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=" + zonename, function(error, response, body) {
		return callback(error, body);
	});
};

if( process.env.NODE_ENV === "test" ) {
	
	var fs = require('fs');
	requestsdsfoodcourtmenu = function(zonename, callback) {
		return fs.readFile('./test/jamsilmenu/' + zonename + '.html', 'utf8', callback);
	};
}

module.exports = function(app) {

	app.get('/', function(req, res, next) {
		req.url = '/jamsil';
		next('route');
	});

	app.get('/jamsil', function(req, res){

		async.map(['ZONE01','ZONE02'], requestsdsfoodcourtmenu, function(err, data){
			var menu1 = jamsil_parser.parse(data[0]);
			var menu2 = jamsil_parser.parse(data[1]);
			
			var foods = menu1.concat(menu2);

			var option = {
				// 층별로 나눠서 표시하기 위해 미리 나눔
				foods: _.groupBy(foods, 'floor')

				// 영업종료시
				, isClosed: foods.length === 0
				
				// 운영 환경일 때만 google analytics 포함
				, googleAnalytics: config.googleAnalytics
			};
			
			// 영어권 사용자는 바로 영어가 보이게끔 language 전달
			var languages = req.acceptsLanguages();
			if( languages && languages.length && languages.length > 0 && languages[0].indexOf("en") > -1 ) {
				option.english = true;
			}

			// html -> json 순서로 response content-type을 정한다.
			if( req.accepts('html') ) {
				res.render('jamsil', option);
			}
			else if( req.accepts('json') ) {
				res.json(option.foods);
			}
			else {
				res.render('jamsil', option);
			}
		});

	});

};
