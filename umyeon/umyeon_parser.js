require("console-stamp")(console, { pattern : "yyyy-mm-dd HH:MM:ss" } );

var mapperId2Time = {
	"layer1" : "breakfast",
	"layer2" : "lunch",
	"layer3" : "dinner",
};
var mapperClass2Floor = {
	"container_CafeA" : "cafeteria1",
	"container_CafeB" : "cafeteria2",
};
var mapperImgSrc2Corner = {
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_01.gif" : "봄이온소반",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_02.gif" : "도담찌개",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_03.gif" : "테이스티가든",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_04.gif" : "가츠&엔",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_05.gif" : "XingFu China",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_08.gif" : "Snapsnack", //"스냅스낵 착즙주스(T/O)",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_09.gif" : "Snapsnack", //"스냅스낵 피크닉(T/O)",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_healthy.gif" : "Take me Out", //"Take me Out 헬시팩",
	"/img/menu/seoulrnd/dayMenu/menu_b_brown.gif" : "BROWN GRILL",
	"/img/menu/seoulrnd/dayMenu/menu_b_dodam.gif" : "도담찌개",
	"/img/menu/seoulrnd/dayMenu/menu_b_gats.gif" : "가츠&엔",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_bibim.gif" : "Health Giving 365", //"헬스기빙 365비빔",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_juice.gif" : "Take me Out", //"TAKE ME OUT 착즙주스",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_korean.gif" : "asian*picks",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_salad.gif" : "Take me Out", //"TAKE ME OUT 샐러드콤보",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_special.gif" : "Health Giving 365", //"헬스기빙365",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_theme.gif" : "Health Giving 365", //"헬스기빙365 테마밥상",
	"/img/menu/seoulrnd/dayMenu/menu_b_singfu.gif" : "XingFu China",
	"/img/menu/seoulrnd/dayMenu/menu_b_snap.gif" : "Snapsnack", //"스냅스낵",
	"/img/menu/seoulrnd/dayMenu/menu_b_snap_snack.gif" : "Snapsnack", //"스냅스낵 T/O",
	"/img/menu/seoulrnd/dayMenu/menu_b_spring.gif" : "봄이온소반",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_bibim.gif" : "Take me Out", //"TAKE ME OUT 헬시팩",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_bread.gif" : "Take me Out", //"TAKE ME OUT 즉석빵",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_fruit.gif" : "Take me Out", //"TAKE ME OUT 과일",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_juice.gif" : "Take me Out", //"TAKE ME OUT 착즙",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_picnic.gif" : "Take me Out", //"TAKE ME OUT 피크닉",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_sandwich.gif" : "Take me Out", //"TAKE ME OUT 샌드위치",
	"/img/menu/seoulrnd/dayMenu/menu_b_woori.gif" : "우리味각면",
};

var cheerio = require('cheerio');
exports.parse = function (html) {

    var $ = cheerio.load(html);
	var foods = $(".container_CafeA,.container_CafeB").map(function(i, e) {
		var $e = $(e);

		// 메뉴명 : [선택식], (계육:국내산) 등 제거
		var title = $e.find(".cafeA_tit,.cafeB_tit").text().trim();
		title = title.replace("[선택식]", "").replace(/\(.*:.*\)/, "");

		var txt = $e.find(".cafeA_txt,.cafeB_txt").text();

		return {
			time: mapperId2Time[$e.closest(".container").attr("id")],
			floor: mapperClass2Floor[$e.attr("class")],
			corner: mapperImgSrc2Corner[$e.find("img").attr("src")],
			title_kor: title,
			description_kor: txt.replace(/[0-9]+Kcal/,"").trim().replace(/,$/,""),
			kcal: Number(txt.match(/[0-9]+Kcal/)[0].replace("Kcal",""))
		}
	})
	// 추가정보 및 이미지 캐쉬
    .each(function(index, food) {

    	// 초저열량 - 저열량 - 고열량 - 초고열량 구분
    	if( food.kcal <= 680 ) {
    		food.very_low_cal = true;
    	}
    	else if( food.kcal <= 730 ) {
    		food.low_cal = true;
    	}
    	if( food.kcal >= 930 ) {
    		food.very_high_cal = true;
    	}
    	else if( food.kcal >= 880 ) {
    		food.high_cal = true;
    	}
    });

    return foods;
};