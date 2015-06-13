module.exports = {
	generateUniqueId: function() {
		// Not technically unique but close enough for our purposes.
		return new Date().getTime().toString() + Math.floor(Math.random()*100).toString();
	},
	generateAccessCode: function(codeLength) {
		var code = "";
		for (var i=0; i<codeLength; i++) {
			code += this.getRandomDigit().toString();
		}
		return code;
	},
	getRandomDigit: function() {
		// Returns a digit from 0-9.
		return Math.floor(Math.random()*10);
	},
	validateCode: function(code, codeLength, acceptableChars) {
		if (!code) {
			return false;
		}
		if (code.toString().length !== codeLength) {
			return false;
		}
		for (var i in code) {
			var digit = code.toString()[i];
			if (acceptableChars.indexOf(digit) === -1) {
				return false;
			}
		}
		return true;
	}
};