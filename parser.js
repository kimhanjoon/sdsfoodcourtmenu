var cheerio = require('cheerio');

var mapperClassname2Cornername = {"DEPT001-group" : "KOREAN 1"
, "DEPT002-group" : "KOREAN 2"
, "DEPT003-group" : "탕맛기픈"
, "DEPT004-group" : "가츠엔"
, "DEPT005-group" : "WESTERN"
, "DEPT006-group" : "Snapsnack"
, "DEPT007-group" : "TAKEOUT"
, "DSDS011-group" : "KOREAN 1"
, "DSDS012-group" : "KOREAN 2"
, "DSDS013-group" : "Napolipoli"
, "DSDS014-group" : "asian*picks"
, "DSDS015-group" : "고슬고슬비빈"
, "DSDS016-group" : "Chef's Counter"
, "DSDS017-group" : "XingFu China"
, "DSDS018-group" : "우리미각면"};

exports.parse = function (html) {
    var $ = cheerio.load(html);
    var foods = $("tr").slice(1).map(function(index, element) {
        var $e = $(element);
        var food = {};
        food.title_kor = $e.find("span:nth-child(1)").text();
        food.title_eng = $e.find("span:nth-child(3)").text();
        food.kcal = Number($e.find("span:nth-child(5)").text().replace(" kcal", ""));
        food.soldout = $e.find("del").length > 0 ? true : false;
        if( !food.soldout ) {
            food.price = Number($e.find("span:nth-child(7)").text().replace("원", "").replace(",", "")) - 3000;
        }
        food.img_src = $e.find("img").attr('src');
        food.corner = mapperClassname2Cornername[$e.closest("div[class$=group]").attr("class")];
        return food;
    });
    return foods.get();
};

var swig  = require('swig');
var template = swig.compileFile('./template.html');
exports.render = function (foods) {
    return template({foods: foods});
}