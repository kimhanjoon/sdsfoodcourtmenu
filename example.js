var fs = require('fs');
var parser = require('./parser.js');

fs.readFile('./example/ZONE2.html', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(parser.parse(data));
});
