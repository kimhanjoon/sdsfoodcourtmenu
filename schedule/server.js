require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

var argv = require('minimist')(process.argv.slice(2));

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

var viewer = require('./viewer.js');

app.get('/jamsil', function(req, res){

	// 운영환경일 때만 google analytics를 붙일 수 있도록 production 전달
    var option = {
		today : new Date()
		, production: argv.production
		, redirect: req.query.redirect === "true"
    };

    // html -> json 순서로 response content-type을 정한다.
    if( req.accepts('html') ) {
    	res.write(viewer.renderHTML(option));
    }
    else if( req.accepts('json') ) {
    	res.write(viewer.renderJSON(option));
    }
    else {
    	res.write(viewer.renderHTML(option));
    }
    res.end();
});

var sendFileOptions = {
    root: __dirname,
};

app.get('/jamsil/parser', function(req, res){
	res.sendFile("parser.html", sendFileOptions);
});

var jsonfile = require('jsonfile');

app.post('/jamsil', function(req, res){

	console.log(req.body);

	jsonfile.writeFile("database/jamsil_", req.body, function (err) {
	    console.error(err);
	});
	res.end();
});

//--port 80
var port = argv.port || 80;
var server = app.listen(port, function () {
	console.log('listening at %s port', port);
});