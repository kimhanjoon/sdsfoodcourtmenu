var fs = require('fs');
var readFileUtf8 = function(zonename, callback) {
    return fs.readFile('./jamsilmenu/' + zonename + '.html', 'utf8', callback);
};

var parser = require('./parser.js');
var async = require('async');
async.map(['ZONE01','ZONE02'], readFileUtf8, function(err, data){
    var menu1 = parser.parse(data[0]);
    var menu2 = parser.parse(data[1]);
    var menu3 = [
                           {floor: "b1-snapsnack", title_kor:"델라면", title_eng:"Del Ramen", price: 3800}
                           , {floor: "b1-snapsnack", title_kor:"떡라면", title_eng:"Ramen with Rice Cake", price: 4200}
                           , {floor: "b1-snapsnack", title_kor:"떡라면", title_eng:"Ramen with Rice Cake", price: 4200}
                           , {floor: "b1-snapsnack", title_kor:"떡라면", title_eng:"Ramen with Rice Cake", price: 4200}
                           , {floor: "b1-snapsnack", title_kor:"떡라면", title_eng:"Ramen with Rice Cake", price: 4200}
                           , {floor: "b1-snapsnack", title_kor:"떡라면", title_eng:"Ramen with Rice Cake", price: 4200}
                           , {floor: "b1-snapsnack", title_kor:"떡라면", title_eng:"Ramen with Rice Cake", price: 4200}
                           , {floor: "b1-snapsnack", title_kor:"떡라면", title_eng:"Ramen with Rice Cake", price: 4200}
                           , {floor: "b1-snapsnack", title_kor:"떡라면", title_eng:"Ramen with Rice Cake", price: 4200}
                           , {floor: "b1-snapsnack", title_kor:"떡라면", title_eng:"Ramen with Rice Cake", price: 4200}
                		];
                	    console.log(menu1.concat(menu2).concat(menu3));
    
    var option = {
    		foods: menu1.concat(menu2).concat(menu3)
//    		, production: argv.production
    		, language: 'en'
    };
    
    var html = parser.render(option);
    fs.writeFile('./public/jamsilmenu.html', html, 'utf8', function(){});

    var json = JSON.stringify(option.foods);
    fs.writeFile('./public/jamsilmenu.json', json, 'utf8', function(){});
    
});
