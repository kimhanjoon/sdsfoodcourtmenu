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

function _toHourMinuteText(command) {
	return command.replace(/\/([0-9]{2})_([0-9]{2})/, "$1시 $2분");
}

var _HOUR_MINUTE_COMMAND_REGEXP = /\/[0-9]{2}_[0-9]{2}/;
function _isHourMinuteRegExp(command) {
	return _HOUR_MINUTE_COMMAND_REGEXP.test(command);
}

daagalertbot.on('message', function(message) {
	console.log(message);

	var user_id = message.from.id;
	var command = message.text;

	var reply_text = "다시 말씀해주세요.";

	if( command === '/start' || command === '/help' ) {
		reply_text = [
		              "/menu 지금 메뉴를 보여드려요.",
                      "/lunch_alarm 점심메뉴를 알려드려요.",
                      "/dinner_alarm 저녁메뉴를 알려드려요.",
                      "/stop_alarm 모든 알림을 중지해요.",
                      "/help 사용 가능한 모든 명령을 표시해요.",
                      ].join("\n");
		user_cache.put(user_id, "start_date", message.date);
	}
	if( command === '/lunch_alarm' || command.indexOf("점심알림") > -1 ) {
		reply_text = "언제 알려드릴까요? 11시 25분부터 5분단위로 설정할 수 있어요.\n/11_25, /11_30, /11_35, /11_40, /11_45, /11_50, /11_55, /12_00, /12_05, /12_10, /12_15, /12_20, /12_25, /12_30, /12_35, /12_40, /12_45, /12_50, /12_55, /13_00, /13_05, /13_10, /13_15, /13_20, /13_25";
		user_cache.put(user_id, "lunch_alarm_ing", true);
	}
	if( user_cache.get(user_id, "lunch_alarm_ing") ) {
		
		if( _isHourMinuteRegExp(command) ) {
			reply_text = _toHourMinuteText(command) + "에 그날의 점심메뉴를 알려드릴게요.";
			user_cache.remove(user_id, "lunch_alarm_ing");
			user_cache.put(user_id, "lunch_alarm", true);
			user_cache.put(user_id, "lunch_alarm_time", command);
		}
	}
	if( command === '/dinner_alarm' || command.indexOf("저녁알림") > -1 ) {
		reply_text = "언제 알려드릴까요? 17시 50분부터 5분단위로 설정할 수 있어요.\n/17_50, /17_55, /18_00, /18_05, /18_10, /18_15, /18_20, /18_25, /18_30, /18_35, /18_40, /18_45, /18_50, /18_55";
		user_cache.put(user_id, "dinner_alarm_ing", true);
	}
	if( user_cache.get(user_id, "dinner_alarm_ing") ) {
		
		if( _isHourMinuteRegExp(command) ) {
			reply_text = _toHourMinuteText(command) + "에 그날의 저녁메뉴를 알려드릴게요.";
			user_cache.remove(user_id, "dinner_alarm_ing");
			user_cache.put(user_id, "dinner_alarm", true);
			user_cache.put(user_id, "dinner_alarm_time", command);
		}
	}
	if( command === '/stop_alarm' || command.indexOf("알림끝") > -1 ) {
		reply_text = "모든 알림을 그만 보내드려요.";
		user_cache.put(user_id, "lunch_alarm", false);
		user_cache.put(user_id, "dinner_alarm", false);
	}
	if( command === '/menu' || command.indexOf("메뉴") > -1 ) {
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
						return e.title_kor + " (" + e.corner + ")";
					}));
				}
				if( b2_foods.length > 0 ) {
					text_array.push("지하2층");
					text_array = text_array.concat(b2_foods.map(function(e) {
						return e.title_kor + " (" + e.corner + ")";
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

	if( command === '설정파일' ) {
		reply_text = user_cache.info(user_id);
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
