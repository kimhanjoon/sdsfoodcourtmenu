var Handlebars = require('handlebars');
var fs = require('fs');
var main_template = Handlebars.compile(fs.readFileSync('./umyeon/umyeon_main_template.hbs').toString());
Handlebars.registerPartial('umyeon_menu', fs.readFileSync('./umyeon/umyeon_menu_template.hbs').toString());

var _ = require('underscore');

exports.render = function (option) {
//	console.log(option.foods);
//	console.log(_.groupBy(option.foods, "floor"));

    return main_template({
    	foods: _.groupBy(option.foods, "floor")
    	, googleAnalytics: option.production === true
    });
};