var async = require('async');
var fs = require('fs');
var _ = require('underscore');

var parser = require('./parser.js');

var readFileUtf8 = function(filename, callback) {
    return fs.readFile(filename, 'utf8', callback);
};

async.map(['./example/ZONE1.html','./example/ZONE2.html'], readFileUtf8, function(err, data){
    // results is now an array of stats for each file
    var menu1 = parser.parse(data[0]);
    var menu2 = parser.parse(data[1]);
    var menu = _.uniq(menu1.concat(menu2), function(element) {
        return element.title_kor;
    });
    var html = parser.render(menu);
    fs.writeFile('./example/MENU.html', html, 'utf8', function(){});
});
