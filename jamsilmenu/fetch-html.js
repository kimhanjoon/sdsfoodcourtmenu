var request = require('request');
//var request = request.defaults({'proxy':'http://70.10.15.10:8080'});

var fs = require('fs');

request("http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=ZONE01", function(error, response, body) {
	fs.writeFile('./ZONE01.html', body, 'utf8', function(){});
});

request("http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=ZONE02", function(error, response, body) {
	fs.writeFile('./ZONE02.html', body, 'utf8', function(){});
});

