exports.toHex = function(str) {
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i).toString(16);
	}
	return hex;
};
exports.fromHex = function(hex) {
	var str = '';
	var i = 0;
	while( i < hex.length ) {
		if( hex.substr(i, 1) < 'A' ) {
			str += ''+String.fromCharCode(parseInt(hex.substr(i, 2), 16));
			i = i+2;
		}
		else {
			str += ''+String.fromCharCode(parseInt(hex.substr(i, 4), 16));
			i = i+4;
		}
	}
	return str;
};

exports.fromHexTo4Hex = function(hex) {
	return this.to4Hex(this.fromHex(hex));
};

exports.to4Hex = function(str) {
	var hex = '';
	for(var i=0;i<str.length;i++) {
		var tempHex = str.charCodeAt(i).toString(16);
		if( tempHex.length === 2 ) {
			hex += '00' + tempHex;
		}
		else if( tempHex.length === 3 ) {
			hex += '0' + tempHex;
		}
		else if( tempHex.length === 4 ) {
			hex += tempHex;
		}
	}
	return hex;
};
exports.from4Hex = function(hex) {
	var str = '';
	var i = 0;
	while( i < hex.length ) {
		str += ''+String.fromCharCode(parseInt(hex.substr(i, 4), 16));
		i = i+4;
	}
	return str;
};