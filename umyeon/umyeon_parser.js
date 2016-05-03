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
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_04.gif" : "가츠엔",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_05.gif" : "싱푸차이나",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_08.gif" : "스냅스낵 착즙주스(T/O)",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_09.gif" : "스냅스낵 피크닉(T/O)",
	"/img/menu/seoulrnd/dayMenu/cafeteria_1_menu_healthy.gif" : "Take me Out 헬시팩",
	"/img/menu/seoulrnd/dayMenu/menu_b_brown.gif" : "브라운그릴",
	"/img/menu/seoulrnd/dayMenu/menu_b_dodam.gif" : "도담찌개",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_bibim.gif" : "헬스기빙 365비빔",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_juice.gif" : "TAKE ME OUT 착즙주스",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_korean.gif" : "아시안픽스",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_salad.gif" : "TAKE ME OUT 샐러드콤보",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_special.gif" : "헬스기빙365",
	"/img/menu/seoulrnd/dayMenu/menu_b_health_theme.gif" : "헬스기빙365 테마밥상",
	"/img/menu/seoulrnd/dayMenu/menu_b_singfu.gif" : "싱푸차이나",
	"/img/menu/seoulrnd/dayMenu/menu_b_snap.gif" : "스냅스낵",
	"/img/menu/seoulrnd/dayMenu/menu_b_snap_snack.gif" : "스냅스낵 T/O",
	"/img/menu/seoulrnd/dayMenu/menu_b_spring.gif" : "봄이온소반",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_bibim.gif" : "TAKE ME OUT 헬시팩",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_bread.gif" : "TAKE ME OUT 즉석빵",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_fruit.gif" : "TAKE ME OUT 과일",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_juice.gif" : "TAKE ME OUT 착즙",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_picnic.gif" : "TAKE ME OUT 피크닉",
	"/img/menu/seoulrnd/dayMenu/menu_b_to_sandwich.gif" : "TAKE ME OUT 샌드위치",
	"/img/menu/seoulrnd/dayMenu/menu_b_woori.gif" : "우리미각면",
};

var cheerio = require('cheerio');
exports.parse = function (html) {

    var $ = cheerio.load(html);
	var foods = $(".container_CafeA,.container_CafeB").map(function(i, e) {
		var $e = $(e);
		var txt = $e.find(".cafeA_txt,.cafeB_txt").text();

		return {
			time: mapperId2Time[$e.closest(".container").attr("id")],
			floor: mapperClass2Floor[$e.attr("class")],
			corner: mapperImgSrc2Corner[$e.find("img").attr("src")],
			title_kor: $e.find(".cafeA_tit,.cafeB_tit").text().trim(),
			description_kor: txt.replace(/[0-9]+Kcal/,"").trim().replace(/,$/,""),
			kcal: Number(txt.match(/[0-9]+Kcal/)[0].replace("Kcal",""))
		}

//		 // 초저열량 - 저열량 - 고열량 - 초고열량 구분
//        if( food.kcal <= 680 ) {
//        	food.very_low_cal = true;
//        }
//        else if( food.kcal <= 730 ) {
//        	food.low_cal = true;
//        }
//        if( food.kcal >= 930 ) {
//        	food.very_high_cal = true;
//        }
//        else if( food.kcal >= 880 ) {
//        	food.high_cal = true;
//        }
//
//		food.hasImg = false;
//		food.img_src = "/static/no_image_available.jpg";
//		;
	});
    return foods;
};