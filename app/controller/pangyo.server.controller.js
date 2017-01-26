var config = require('../../config/config');

var filecache = require('filecache');
var path = require('path');
var foodSchedule = {};
filecache(path.join(__dirname, '../../public/json/pangyo'), function(err, cache) {
	foodSchedule = cache;
});

var _ = require('underscore');
var moment = require('moment');

var fs = require('fs');
var hex = require("../service/hex");

module.exports = function(app) {

	app.get('/pangyo', function(req, res, next) {
		var today = moment().format('YYYYMMDD');
		req.url = `/pangyo/${today}`;
		next('route');
	});

	app.get('/pangyo/:date', function(req, res) {

		var foods = [];

		var todayJsonString = foodSchedule[`/${req.params.date}.json`];
		if( todayJsonString ) {
			foods = JSON.parse(todayJsonString.toString('utf8'));
		}

		_.each(foods, function(food) {
			food.id = hex.to4Hex(food.title_kor);
		});

		var time;
		if( moment().hour() < 10 ) {
			time = 'breakfast';
		}
		else if( moment().hour() < 14 ) {
			time = 'lunch';
		}
		else {
			time = 'dinner';		//TODO 20시 이후에는 다음날로 표시
		}

		var option = {
			// 층별로 나눠서 표시하기 위해 미리 나눔
			foods: _.chain(foods)
				.groupBy("time")
				.value()

			// 현재 바로 표시될 시간
			, time: time

			// 운영 환경일 때만 google analytics 포함
			, googleAnalytics: config.googleAnalytics
		};

		// html -> json 순서로 response content-type을 정한다.
		if( req.accepts('html') ) {
			res.render('pangyo', option);
		}
		else if( req.accepts('json') ) {
			res.json(option.foods);
		}
		else {
			res.render('pangyo', option);
		}

	});

	app.post('/pangyo/:date', function(req, res) {

		var date = req.params.date;
		var bodyLength = req.body.length;
		fs.writeFile(path.join(__dirname, `../../public/json/pangyo/${date}.json`), JSON.stringify(req.body), (err) => {
			if (err) throw err;
			console.log(`${date} : ${bodyLength} saved.`);
		});
		res.end();
	});

};
