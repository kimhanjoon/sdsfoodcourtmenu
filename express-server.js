require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

var argv = require('minimist')(process.argv.slice(2));

var request = require('request');

// --proxy http://ipaddress:port
if( argv.proxy ) {
	console.log('using proxy : %s', argv.proxy);
	request = request.defaults({'proxy': argv.proxy});
}

var requestsdsfoodcourtmenu = function(zonename, callback) {
	return request("http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list?zoneId=" + zonename, function(error, response, body) {
	    return callback(error, body);
	});
};

if( argv.examplefile ) {

	var fs = require('fs');
	requestsdsfoodcourtmenu = function(zonename, callback) {
		return fs.readFile('./jamsilmenu/' + zonename + '.html', 'utf8', callback);
	};
}

var express = require('express');
var app = express();

// 예전 주소로 접속한 경우 새 주소로 리다이렉트 시킨다.
app.all('*', function(req, res, next){
	var requesthost = req.get('host');
	if( requesthost && requesthost.indexOf("kr.pe") > -1 ) {
		console.info("kr.pe requested.")
		res.redirect(301, 'http://daag.pe.kr/?redirect=true');
		res.end();
		return;
	}
	if( req.query.redirect ) {
		req.url = '/';
	}

	next();
});

app.get('/', function(req, res, next) {
	req.url = '/jamsil';
	next('route');
});

var parser = require('./parser.js');
var menu_snapsnack = require('./jamsilmenu/menu_snapsnack.json');
var menu_takeout = require('./jamsilmenu/menu_takeout.json');

var view = require('./view.js');

var async = require('async');
app.get('/jamsil', function(req, res){

	async.map(['ZONE01','ZONE02'], requestsdsfoodcourtmenu, function(err, data){
	    var menu1 = parser.parse(data[0]);
	    var menu2 = parser.parse(data[1]);
	    var menu3 = [];
	    if( data[0].indexOf("영업하지 않습니다") === -1 && (data[0].indexOf("점심") >= 0 || data[0].indexOf("저녁") >= 0) ) {
	    	menu3 = menu_snapsnack;
	    }
	    var menu4 = [];
	    if( data[0].indexOf("영업하지 않습니다") === -1 && data[0].indexOf("점심") >= 0 ) {
	    	menu4 = menu_takeout;
	    }

    	// 운영환경일 때만 google analytics를 붙일 수 있도록 production 전달
	    var option = {
	    		foods: menu1.concat(menu2).concat(menu3).concat(menu4)
	    		, snapsnackCollapse: menu3.length > 1
	    		, takeoutCollapse: menu4.length > 1
	    		, production: argv.production
	    		, redirect: req.query.redirect === "true"
	    };
	    // 영어권 사용자는 바로 영어가 보이게끔 language 전달
	    var languages = req.acceptsLanguages();
	    if( languages && languages.length && languages.length > 0 && languages[0].indexOf("en") > -1 ) {
	    	option.english = true;
	    }

	    // html -> json 순서로 response content-type을 정한다.
	    if( req.accepts('html') ) {
	    	res.write(view.render(option));
	    }
	    else if( req.accepts('json') ) {
	    	res.write(JSON.stringify(option.foods));
	    }
	    else {
	    	res.write(view.render(option));
	    }
	    res.end();
	});

});

var iconv = require('iconv-lite');
//iconv.extendNodeEncodings();

var umyeon_parser = require('./umyeon/umyeon_parser.js');
var umyeon_viewer = require('./umyeon/umyeon_viewer.js');
app.get('/umyeon', function(req, res){
	request({uri: "http://welstory.com/menu/seoulrnd/menu.jsp", encoding: 'binary'}, function(error, response, body) {

		var utf8_body = iconv.decode(new Buffer(body, 'binary'), 'utf-8')

		console.log(utf8_body);
	    var option = {
    		foods: umyeon_parser.parse(utf8_body)
    		, production: argv.production
	    };

	    // html -> json 순서로 response content-type을 정한다.
	    if( req.accepts('html') ) {
	    	res.write(umyeon_viewer.render(option));
	    }
	    else if( req.accepts('json') ) {
	    	res.write(JSON.stringify(option.foods));
	    }
	    else {
	    	res.write(umyeon_viewer.render(option));
	    }
	    res.end();
	});
});

var photo_management = require("./photo_management.js");
app.post('/uploadphoto', photo_management.getUploadFn(), function(req, res, next) {
	photo_management.makePhoto(req.file.filename);
	res.end();
});

app.get('/registerphoto', function(req, res, next) {
	var msg = photo_management.registerPhoto(req.query.filename);
	res.end(msg);
});
app.get('/rejectphoto', function(req, res, next) {
	var msg = photo_management.rejectPhoto(req.query.filename);
	res.end(msg);
});

app.use('/uploadphoto', express.static('uploadphoto'));
app.use('/static', express.static('public'));
app.use('/image', express.static('image'));
app.use('/photo', express.static('photo'));

//--port 80
var port = argv.port || 80;
var server = app.listen(port, function () {
	console.log('listening at %s port', port);
});