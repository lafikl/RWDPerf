var fs = require("fs")
var Handlebars = require("handlebars")
var http = require("http")
var Router = require("routes-router")
var st = require("st")
var colors = require("colors")

var router = Router()

Handlebars.registerHelper('json', JSON.stringify);

function serve(data, port) {
  console.log(("Server started, http://127.0.0.1:" + port).green)
  http.createServer(router).listen(port)

  /**
  * Root route
  **/
  router.addRoute("/", function(req, res, opts) {
    res.writeHead("Content-Type", "text/html")
    _template(data, function(html) {
      res.write(html)
      res.end()
    })
  })

  /**
  * Root route
  **/
  router.addRoute("/json", function(req, res, opts) {
    res.writeHead("Content-Type", "application/json")
    res.write(JSON.stringify(data))
    res.end()
  })

  /** 
  * Serve static files
  **/
  router.addRoute("/static/*", st({
    path: __dirname + "/static",
    url: "/static",
    dot: true,
    cache: false
  }))
}

function _template(data, cb) {
  fs.readFile(__dirname + '/templates/index.html', function(err, html) {
    if (err) return cb(err)
    var template = Handlebars.compile(html.toString())
    var compiled = template(data)
    cb(compiled)
  })
}

module.exports = serve
