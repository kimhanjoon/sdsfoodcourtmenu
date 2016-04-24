require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

var telegram = require('telegram-bot-api');
var request = require('request');

var daagalertbot = new telegram({
	token: '194386775:AAEiDXO_4ctkMLe1zWywZZ42Ypjd6BHa058',
	updates: {
        enabled: true
	}
});

var user_cache = require("./user_cache.js");
user_cache.init();

daagalertbot.on('message', function(message) {
	console.log(message);

	var user_id = message.from.id;
	var command = message.text;

	var reply_text = "다시 말씀해주세요.";

	if( command === '/start' ) {
		reply_text = "안녕하세요? 반갑습니다.";
		user_cache.put(user_id, "start_date", message.date);
	}
	if( command === '/status' ) {
		reply_text = user_cache.info(user_id);
	}
	if( command === '점심알림' ) {
		reply_text = "동관이세요? 서관이세요?";
		user_cache.put(user_id, "lunch_alarm_ing", true);
	}
	if( command.indexOf("동관") > -1 && user_cache.get(user_id, "lunch_alarm_ing") ) {
		reply_text = "몇층이세요?";
		user_cache.put(user_id, "campus", "jamsil");
		user_cache.put(user_id, "building", "east");
	}
	if( command.indexOf("서관") > -1 && user_cache.get(user_id, "lunch_alarm_ing") ) {
		reply_text = "몇층이세요?";
		user_cache.put(user_id, "campus", "jamsil");
		user_cache.put(user_id, "building", "west");
	}
	if( command.indexOf("층") > -1 && user_cache.get(user_id, "lunch_alarm_ing") ) {
		reply_text = "점심시간 5분전에 그날의 메뉴를 알려드릴게요.";
		user_cache.remove(user_id, "lunch_alarm_ing");
		user_cache.put(user_id, "lunch_alarm", true);
		user_cache.put(user_id, "floor", command);
	}
	if( command === '저녁알림' ) {
		reply_text = "저녁시간 5분전에 그날의 메뉴를 알려드릴게요.";
		user_cache.put(user_id, "dinner_alarm", true);
	}
	if( command === '알림끝' ) {
		reply_text = "네. 이제 그만 보내겠습니다.";
		user_cache.put(user_id, "lunch_alarm", false);
		user_cache.put(user_id, "dinner_alarm", false);
	}
	if( command === '오늘메뉴' ) {
		var options = {
		  url: 'http://daag.pe.kr',
		  headers: {
		    'Accept': 'application/json'
		  }
		};
		request(options, function(error, response, body) {
			console.log(body);
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
						return e.title_kor + " @" + e.corner;
					}));
				}
				if( b2_foods.length > 0 ) {
					text_array.push("지하2층");
					text_array = text_array.concat(b2_foods.map(function(e) {
						return e.title_kor + " @" + e.corner;
					}));
				}
			}

			daagalertbot.sendMessage({
				chat_id: message.chat.id,
				text: text_array.join("\n")
			})
			.then(function(data) {
				console.log(data);
			})
			.catch(function(err) {
				console.log(err);
			});
		});
		return;		//XXX 메뉴조회후에 sendMessage
	}

	user_cache.print();

	daagalertbot.sendMessage({
		chat_id: message.chat.id,
		text: reply_text
	})
	.then(function(data) {
		console.log(data);
	})
	.catch(function(err) {
		console.log(err);
	});
});
