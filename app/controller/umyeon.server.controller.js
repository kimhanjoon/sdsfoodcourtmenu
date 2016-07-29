var config = require('../../config/config');
var umyeon_parser = require('../service/umyeon.parser');

var request = require('request');
var iconv = require('iconv-lite');
var _ = require('underscore');

module.exports = function(app) {

	app.get('/umyeon', function(req, res){

		request({uri: "http://welstory.com/menu/seoulrnd/menu.jsp", encoding: 'binary'}, function(error, response, body) {

			var utf8_body = iconv.decode(new Buffer(body, 'binary'), 'euc-kr');

			var foods = umyeon_parser.parseFoods(utf8_body);

			var option = {
				// 시간,분류별로 나눠서 표시하기 위해 미리 나눔
				foods : _.chain(foods)
					.groupBy("time")
					.mapObject(function(e) {
						return _.groupBy(e, "floor");
					})
					.value(),
			
				// 현재 바로 표시될 시간
				time : umyeon_parser.parseTime(utf8_body),

				// 영업종료시
				isClosed: foods.length === 0,
				
				// 운영 환경일 때만 google analytics 포함
				googleAnalytics: config.googleAnalytics
			};

			// html -> json 순서로 response content-type을 정한다.
			if( req.accepts('html') ) {
				res.render('umyeon', option);
			}
			else if( req.accepts('json') ) {
				res.json(option.foods);
			}
			else {
				res.render('umyeon', option);
			}
		});
	});

};
