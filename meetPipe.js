var fs = require("fs");
var filePath = process.argv[2];

var file = fs.createReadStream(filePath)

file.pipe(process.stdout)
