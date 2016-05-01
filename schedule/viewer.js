require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

var Handlebars = require('handlebars');
var fs = require('fs');
var jsonfile = require('jsonfile');
var _ = require('underscore');

var main_template = Handlebars.compile(fs.readFileSync('./main.hbs').toString());
Handlebars.registerPartial('weekday_menu', fs.readFileSync('./main_weekday_menu.hbs').toString());
Handlebars.registerPartial('time_floor_menu', fs.readFileSync('./main_time_floor_menu.hbs').toString());

//TODO 캐쉬로 읽도록...
var food_schedule = jsonfile.readFileSync('./database/jamsil_20160502.json');

exports.renderHTML = function (option) {


	var menu = null;

	if( food_schedule.schedule ) {
		menu = {
		    day1 : _getDayMenu(food_schedule, "day1"),
		    day2 : _getDayMenu(food_schedule, "day2"),
		    day3 : _getDayMenu(food_schedule, "day3"),
		    day4 : _getDayMenu(food_schedule, "day4"),
		    day5 : _getDayMenu(food_schedule, "day5"),
		    day6 : _getDayMenu(food_schedule, "day6"),
		}
	}

    return main_template({
    	menu: menu
    	, googleAnalytics: option.production === true
    	, redirect: option.redirect === true
	});
};

exports.renderJSON = function (option) {

	var food_schedule = jsonfile.readFileSync('./database/jamsil_20160403.json');

    return JSON.stringify(food_schedule);
};

var weekdayMap = {day1: "월요일", day2: "화요일", day3: "수요일", day4: "목요일", day5: "금요일", day6: "토요일"};

function _getDayMenu(schedule, day) {
	return {
        date: schedule.weekday[day],
        weekday: weekdayMap[day],
        foods: _getTitleKor(schedule.schedule, day),
    }
}

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