var split = require("split");
var through2 = require("through2");

var makeAlternate = function(odd, even){
	var f = even;
	return function (buffer) {
	    f = (f === even) ? odd : even
	    f.call(this, buffer)
	}
}

var makeCase = function(buffer, encoding, next){
	if (even){
		this.push(buffer.toString().toUpperCase());
		next();
	} else {
		this.push(buffer.toString().toLowerCase());
		next();
	}
}

process.stdin
	.pipe(split())
	.pipe(through2(makeAlternative(
		makeCase()))
	.pipe(process.stdout)
