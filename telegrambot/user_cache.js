require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

var cache_map = {};
var cache_list = [];

var fs = require('fs');
var jsonfile = require('jsonfile');
var _ = require('underscore');

exports.init = function() {
	cache_list = jsonfile.readFileSync("./telegrambot_user.json");
	cache_map = _.object(_.pluck(cache_list, "chat_id"), cache_list);
	console.info("user cache initialized : ", cache_list.length);
};

exports.write = function() {

	jsonfile.writeFile("./telegrambot_user.json", cache_list, function (err) {
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

exports.each = function(callback) {

	var key_lists = _.keys(cache_map);

	_.each(key_lists, function(e) {
		callback(cache_map[e]);
	});
};