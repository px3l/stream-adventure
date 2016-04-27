var map = require("through2-map");

var upperCaseString = function(buffer){
	this.push(buffer.toString().toUpperCase())
}

process.stdin.pipe(map(upperCaseString)).pipe(process.stdout)