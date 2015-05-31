var argv = require('minimist')(process.argv.slice(2));

var express = require('express');
var app = express();

var request = require('request');

// --proxy http://70.10.15.10:8080
if( argv.proxy ) {
	console.log('using proxy : %s', argv.proxy);
	request = request.defaults({'proxy': argv.proxy});
}
var async = require('async');
var parser = require('./parser.js');

var requestsdsfoodcourtmenu = function(zonename, callback) {
	return request("http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=" + zonename, function(error, response, body) {
	    return callback(error, body);
	});
};

app.get('/', function(req, res){

	async.map(['ZONE01','ZONE02'], requestsdsfoodcourtmenu, function(err, data){
	    var menu1 = parser.parse(data[0]);
	    var menu2 = parser.parse(data[1]);
	    var html = parser.render(menu1.concat(menu2));

	    res.write(html);
	    res.end();
	});
	
});

app.use('/static', express.static('public', {
	setHeaders: function(res, path, stat) {
		if( path.endsWith("json") ) {	//TODO json인 경우 넣게 한건데 전체적으로 어떻게 안될런지....
			res.set({
				'Content-Type' : 'application/json; charset=utf-8',
			});
		}
	}
}));

//--port 80
var port = argv.port || 80;
var server = app.listen(port, function () {
	console.log('listening at %s port', port);
});