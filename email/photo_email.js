var nodemailer = require('nodemailer');
var email_properties = require('./email_properties.json');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: email_properties.service,
    auth: {
        user: email_properties.from.email
        , pass: email_properties.from.password
    }
});

var Handlebars = require('handlebars');
var photo_email_template = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'photo_email_template.hbs')).toString());
var hex = require('./hex.js');

exports.sendNewPhotoUploaded = function(filename) {

	var html = photo_email_template({
		host: email_properties.host
		, food_id: filename.split("-")[0]
		, food_title: hex.from4Hex(filename.split("-")[0])
		, uploadtime: new Date(new Number(filename.split("-")[1].split("_")[0])).toLocaleString()
    	, filename: filename
    });

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    to: email_properties.to.email, // list of receivers
	    subject: 'New photo has uploaded.', // Subject line
	    html: html // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.error(error);
	    }
	    console.info('Message sent: ' + info.response);
	});
}
