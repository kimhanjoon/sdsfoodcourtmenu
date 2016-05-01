require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

var Handlebars = require('handlebars');
var fs = require('fs');
var jsonfile = require('jsonfile');
var _ = require('underscore');

exports.renderHTML = function (option) {

	//TODO 바깥으로...
	var main_template = Handlebars.compile(fs.readFileSync('./main.hbs').toString());
	Handlebars.registerPartial('weekday_menu', fs.readFileSync('./main_weekday_menu.hbs').toString());
	Handlebars.registerPartial('time_floor_menu', fs.readFileSync('./main_time_floor_menu.hbs').toString());

	var food_schedule = jsonfile.readFileSync('./database/jamsil_20160403.json');

	var foods = {
		day1 : _getTitleKor(food_schedule.schedule, "day1"),
		day2 : _getTitleKor(food_schedule.schedule, "day2"),
		day3 : _getTitleKor(food_schedule.schedule, "day3"),
		day4 : _getTitleKor(food_schedule.schedule, "day4"),
		day5 : _getTitleKor(food_schedule.schedule, "day5"),
		day6 : _getTitleKor(food_schedule.schedule, "day6"),
	};

	foods.day1.weekday = weekdayMap.day1;
	foods.day1.date = food_schedule.weekday.day1;
	foods.day2.weekday = weekdayMap.day2;
	foods.day2.date = food_schedule.weekday.day2;
	foods.day3.weekday = weekdayMap.day3;
	foods.day3.date = food_schedule.weekday.day3;
	foods.day4.weekday = weekdayMap.day4;
	foods.day4.date = food_schedule.weekday.day4;
	foods.day5.weekday = weekdayMap.day5;
	foods.day5.date = food_schedule.weekday.day5;
	foods.day6.weekday = weekdayMap.day6;
	foods.day6.date = food_schedule.weekday.day6;

    return main_template({
    	foods: foods
    	, googleAnalytics: option.production === true
    	, redirect: option.redirect === true
	});
};

exports.renderJSON = function (option) {

	var food_schedule = jsonfile.readFileSync('./database/jamsil_20160403.json');

    return JSON.stringify(food_schedule);
};

var weekdayMap = {day1: "월요일", day2: "화요일", day3: "수요일", day4: "목요일", day5: "금요일", day6: "토요일"};

function _getTitleKor(list, day) {
	var foods = _.chain(list)
	.map(function(e) {
	    return _.extend({title_kor: e[day]}, _.pick(e, "time","floor","corner"));
	})
	.filter(function(e) {
		return e.title_kor !== "";
	})
	.value();

	return {
		breakfast: _.where(foods, {time:"breakfast"}),
		lunchb1: _.where(foods, {time:"lunch", floor:"b1"}),
		lunchb2: _.where(foods, {time:"lunch", floor:"b2"}),
		dinner: _.where(foods, {time:"dinner"}),
	};
}