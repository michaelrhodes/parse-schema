var writer = require('flush-write-stream')
var parser = require('./')

module.exports = stream

function stream (cb) {
  var parse = parser()
  var buffer = ''

  return writer(write, flush)

  function write (chunk, enc, next) {
    var chunk = buffer + chunk
    var n = chunk.lastIndexOf('\n')
    if (!~n) return buffer = chunk, next()
    parse(chunk.substr(0, n))
    buffer = chunk.substr(n + 1)
    next()
  }

  function flush (done) {
    cb(null, parse.output)
    done()
  }
}
