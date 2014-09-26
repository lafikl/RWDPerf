var events = require('events')
var util = require('util')

function Plan(planned) {
  this._planned = planned || 0
  events.EventEmitter.call(this)
}
util.inherits(Plan, events.EventEmitter)

Plan.prototype.inc = function(times) {
  times = times || 1
  this._planned += times
}

Plan.prototype.done = function(label, arg) {
  if ( this._planned == 0 ) return
  this._planned--
  this.emit('done::' + label, arg)
  if ( this._planned === 0 ) this.emit('done')
}

module.exports = Plan