module.exports = findInSecond

// loop array than find it in the hash by key
function findInSecond(first, second, key) {
  var obj
  for (var i = 0; i < second.length; i++) {
    if ( first.indexOf(second[i][key]) > -1 ) {
      obj = second[i]
    }
  }
  return obj
}
