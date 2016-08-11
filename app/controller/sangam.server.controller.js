var config = require('../../config/config');
var sangam_parser = require('../service/sangam.parser');

var request = require('request');
var _ = require('underscore');

if( process.env.NODE_ENV === "test" ) {
	
	var fs = require('fs');
	requestsdsfoodcourtmenu = function(zonename, callback) {
		return fs.readFile('./test/sangammenu/' + zonename + '.html', 'utf8', callback);
	};
}

module.exports = function(app) {

	app.get('/sangam', function(req, res){


		request("http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=SA", function(error, response, body) {

			var foods = sangam_parser.parse(body);
			
			var option = {
				// 층별로 나눠서 표시하기 위해 미리 나눔
				foods: foods

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
				res.render('sangam', option);
			}
			else if( req.accepts('json') ) {
				res.json(option.foods);
			}
			else {
				res.render('sangam', option);
			}
		});

	});

};
