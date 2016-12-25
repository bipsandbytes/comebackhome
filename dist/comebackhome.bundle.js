(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Comebackhome = factory();
  }
}(this, function() {
/*globals ActiveXObject*/
var util = {};

util.shuffle = function(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
  return o;
};

var slice = [].slice;
util.extend = function() {
  var i, l, key, arg;
  var args = slice.call(arguments);
  var result = args[0];
  for (i = 1, l = args.length; i < l; i++) {
    arg = args[i];
    for (key in arg) {
      if (arg.hasOwnProperty(key)) {
        result[key] = arg[key];
      }
    }
  }
  return result;
};

var parse = function(request) {
  var result;
  try {
    result = JSON.parse(request.responseText);
  } catch (e) {
    result = request.responseText;
  }
  return [result, request];
};

var encodeParams = function(data, bustCache) {
  var key,
    params = [];
  for (key in data) {
    if (data.hasOwnProperty(key)) {
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
  }
  if (bustCache) {
    params.push('_t=' + Date.now());
  }
  return params.join('&');
};

// Based on https://gist.github.com/yangsu/61b650af7b804bd9170b
util.getJSON = function(url, data) {
  var methods = {
    success: function() {},
    error: function() {}
  };
  var XHR = window.XMLHttpRequest || ActiveXObject;
  var request = new XHR('MSXML2.XMLHTTP.3.0');
  if (data) {
    url += '?' + encodeParams(data);
  }
  request.open('get', url, true);

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        methods.success.apply(methods, parse(request));
      } else {
        methods.error.apply(methods, parse(request));
      }
    }
  };
  request.send(data);
  var returnValue = {
    success: function(callback) {
      methods.success = callback;
      return returnValue;
    },
    error: function(callback) {
      methods.error = callback;
      return returnValue;
    }
  };

  return returnValue;
};

// Based on http://stackoverflow.com/questions/6348494/addeventlistener-vs-onclick
util.addEvent = function(element, event, funct) {
  if (element.attachEvent) {
    return element.attachEvent('on' + event, funct);
  } else {
    return element.addEventListener(event, funct, false);
  }
};

// Based on http://toddmotto.com/creating-jquery-style-functions-in-javascript-hasclass-addclass-removeclass-toggleclass/
function hasClass(element, className) {
  return new RegExp(' ' + className + ' ').test(' ' + element.className + ' ');
}

util.toggleClass = function(element, className) {
  var newClass = ' ' + element.className.replace(/[\t\r\n]/g, ' ') + ' ';
  if (hasClass(element, className)) {
    while (newClass.indexOf(' ' + className + ' ') >= 0) {
      newClass = newClass.replace(' ' + className + ' ', ' ');
    }
    element.className = newClass.replace(/^\s+|\s+$/g, '');
  } else {
    element.className += ' ' + className;
  }
};

// Bosed on https://github.com/dperini/ContentLoaded/blob/master/src/contentloaded.js
util.ready = function(fn) {

  var done = false,
    top = true,

    root = document.documentElement,
    modern = document.addEventListener,

    add = modern ? 'addEventListener' : 'attachEvent',
    remove = modern ? 'removeEventListener' : 'detachEvent',
    prefix = modern ? '' : 'on',

    init = function(e) {
      if (e.type == 'readystatechange' && document.readyState != 'complete') {
        return;
      }
      (e.type == 'load' ? window : document)[remove](prefix + e.type, init, false);
      if (!done && (done = true)) {
        fn.call(window, e.type || e);
      }
    },

    poll = function() {
      try {
        root.doScroll('left');
      } catch (e) {
        setTimeout(poll, 50); return;
      }
      init('poll');
    };

  if (document.readyState == 'complete') {
    fn.call(window, 'lazy');
  } else {
    if (!modern && root.doScroll) {
      try {
        top = !window.frameElement;
      } catch (e) {}
      if (top) poll();
    }
    document[add](prefix + 'DOMContentLoaded', init, false);
    document[add](prefix + 'readystatechange', init, false);
    window[add](prefix + 'load', init, false);
  }

};

util.trackUsage = function() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script',('https:' == document.location.protocol ? 'https://' : 'http://') +'www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-61554464-1', 'auto');
    ga('send', 'pageview');
};

