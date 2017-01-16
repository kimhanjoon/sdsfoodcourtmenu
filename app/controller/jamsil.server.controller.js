var config = require('../../config/config');

var filecache = require('filecache');
var path = require('path');
var foodSchedule = {};
filecache(path.join(__dirname, '../../public/json/jamsil'), function(err, cache) {
	foodSchedule = cache;
});

var _ = require('underscore');
var moment = require('moment');

var fs = require('fs');
var hex = require("../service/hex");

module.exports = function(app) {

	app.get('/', function(req, res, next) {
		req.url = '/jamsil';
		next('route');
	});

	app.get('/jamsil', function(req, res, next) {
		var today = moment().format('YYYYMMDD');
		req.url = `/jamsil/${today}`;
		next('route');
	});

	app.get('/jamsil/:date', function(req, res) {

		var foods = [];

		var todayJsonString = foodSchedule[`/${req.params.date}.json`];
		if( todayJsonString ) {
			foods = JSON.parse(todayJsonString.toString('utf8'));
		}

		_.each(foods, function(food) {
			food.id = hex.to4Hex(food.title_kor);
		});

		var dinner = _.where(foods, {time: 'dinner', floor: 'b1'});
		_.each(foods, function(food) {
			if( food.time === 'lunch' && _.findWhere(dinner, {id: food.id}) ) {
				food.isInDinner = true;
			}
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
				.mapObject(function(e) {
					return _.groupBy(e, "floor");
				})
				.value()

			// 현재 바로 표시될 시간
			, time: time

			// 운영 환경일 때만 google analytics 포함
			, googleAnalytics: config.googleAnalytics
		};

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

	app.post('/jamsil/:date', function(req, res) {

		var date = req.params.date;
		var bodyLength = req.body.length;
		fs.writeFile(path.join(__dirname, `../../public/json/jamsil/${date}.json`), JSON.stringify(req.body), (err) => {
			if (err) throw err;
			console.log(`${date} : ${bodyLength} saved.`);
		});
		res.end();
	});

};
