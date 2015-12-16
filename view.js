var swig  = require('swig');
var template = swig.compileFile('./view_template.html');
exports.render = function (option) {
    return template({
    	foods: option.foods
    	, snapsnackCollapse: option.snapsnackCollapse
    	, takeoutCollapse: option.takeoutCollapse
    	, googleAnalytics: option.production === true
    	, englishLanguage: option.english === true
    	, redirect: option.redirect === true
    });
};