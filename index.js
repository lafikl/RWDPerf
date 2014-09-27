var Chrome = require('chrome-remote-interface')
var prettyBytes = require('pretty-bytes')
var evaluate = require('./helpers/evaluate.js')
var Plan = require('./helpers/plan')
var find = require('./helpers/find')

function Run(opts) {
  this.opts = opts
  this.p = new Plan(4)
  this.stats = {}
  this.stats.requests = []
  this.stats.network = {}
  this.stats.network.total = 0
  this.stats.network.typesUsage = {
    "Document": { count: 0, weight: 0},
    "Font": { count: 0, weight: 0},
    "Image": { count: 0, weight: 0},
    "Other": { count: 0, weight: 0},
    "Script": { count: 0, weight: 0},
    "Stylesheet": { count: 0, weight: 0},
    "WebSocket": { count: 0, weight: 0},
    "XHR": { count: 0, weight: 0}
  }
  this.stats.unused = {}
  // Find unused elements
  this.p.on("done::els", this._onElsDone.bind(this))
  // Count types usage and total page weight
  this.p.on('done::requests', this._onRequestsDone.bind(this))
  // all done
  this.p.on('done', this._onDone.bind(this))
}

Run.prototype.init = function() {
  var self = this
  Chrome(function (chrome) {
    self.chrome = chrome
    evaluate.setChrome(chrome)
    self.chrome.Page.enable()
    self.emulate()
  })
}

Run.prototype.emulate = function() {
  this.chrome.send('Page.setDeviceMetricsOverride', {
    mobile: this.opts.mobile,
    width: parseInt(this.opts.width),
    height: parseInt(this.opts.height),
    emulateViewport: this.opts.emulateViewport || true,
    fitWindow: true,
    deviceScaleFactor: parseInt(this.opts.deviceScaleFactor),
    scale: parseInt(this.opts.scale)
  }, this._handleEmulate.bind(this))
}

Run.prototype._handleEmulate = function(err) {
  if ( err ) {
    this.chrome.close()
    return this.opts.cb(new Error("Issue in emulate"))
  }
  var self = this
  this.chrome.Network.enable()
  if ( !this.opts.userAgent ) {
    this.chrome.Page.navigate({'url': this.opts.link})
    // Collect requests
    this.collectReqs()
  } else {
    this.setUa()
  }
  this._handleOnload()
}

Run.prototype.setUa = function() {
  var self = this
  this.chrome.send('Network.setUserAgentOverride', {
    'userAgent': this.opts.userAgent
  }, function(err) {
    if ( err ) {
      self.chrome.close()
      return self.opts.cb(new Error("Issue in overriding user-agent"))
    }

    self.chrome.Page.navigate({'url': self.opts.link})
    // Collect requests
    self.collectReqs()
  })
}

Run.prototype.collectReqs = function() {
  var self = this
  this.chrome.on('Network.responseReceived', function (req) {
    if ( req.response.url.substr(0, 6) == "chrome" ) return
      var contentLength = parseInt(req.response.headers['Content-Length']) || 0
      self.stats.requests.push(
        {
          url: req.response.url,
          type: req.type,
          contentLength: contentLength,
          humanWeight: prettyBytes(contentLength)
        }
      )
  })
}

Run.prototype._handleOnload = function() {
  var self = this
  this.chrome.on('Page.loadEventFired', function() {
    self.chrome.Runtime.enable()
    self.p.done('requests', self.stats.requests)
    // Collect unused elements
    evaluate.eval(__dirname + '/unusedElements.js', function(err, data) {
      if ( err ) {
        self.chrome.close()
        return self.opts.cb(new Error("Issue in finding unused elements."))
      }
      self.stats.unused.elements = JSON.parse(data.result.value)
      self.p.done("els", self.stats.unused.elements)
    })
  })
}

Run.prototype._onElsDone = function() {
  this.stats.unused.bytes = { total: 0, list: [] }
  var bytes = this.stats.unused.bytes
  var unusedEls = this.stats.unused.elements
  for (var i = 0; i < unusedEls.length; i++) {
    obj = find(unusedEls[i].images, this.stats.requests, "url")

    if ( obj ) {
       bytes.list.push(obj)
       bytes.total += parseInt(obj.contentLength)
       obj.humanWeight = prettyBytes(parseInt(obj.contentLength))
    }
  }
  bytes.humanWeight = prettyBytes(bytes.total)
  this.p.done()
}

Run.prototype._onRequestsDone = function(requests) {
  // aggregate network stats!
  for (var i = 0; i < requests.length; i++) {
    if ( requests[i].contentLength ) {
      this.stats.network.total += parseInt(requests[i].contentLength)
      this.stats.network.typesUsage[requests[i].type].weight += parseInt(requests[i].contentLength)
    }
    this.stats.network.typesUsage[requests[i].type].count++
  }
  this.stats.network.humanTotal = prettyBytes(this.stats.network.total)
  
  for (var k in this.stats.network.typesUsage) {
    var type = this.stats.network.typesUsage[k]
    type.humanWeight = prettyBytes(type.weight)
  }
  
  this.p.done()
}

Run.prototype._onDone = function() {
  this.chrome.close()
  this.opts.cb(false, this.stats)
}

module.exports = Run