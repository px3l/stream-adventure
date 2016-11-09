let http = require('http')
let through = require('through2')
let port = process.argv[2]

function upperCaser (buf, _, next){
	this.push(buf.toString().toUpperCase());
	next();
}

let httpServer = http.createServer(function(req, res){
	req.pipe(through(upperCaser)).pipe(res)
})

httpServer.listen(port)