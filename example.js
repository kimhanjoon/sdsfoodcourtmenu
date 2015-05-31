var fs = require('fs');
var readFileUtf8 = function(zonename, callback) {
    return fs.readFile('./jamsilmenu/' + zonename + '.html', 'utf8', callback);
};

var parser = require('./parser.js');
var async = require('async');
async.map(['ZONE01','ZONE02'], readFileUtf8, function(err, data){
    var menu1 = parser.parse(data[0]);
    var menu2 = parser.parse(data[1]);
    
    var menu = menu1.concat(menu2);
    console.log(menu);
    
    var html = parser.render(menu);
    fs.writeFile('./public/jamsilmenu.html', html, 'utf8', function(){});

    var json = JSON.stringify(menu);
    fs.writeFile('./public/jamsilmenu.json', json, 'utf8', function(){});
    
});
