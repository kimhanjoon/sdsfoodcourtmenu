var async = require('async');
var fs = require('fs');

var parser = require('./parser.js');

var readFileUtf8 = function(zonename, callback) {
    return fs.readFile('./example/' + zonename + '.html', 'utf8', callback);
};

async.map(['ZONE01','ZONE02'], readFileUtf8, function(err, data){
    var menu1 = parser.parse(data[0]);
    var menu2 = parser.parse(data[1]);
    var html = parser.render(menu1.concat(menu2));
    fs.writeFile('./example/MENU.html', html, 'utf8', function(){});
});
