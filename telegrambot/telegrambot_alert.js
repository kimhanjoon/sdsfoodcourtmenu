require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

var _ = require('underscore');

var schedule = require('node-schedule');

var telegram = require('telegram-bot-api');
var request = require('request');

var daagalertbot = new telegram({
	token: '194386775:AAEiDXO_4ctkMLe1zWywZZ42Ypjd6BHa058'
});

var lunch_alarm_time_list = "/11_25, /11_30, /11_35, /11_40, /11_45, /11_50, /11_55, /12_00, /12_05, /12_10, /12_15, /12_20, /12_25, /12_30, /12_35, /12_40, /12_45, /12_50, /12_55, /13_00, /13_05, /13_10, /13_15, /13_20, /13_25".split(", ");
_.each(lunch_alarm_time_list, function(time) {
	schedule.scheduleJob(time.substring(4,7) + " " + time.substring(1,3) + " * * 1-5", function() {

		var user_cache = require("./user_cache.js");
		user_cache.init();
		user_cache.each(function(e) {
			if( e.lunch_alarm_time === time ) {
				sendMenu(e["chat_id"]);
			}
		});
	});
	console.info(time + " scheduled");
});

var dinner_alarm_time_list = "/17_50, /17_55, /18_00, /18_05, /18_10, /18_15, /18_20, /18_25, /18_30, /18_35, /18_40, /18_45, /18_50, /18_55".split(", ");
_.each(dinner_alarm_time_list, function(time) {
	schedule.scheduleJob(time.substring(4,7) + " " + time.substring(1,3) + " * * 1-5", function() {
		var user_cache = require("./user_cache.js");
		user_cache.init();
		user_cache.each(function(e) {
			if( e.dinner_alarm_time === time ) {
				sendMenu(e["chat_id"]);
			}
		});
	});
	console.info(time + " scheduled");
});

function sendMenu(chatId) {

	var options = {
	  url: 'http://daag.pe.kr',
	  headers: {
	    'Accept': 'application/json'
	  }
	};
	request(options, function(error, response, body) {
		var menu = JSON.parse(body);

		var b1_foods = menu.filter(function(e) {
			return e.floor === "b1";
		});
		var b2_foods = menu.filter(function(e) {
			return e.floor === "b2";
		});

		var text_array = [];
		if( b1_foods.length === 0 && b2_foods.length === 0 ) {
			text_array = ["지금은 영업하지 않습니다."];
		}
		else {
			if( b1_foods.length > 0 ) {
				text_array.push("지하1층");
				text_array = text_array.concat(b1_foods.map(function(e) {
					return e.title_kor + " (" + e.corner + ")";
				}));
			}
			if( b2_foods.length > 0 ) {
				text_array.push("지하2층");
				text_array = text_array.concat(b2_foods.map(function(e) {
					return e.title_kor + " (" + e.corner + ")";
				}));
			}

			// 알람은 메뉴가 있을 때만 보낸다.
			daagalertbot.sendMessage({
				chat_id: chatId,
				text: text_array.join("\n")
			})
			.then(function(data) {
				console.log(data);
			})
			.catch(function(err) {
				console.log(err);
			});
		}

	});
}