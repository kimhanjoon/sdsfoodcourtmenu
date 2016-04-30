require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

var cache_map = {};

var fs = require('fs');
var jsonfile = require('jsonfile')

exports.init = function() {
	cache_map = jsonfile.readFileSync("./telegrambot_user.json");
	console.info("user cache initialized : ", Object.keys(cache_map).length);
};

exports.write = function() {

	jsonfile.writeFile("./telegrambot_user.json", cache_map, function (err) {
    console.error(err)
  });
};

exports.put = function(user_id, key, value) {

	if( !cache_map[user_id] ) {
		cache_map[user_id] = {};
	}
	cache_map[user_id][key] = value;
	this.write();
};

exports.get = function(user_id, key) {

	if( cache_map[user_id] ) {
//		console.info('hit : ', user_id);
		if( key ) {
			return cache_map[user_id][key];
		}
		else {
			return cache_map[user_id];
		}
	}
	else {
//		console.info('miss : ', user_id);
		return null;
	}
};

exports.info = function(user_id) {
	return JSON.stringify(cache_map[user_id]);
};

exports.remove = function(user_id, key) {
	if( cache_map[user_id] ) {
		cache_map[user_id][key] = undefined;
	}
};

exports.print = function(user_id) {
	if( user_id ) {
		console.log(cache_map[user_id]);
	}
	else {
		console.log(cache_map);
	}
};