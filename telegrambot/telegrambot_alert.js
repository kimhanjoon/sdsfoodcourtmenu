var schedule = require('node-schedule');

var telegram = require('telegram-bot-api');

var daagalertbot = new telegram({
        token: '194386775:AAEiDXO_4ctkMLe1zWywZZ42Ypjd6BHa058'
});
// 5분전
// 3분전
// 1분전
// 정각
var j = schedule.scheduleJob('10 * * * * *', function(){
  console.log('it is 10 seconds');
  

  daagalertbot.getMe()
  .then(function(data) {
      console.log(data);
  })
  .catch(function(err) {
      console.log(err);
  });
});