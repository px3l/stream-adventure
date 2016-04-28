var through2 = require("through2");

var upperCaseString = function(buffer, encoding, next){
	this.push(buffer.toString().toUpperCase());
	next();
}

process.stdin
	.pipe(through2(upperCaseString))
	.pipe(process.stdout)