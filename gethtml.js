var request = require('request');
//var request = request.defaults({'proxy':'http://70.10.15.10:8080'});

var async = require('async');
var fs = require('fs');

var parser = require('./parser.js');

var requestsdsfoodcourtmenu = function(zonename, callback) {
	return request("http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=" + zonename, function(error, response, body) {
	    return callback(error, body);
	});
};

async.map(['ZONE01','ZONE02'], requestsdsfoodcourtmenu, function(err, data){
	fs.writeFile('./example/ZONE01.html', data[0], 'utf8', function(){});
	fs.writeFile('./example/ZONE02.html', data[1], 'utf8', function(){});
	
    var menu1 = parser.parse(data[0]);
    var menu2 = parser.parse(data[1]);
    var html = parser.render(menu1.concat(menu2));
    fs.writeFile('./example/MENU.html', html, 'utf8', function(){});
});