// http://stackoverflow.com/questions/1766861/find-the-exact-height-and-width-of-the-viewport-in-a-cross-browser-way-no-proto
util.getViewport = function() {

  var viewPortWidth;
  var viewPortHeight;

  // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  if (typeof window.innerWidth != 'undefined') {
    viewPortWidth = window.innerWidth;
    viewPortHeight = window.innerHeight;
  }

  // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
  else if (typeof document.documentElement != 'undefined'
    && typeof document.documentElement.clientWidth !=
    'undefined' && document.documentElement.clientWidth !== 0) {
    viewPortWidth = document.documentElement.clientWidth;
    viewPortHeight = document.documentElement.clientHeight;
  }

  // older versions of IE
  else {
    viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
    viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
  }
  return {
    width: viewPortWidth,
    height: viewPortHeight,
  };
};

util.once = function(f) {
  var called = false;
  return function() {
    if (!called) {
      called = true;
      f.apply(this, arguments);
    }
  };
};

var templates = {};templates["body"] = function anonymous(data
/**/) {
var out='<div id="comebackhome-container"> <div id="comebackhome-header" class="comebackhome-header"> <div class="comebackhome-pulluptab">▲ Help find missing people</div> <div id="comebackhome-title" class="comebackhome-title comebackhome-title-throb">404 Person Not Found</div> </div> <div id="comebackhome-panel"> <ul id="comebackhome-results"> ';var arr1=data;if(arr1){var item,i1=-1,l1=arr1.length-1;while(i1<l1){item=arr1[i1+=1];out+=' <li class="comebackhome-person-frame"> <a onclick="ga(\'send\', \'event\', \'link\', \'click\', \'person\')" href="'+( item.url)+'" target="_blank"> <div class="comebackhome-person-column"> <img class="comebackhome-person-picture" src="https://res.cloudinary.com/comebackhome/image/fetch/w_150,h_150,c_fill,f_auto,g_face:center,e_grayscale/'+( item.thumbnail_url )+'" alt='+( item.display_name )+' > </div> <div class="comebackhome-person-column comebackhome-person-info"> <div class="comebackhome-person-name">'+( item.display_name )+'</div> <div class="comebackhome-person-location">'+( item.display_location )+'</div> <div class="comebackhome-person-extra"> Missing since '+( new Date(item.since).toLocaleDateString() )+' ';if(item.age_now){out+=' <br> Age now: '+( item.age_now )+' ';}out+=' </div> </div> </a> </li> ';} } out+=' </ul> <p class="comebackhome-poweredby"> Powered by <a target="_blank" href="https://comebackhome.org/">comebackhome.org</a> </p> </div></div>';return out;
};
// Shameless copied from https://github.com/substack/insert-css
var elem = document.createElement('style');
elem.setAttribute('type', 'text/css');

var css = '.comebackhome-header .comebackhome-title,.comebackhome-person-name{font-size:16px;line-height:19.2px}.comebackhome-header .comebackhome-subheading,.comebackhome-header .comebackhome-pulluptab,.comebackhome-person-location{font-size:14px;line-height:16.8px}#comebackhome-panel .comebackhome-poweredby,.comebackhome-person-extra{font-size:12px;line-height:14.399999999999999px}#comebackhome-container{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;width:100%;max-height:100%;position:fixed;bottom:0;left:0;background-color:#fff;z-index:100000}.comebackhome-header{padding:10px;color:#eee;background-color:#428bca;cursor:pointer;}.comebackhome-header .comebackhome-subheading{float:right}.comebackhome-header .comebackhome-pulluptab{position:absolute;top:-36px;color:#eee;background-color:#428bca;right:10px;border-radius:10px 10px 0 0;padding:10px}.comebackhome-header .comebackhome-title-throb{-webkit-animation:fade 3s infinite;-moz-animation:fade 3s infinite;-o-animation:fade 3s infinite;-ms-animation:fade 3s infinite;animation:fade 3s infinite}@-moz-keyframes fade{from{opacity:1;-ms-filter:none;filter:none}50%{opacity:.2;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";filter:alpha(opacity=20)}to{opacity:1;-ms-filter:none;filter:none}}@-webkit-keyframes fade{from{opacity:1;-ms-filter:none;filter:none}50%{opacity:.2;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";filter:alpha(opacity=20)}to{opacity:1;-ms-filter:none;filter:none}}@-o-keyframes fade{from{opacity:1;-ms-filter:none;filter:none}50%{opacity:.2;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";filter:alpha(opacity=20)}to{opacity:1;-ms-filter:none;filter:none}}@keyframes fade{from{opacity:1;-ms-filter:none;filter:none}50%{opacity:.2;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)";filter:alpha(opacity=20)}to{opacity:1;-ms-filter:none;filter:none}}#comebackhome-panel{display:none;padding-top:10px;}#comebackhome-panel .comebackhome-poweredby{float:right;padding-right:10px;}.comebackhome-show{display:block !important}#comebackhome-results{overflow:hidden;margin:0;padding-left:0;list-style-type:none;margin:0 auto}.comebackhome-person-frame{width:310px;height:150px;float:left;margin:10px 0}.comebackhome-person-name{margin-top:15%;color:#428bca;}.comebackhome-person-location{color:#666;}.comebackhome-person-extra{margin-top:15%;color:#999;}.comebackhome-person-picture{display:block;margin:0 auto;width:100%;max-width:150px;max-height:150px;border-radius:50%}.comebackhome-person-column{width:150px;margin-right:10px;position:relative;float:left;text-align:left;}.comebackhome-person-column:last-of-type{margin-right:0}';
if ('textContent' in elem) {
  elem.textContent = css;
} else {
  elem.styleSheet.cssText = css;
}

