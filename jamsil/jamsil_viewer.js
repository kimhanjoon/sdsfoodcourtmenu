var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var _ = require('underscore');

var main_template = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'jamsil_main_template.hbs')).toString());
Handlebars.registerPartial('jamsil_menu', fs.readFileSync(path.join(__dirname, 'jamsil_menu_template.hbs')).toString());

exports.render = function (option) {

	// 층별로 나눠서 표시하기 위해 미리 나눔
	var foods = _.chain(option.foods)
		.groupBy("floor")
		.value();

    return main_template({
    	foods: foods
    	, isClosed: option.foods.length === 0
    	, googleAnalytics: option.production === true
    });
};