var async = require('async');
var fs = require('fs');
var parser = require('./parser.js');

var readFileUtf8 = function(filename, callback) {
    return fs.readFile(filename, 'utf8', callback);
};

async.map(['./example/ZONE1.html','./example/ZONE2.html'], readFileUtf8, function(err, data){
    // results is now an array of stats for each file
    console.log(data.length);
    console.log(data[0].length);
    var menu1 = parser.parse(data[0]);
    console.log(menu1.concat);
    var menu2 = parser.parse(data[1]);
//    console.log(menu2);
    console.log(parser.render(menu1.concat(menu2)));
});
