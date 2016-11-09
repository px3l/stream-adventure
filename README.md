# stream-adventure Course Answers

## This repo contains the answers for the stream-adventure course. Each program is named as each task. See below for the instructions:

#### BEEP BOOP

Just to make sure everything is working, just write a `program.js` that outputs the string "beep boop" with a `console.log()`.

#### MEET PIPE

You will get a file as the first argument to your program (process.argv[2]). Use `fs.createReadStream()` to pipe the given file to `process.stdout`.

`fs.createReadStream()` takes a file as an argument and returns a readable stream that you can call `.pipe()` on. Here's a readable stream that pipes its data to `process.stderr`:

    var fs = require('fs');
    fs.createReadStream('data.txt').pipe(process.stderr);

Your program is basically the same idea, but instead of `'data.txt'`, the filename comes from `process.argv[2]` and you should pipe to stdout, not stderr.

#### INPUT OUTPUT

Take data from `process.stdin` and pipe it to `process.stdout`. With `.pipe()`. `process.stdin.pipe()` to be exact.

#### TRANSFORM

Convert data from `process.stdin` to upper-case data on `process.stdout` using the `through2` module.

To get the `through2` module you'll need to do:

    npm install through2

A transform stream takes input data and applies an operation to the data to
produce the output data.

Create a through stream with a `write` and `end` function:

    var through = require('through2');
    var stream = through(write, end);

The `write` function is called for every buffer of available input:

    function write (buffer, encoding, next) {
        // ...
    }

and the `end` function is called when there is no more data:

    function end () {
        // ...
    }

Inside the write function, call `this.push()` to produce output data and call
`next()` when you're ready to receive the next chunk:

    function write (buffer, encoding, next) {
        this.push('I got some data: ' + buffer + '\n');
        next();
    }

and call `done()` to finish the output:

    function end (done) {
        done();
    }

`write` and `end` are both optional. If `write` is not specified, the default implementation passes the input data to the output unmodified. If `end` is not specified, the default implementation calls `this.push(null)` to close the output side when the input side ends.

Make sure to pipe `process.stdin` into your transform stream and pipe your transform stream into `process.stdout`, like this:

    process.stdin.pipe(tr).pipe(process.stdout);

To convert a buffer to a string, call `buffer.toString()`.

#### LINES

Instead of transforming every line as in the previous "TRANSFORM" example, for this challenge, convert even-numbered lines to upper-case and odd-numbered
lines to lower-case. Consider the first line to be odd-numbered. For example given this input:

    One
    Two
    Three
    Four

Your program should output:

    one
    TWO
    three
    FOUR

You can use the `split` module to split input by newlines. For example:

    var split = require('split');
    process.stdin
        .pipe(split())
        .pipe(through2(function (line, _, next) {
            console.dir(line.toString());
            next();
        }))
    ;

`split` will buffer chunks on newlines before you get them. In the previous example, we will get separate events for each line even though all the data
probably arrives on the same chunk:

    $ echo -e 'one\ntwo\nthree' | node split.js
    'one'
    'two'
    'three'

Your own program should use `split` in this way, but you should transform the input and pipe the output through to `process.stdout`.

Make sure to `npm install split through2` in the directory where your solution file lives.

#### CONCAT

You will be given text on process.stdin. Buffer the text and reverse it using the `concat-stream` module before writing it to stdout.

`concat-stream` is a write stream that you can pass a callback to get the complete contents of a stream as a single buffer. Here's an example that uses concat to buffer POST content in order to JSON.parse() the submitted data:

    var concat = require('concat-stream');
    var http = require('http');
    
    var server = http.createServer(function (req, res) {
        if (req.method === 'POST') {
            req.pipe(concat(function (body) {
                var obj = JSON.parse(body);
                res.end(Object.keys(obj).join('\n'));
            }));
        }
        else res.end();
    });
    server.listen(5000);

In your adventure you'll only need to buffer input with `concat()` from process.stdin.

Make sure to `npm install concat-stream` in the directory where your solution file is located.

#### HTTP SERVER

In this challenge, write an http server that uses a through stream to write back the request stream as upper-cased response data for POST requests.

Streams aren't just for text files and stdin/stdout. Did you know that http request and response objects from node core's `http.createServer()` handler are also streams?

For example, we can stream a file to the response object:

    var http = require('http');
    var fs = require('fs');
    var server = http.createServer(function (req, res) {
        fs.createReadStream('file.txt').pipe(res);
    });
    server.listen(process.argv[2]);

This is great because our server can respond immediately without buffering everything in memory first.

We can also stream a request to populate a file with data:

    var http = require('http');
    var fs = require('fs');
    var server = http.createServer(function (req, res) {
        if (req.method === 'POST') {
            req.pipe(fs.createWriteStream('post.txt'));
        }
        res.end('beep boop\n');
    });
    server.listen(process.argv[2]);

You can test this post server with curl:

    $ node server.js 8000 &
    $ echo hack the planet | curl -d@- http://localhost:8000
    beep boop
    $ cat post.txt
    hack the planet

Your http server should listen on the port given at process.argv[2] and convert the POST request written to it to upper-case using the same approach as the TRANSFORM example.

As a refresher, here's an example with the default through2 callbacks explicitly defined:

    var through = require('through2');
    process.stdin.pipe(through(write, end)).pipe(process.stdout);

    function write (buf, _, next) {
      this.push(buf);
      next();
    }
    function end (done) { done(); }

Do that, but send upper-case data in your http server in response to POST data.

#### HTTP CLIENT

Send an HTTP POST request to http://localhost:8099 and pipe process.stdin into it. Pipe the response stream to process.stdout. Here's an example of how to use the `request` module to send a GET request,
piping the result to stdout:

    var request = require('request');
    request('http://beep.boop:80/').pipe(process.stdout);

To make a POST request, just call `request.post()` instead of `request()`:

    var request = require('request');
    var r = request.post('http://beep.boop:80/');
    
The `r` object that you get back from `request.post()` is a readable+writable stream so you can pipe a readable stream into it (`src.pipe(r)`) and you can pipe it to a writable stream (`r.pipe(dst)`).

You can even chain both steps together: src.pipe(r).pipe(dst);

Hint: for your code, src will be process.stdin and dst will be process.stdout.

Make sure to `npm install request` in the directory where your solution file lives.

#### WEBSOCKETS

In this adventure, write some browser code that uses the websocket-stream module to print the string "hello\n".

Your solution file will be compiled with browserify and the verify script will prompt you to open `http://localhost:8099` in a browser to verify your solution.

To open a stream with websocket-stream on localhost:8099, just write:

    var ws = require('websocket-stream');
    var stream = ws('ws://localhost:8099');
   
Then write the string "hello\n" to the stream.

The readme for websocket-stream has more info if you're curious about how to write the server side code: https://github.com/maxogden/websocket-stream

Make sure to `npm install websocket-stream` in the directory where your solution file lives.
