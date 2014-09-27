RWDPerf
=======

WIP; testing RWD Perf


Features
========
- Simulate mobile devices, desktop, tablets.
- Find unused/hidden elements and highlight it
- Track requests 


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

For help enter 
```
rwdperf --help
```


Roadmap
=======
- Find downscaled images
- unused CSS
- Test multiple urls
- Add pre-configured device metrics (e.g iPhone 6)
