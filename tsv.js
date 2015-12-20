var babyparse = require('babyparse');

var fs = require("fs");
fs.readFile('menu.tsv', 'utf8', function (err, data) {
  if (err) throw err;
  // console.log(data);

  var parsed = babyparse.parse(data);
  rows = parsed.data;

  console.log(parsed.data);
});
