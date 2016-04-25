var map = require("through2-map");

function write(buffer, encoding, next){
	var string = this.push(buffer).toString()
	console.log(string)
	next()
}

function end(done){
	done()
}

var stream = map(write, end);



process.stdin.pipe(map).pipe(process.stdout)