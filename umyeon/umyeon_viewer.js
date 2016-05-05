var fs = require('fs');
var Handlebars = require('handlebars');
var _ = require('underscore');

var main_template = Handlebars.compile(fs.readFileSync('./umyeon/umyeon_main_template.hbs').toString());
Handlebars.registerPartial('umyeon_menu', fs.readFileSync('./umyeon/umyeon_menu_template.hbs').toString());

exports.render = function (option) {

	// 시간,분류별로 나눠서 표시하기 위해 미리 나눔
	var foods = _.chain(option.foods)
		.groupBy("time")
		.mapObject(function(e) {
			return _.groupBy(e, "floor");
		})
		.value();

    return main_template({
    	foods: foods
    	, isClosed: option.foods.length === 0
    	, googleAnalytics: option.production === true
    });
};