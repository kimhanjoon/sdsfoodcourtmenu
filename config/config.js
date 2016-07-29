console.log('NODE_ENV is ' + process.env.NODE_ENV);

module.exports = require('./env/' + process.env.NODE_ENV + '.js');
