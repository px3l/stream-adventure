let through = require('through2')

let upperCaseString = function(buffer, encoding, next){
	this.push(buffer.toString().toUpperCase());
	next();
}

process.stdin
	.pipe(through(upperCaseString))
	.pipe(process.stdout)