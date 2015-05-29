var express = require('express');
var app = express();

var request = require('request');
//XXX 회사에서 테스트하려면 아래 주석 풀어서 proxy 설정해야함
var request = request.defaults({'proxy':'http://70.10.15.10:8080'});
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

app.use('/static', express.static('public'));




var server = app.listen(80, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});