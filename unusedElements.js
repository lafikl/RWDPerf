function __gettHiddenElements(body) {
  var allHTMLStr = document.documentElement.outerHTML
  var elements = body.querySelectorAll('*')
  var unused = [] // {el:, images:}

  for (var i = 0; i < elements.length; i++) {
    (function(el) {
      if ( __isIgnored(el) ) {
        return
      }

      if ( el.offsetParent !== null ) {
        return
      }

      if ( window.getComputedStyle(el).display == "none") {
        unused.push(walk(el))
      }
    })(elements[i])
  }

  return JSON.stringify(unused)
}

function __isIgnored(el) {
  var _ignoredElements = [
    "script",
    "noscript",
    "template",
    "style",
    "link"
  ]
  if ( el.tagName.toLowerCase() == "input" &&  el.type == "hidden" )
    return true
  return ( _ignoredElements.indexOf(el.tagName.toLowerCase()) > -1 )
}

function walk(el) {
  var unused = {} // images [], el
  var images = []

  if ( el.tagName.toLowerCase() == "img" ) {
    unused.el = el.outerHTML
    unused.images = [el.src]

    return unused
  }

  var imgs = el.getElementsByTagName('img')
  for (var i = 0; i < imgs.length; i++) {
    images.push(imgs[i].src)
  }

  unused.el = el.outerHTML
  unused.images = images

  return unused
}

__gettHiddenElements(document.body)
