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

var swig = require('swig');
var photo_email_template = swig.compileFile('./photo_email_template.html');

exports.sendNewPhotoUploaded = function(filename) {

	var html = photo_email_template({
		host: email_properties.host
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
