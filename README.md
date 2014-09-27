RWDPerf
=======

WIP; testing RWD Perf


Features
========
- Emulate mobile devices, desktop, tablets.
- Find unused/hidden elements
- Find unused images
- Calculate page weight
- Track requests 

## Sample
![Sample](https://raw.githubusercontent.com/lafikl/RWDPerf/master/screenshot.png)


Install
========
```
npm install rwdperf -g
```

Usage
========
First you need to start chrome with these flags (Mac)

```
sudo /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 ----disable-cache
```

then start another session and enter this command

```
rwdperf -l http://hirondelleusa.org/ --width 400 --height 300 -m true -d 2 -s 2 -u "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53"
```

## List of all options 

```
Usage: rwdperf [options]

Options:

  --help                         output usage information
  -V, --version                  output the version number
  -l, --link <val>               Link to be tested
  -p, --port [val]               set a port, defaults to 3000
  -m, --mobile                   Emulate mobile
  -e, --emulateViewport          Emulate viewport, defaults to true
  -d, --deviceScaleFactor [val]  Device scale factor, defaults to 1
  -s, --scale [val]              scale, defaults to 1
  -w, --width <val>              Viewport width
  -h, --height <val>             Viewport height
  -u, --userAgent <val>          Override user-agent
```


Roadmap
=======
- Find downscaled images
- unused CSS
- Test multiple urls
- Add pre-configured device metrics (e.g iPhone 6)
