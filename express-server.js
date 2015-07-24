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

    	// 운영환경일 때만 google analytics를 붙일 수 있도록 production 전달
	    var option = {
	    		foods: menu1.concat(menu2)
	    		, production: argv.production
	    };
	    // 영어권 사용자는 바로 영어가 보이게끔 language 전달
	    var languages = req.acceptsLanguages();
	    if( languages && languages.length && languages.length > 0 && languages[0].indexOf("en") > -1 ) {
	    	option.english = true;
	    }

	    // html -> json 순서로 response content-type을 정한다.
	    if( req.accepts('html') ) {
	    	res.write(parser.render(option));
	    }
	    else if( req.accepts('json') ) {
	    	res.write(JSON.stringify(option.foods));
	    }
	    else {
	    	res.write(parser.render(option));
	    }
	    res.end();
	});
	
});

app.post('/uploadphoto', function(req, res){

	console.log(JSON.stringify(req.files));
	
	var serverPath = '/photo/' + req.files.userPhoto.name;

    require('fs').rename(
		req.files.userPhoto.path,
		'D:\dev\git\sdsfoodcourtmenu' + serverPath,
		function(error) {
			if(error) {
				res.send({
		        	error: 'Ah crap! Something bad happened'
				});
            	return;
            }
	
            res.send({
            	path: serverPath
            });
		}
    );
});

app.use('/static', express.static('public'));
app.use('/image', express.static('image'));

//--port 80
var port = argv.port || 80;
var server = app.listen(port, function () {
	console.log('listening at %s port', port);
});