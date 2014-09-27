#!/usr/bin/env node

var cli = require('commander')
var colors = require('colors')

cli
  .version('0.0.0')
  .option('-l, --link <val>', 'Link to be tested')
  .option('-p, --port [val]', 'set a port, defaults to 3000', 3000)
  .option('-m, --mobile', 'Emulate mobile', false)
  .option('-e, --emulateViewport', 'Emulate viewport, defaults to true', true)
  .option('-d, --deviceScaleFactor [val]', 'Device scale factor, defaults to 1', 1)
  .option('-s, --scale [val]', 'scale, defaults to 1', 1)
  .option('-w, --width <val>', 'Viewport width')
  .option('-h, --height <val>', 'Viewport height')
  .option('-u, --userAgent <val>', 'Override user-agent')
  .parse(process.argv);

if ( !cli.link ) {
  console.log('you need to pass a url'.red)
  return
}


var Run = require('../index')
cli.cb = function(err, data) {
  if (err) {
    return console.log(String(err).red)
  }
  if ( cli.json ) return JSON.stringify(data)

  var server = require('../web')
  server(data, cli.port)
}
new Run(cli).init()
