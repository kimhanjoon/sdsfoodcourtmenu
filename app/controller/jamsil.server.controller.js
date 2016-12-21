var config = require('../../config/config');

var filecache = require('filecache');
var path = require('path');
var foodSchedule = {};
filecache(path.join(__dirname, '../../public/json/jamsil'), function(err, cache) {
	foodSchedule = cache;
});

var _ = require('underscore');
var moment = require('moment');

module.exports = function(app) {

	app.get('/', function(req, res, next) {
		req.url = '/jamsil';
		next('route');
	});

	app.get('/jamsil', function(req, res){

		var today = moment().format('YYYYMMDD');
		var todayJson = '/' + today + '.json';
		var foods = JSON.parse(foodSchedule[todayJson].toString('utf8'));

		var time;
		if( moment().hour() < 10 ) {
			time = 'breakfast';
		}
		else if( moment().hour() < 14 ) {
			time = 'lunch';
		}
		else {
			time = 'dinner';
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

};
