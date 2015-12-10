var fs = require('fs');
var readFileUtf8 = function(zonename, callback) {
    return fs.readFile('./jamsilmenu/' + zonename + '.html', 'utf8', callback);
};

var parser = require('./parser.js');
var menu_snapsnack = require('./jamsilmenu/menu_snapsnack.json');
var async = require('async');
async.map(['ZONE01','ZONE02'], readFileUtf8, function(err, data){
    var menu1 = parser.parse(data[0]);
    var menu2 = parser.parse(data[1]);
    var menu3 = [];
    if( data[0].indexOf("점심") >= 0 ) {
    	menu3 = menu_snapsnack;
    }
    
    var option = {
    		foods: menu1.concat(menu2).concat(menu3)
    		, snapsnackCollapse: menu3.length > 1
//    		, production: argv.production
    };
    
    var html = parser.render(option);
    fs.writeFile('./public/jamsilmenu.html', html, 'utf8', function(){});

    var json = JSON.stringify(option.foods);
    fs.writeFile('./public/jamsilmenu.json', json, 'utf8', function(){});
    
});
