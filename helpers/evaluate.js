var chrome
var fs = require('fs')

exports.eval = function(f, cb) {
  fs.readFile(f, function(err, f) {
    chrome.Runtime.evaluate({
      expression: f.toString()
    }, cb)
  })
}

exports.setChrome = function(ch) {
  chrome = ch
}