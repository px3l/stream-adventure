let split = require('split')
let through = require('through2')

function alternateFactory(opts){
	let counter = 0
	return function convertFn(string){
		counter++
		return counter % 2 == 0 ? 
			string.toUpperCase() :
			string.toLowerCase()
	}
}

const converter = alternateFactory()

process.stdin.pipe(split("\n")).pipe(through(function (buffer, encoding, next) {
  console.log(converter(buffer.toString()))
  next();
}))
    
