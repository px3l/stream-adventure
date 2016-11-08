let fs = require('fs')
let filePath = process.argv[2]

let file = fs.createReadStream(filePath)

file.pipe(process.stdout)
