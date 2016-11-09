let request = require('request')

let req = request.post('http://localhost:8099')

process.stdin.pipe(req.pipe(process.stdout))