var head = document.getElementsByTagName('head')[0];
head.appendChild(elem);
/*globals util, templates*/

var USE_PREFETCHED_DATA = true;
var API_URL = 'https://comebackhome.org/api/v1/person/';
var S3_URL = 'https://s3-us-west-1.amazonaws.com/bipsandbytes-comebackhome/prefetched_data/';
var IPLOOKUP_URL = 'https://freegeoip.net/json/';
var DEFAULTS = {
  itemWidth: 310,
  itemHeight: 180,
  timeout: 2000,
  heightRatio: 0.5
};
// default to San Francisco
var DEFAULT_LOCATION = {
  latitude: 37.7833,
  longitude: -122.4167
};
var LAT_LON_GRANULARITY = 10;

var getData = function(options) {
  if (USE_PREFETCHED_DATA) {
    var S3_FILE = S3_URL + options.lat + '_' + options.lon + '.json';
    return util.getJSON(S3_FILE);
  }
  return util.getJSON(API_URL, util.extend({}, options));
};

var getUserLocation = function(callback, timeout) {
  var cb = util.once(callback);
  var cbDefaultLocation = cb.bind(this, DEFAULT_LOCATION);
  util.getJSON(IPLOOKUP_URL)
    .success(cb)
    .error(cbDefaultLocation);
  setTimeout(cbDefaultLocation, timeout || 0);
};

var constrain = function(value) {
  return Math.max(Math.floor(value), 1);
};

var comebackhome = util.once(function($target, options) {
  options = util.extend(DEFAULTS, options);

  var itemWidth = options.itemWidth;
  var itemHeight = options.itemHeight;

  var viewport = util.getViewport();
  var columns = constrain(viewport.width / itemWidth);
  var rows = constrain(viewport.height * options.heightRatio / itemHeight);
  var containerWidth = columns * itemWidth;

  var render = function(missing) {
    var element = document.createElement('div');
    element.innerHTML = templates.body(missing);
    $target.appendChild(element);

    var $header = document.getElementById('comebackhome-header');
    var $panel = document.getElementById('comebackhome-panel');
    var $title = document.getElementById('comebackhome-title');
    var $results = document.getElementById('comebackhome-results');

    $results.style.width = containerWidth + 'px';
    util.addEvent($header, 'click', function() {
      ga('send', 'event', 'link', 'click', 'panel');
      util.toggleClass($panel, 'comebackhome-show');
      util.toggleClass($title, 'comebackhome-title-throb');
    });

  };

  var showResults = function(location) {
    var params = {
      format: 'json',
      lat: Math.round(location.latitude / LAT_LON_GRANULARITY) * LAT_LON_GRANULARITY,
      lon: Math.round(location.longitude / LAT_LON_GRANULARITY) * LAT_LON_GRANULARITY,
      limit: options.limit || rows * columns
    };
    getData(params).success(function(data) {
      // shuffle the results around to randomize the results
      render(util.shuffle(data.objects.slice(0, params.limit)));
    });
  };

  getUserLocation(showResults, options.timeout);

  util.trackUsage();
});

comebackhome.getData = getData;

util.ready(function(status) {
  if (status != 'lazy') {
    comebackhome(document.body, {});
  }
});

return comebackhome;
}));
