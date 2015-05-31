var argv = require('minimist')(process.argv.slice(2));

var request = require('request');

// --proxy http://70.10.15.10:8080
if( argv.proxy ) {
	console.log('using proxy : %s', argv.proxy);
	request = request.defaults({'proxy': argv.proxy});
}

var requestsdsfoodcourtmenu = function(zonename, callback) {
	return request("http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=" + zonename, function(error, response, body) {
	    return callback(error, body);
	});
};

var express = require('express');
var app = express();

app.get('/', function(req, res, next) {
	req.url = '/jamsil';
	next('route');
});

var async = require('async');
var parser = require('./parser.js');

app.get('/jamsil', function(req, res){

	async.map(['ZONE01','ZONE02'], requestsdsfoodcourtmenu, function(err, data){
	    var menu1 = parser.parse(data[0]);
	    var menu2 = parser.parse(data[1]);
	    
	    if( req.accepts('html') ) {
	    	res.write(parser.render(menu1.concat(menu2)));
	    }
	    else if( req.accepts('json') ) {
	    	res.write(JSON.stringify(menu1.concat(menu2)));
	    }
	    else {
	    	res.write(parser.render(menu1.concat(menu2)));
	    }
	    res.end();
	});
	
});

app.use('/static', express.static('public'));

//--port 80
var port = argv.port || 80;
var server = app.listen(port, function () {
	console.log('listening at %s port', port);
});