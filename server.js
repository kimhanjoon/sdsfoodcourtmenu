var http = require('http');

var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type' : 'text/html' });
    
    console.log(req.url);
    if( req.url !== '/' ) {
    	res.end();
    	return;
    }

    res.write("foods");
    res.end();
	return ;
});

server.listen(8000);
