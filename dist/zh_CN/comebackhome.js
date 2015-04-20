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
  return {
    success: function(callback) {
      methods.success = callback;
      return methods;
    },
    error: function(callback) {
      methods.error = callback;
      return methods;
    }
  };
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
    var googleAnalyticsScript = document.createElement('script');
    googleAnalyticsScript.type = 'text/javascript';
    googleAnalyticsScript.text = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','http://www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-61554464-1', 'auto'); ga('send', 'pageview');";
    document.getElementsByTagName('head')[0].appendChild(googleAnalyticsScript);
};

/*globals util, templates*/

var apiURL = 'http://comebackhome.org/api/v1/person/';
var ipURL = 'https://freegeoip.net/json/';

var defaults = {
  limit: 6
};

var getData = function(options) {
  return util.getJSON(apiURL, util.extend({}, defaults, options));
};

var getUserLocation = util.getJSON.bind(util, ipURL);

var called = false;
var comebackhome = function($target, options) {
  if (called) return;

  called = true;
  var element = document.createElement('div');
  element.innerHTML = templates.body();
  $target.appendChild(element);

  var $frame = document.getElementById('comebackhome-container');
  var $panel = document.getElementById('comebackhome-panel');
  var $title = document.getElementById('comebackhome-title');
  var $results = document.getElementById('comebackhome-results');

  util.addEvent($frame, 'click', function() {
    util.toggleClass($panel, 'comebackhome-show');
    util.toggleClass($title, 'comebackhome-title-throb');
  });

  var template = templates.items;
  getUserLocation().success(function(location) {
    options = util.extend({
      lat: Math.round(location.latitude),
      lon: Math.round(location.longitude)
    }, defaults, options);
    getData(options).success(function(data) {
      // shuffle the results around to randomize the results
      var missing = util.shuffle(data.objects);
      $results.innerHTML = template(missing);
    });
  });

  util.trackUsage();
};

comebackhome.getData = getData;

util.ready(function() {
  comebackhome(document.body, {});
});

var templates = {};templates["body"] = function anonymous(data
/**/) {
var out='<div id="comebackhome-container"> <div class="comebackhome-header"> <div class="comebackhome-pulluptab">▲ 帮助寻找失踪的人</div> <div id="comebackhome-title" class="comebackhome-title comebackhome-title-throb">404 沒有找到人</div> </div> <div id="comebackhome-panel"> <ul id="comebackhome-results"></ul> <p class="comebackhome-poweredby"> 由<a target="_blank" href="http://comebackhome.org/">comebackhome.org</a>提供支持 </p> </div></div>';return out;
};
templates["items"] = function anonymous(data
/**/) {
var out='';var arr1=data;if(arr1){var item,i1=-1,l1=arr1.length-1;while(i1<l1){item=arr1[i1+=1];out+='<li class="comebackhome-person-frame"> <a href="'+( item.url)+'" target="_blank"> <div class="comebackhome-person-column"> <img class="comebackhome-person-picture" src="http://res.cloudinary.com/comebackhome/image/fetch/w_150,h_150,c_fill,f_auto,g_face:center,e_grayscale/'+( item.thumbnail_url )+'" alt='+( item.name )+'> </div> <div class="comebackhome-person-column comebackhome-person-info"> <div class="comebackhome-person-name">'+( item.display_name )+'</div> <div class="comebackhome-person-location">'+( item.display_location )+'</div> <div class="comebackhome-person-extra"> 自'+( new Date(item.since).toLocaleDateString() )+'以来失踪 ';if(item.age_now){out+=' <br> 现在的年龄: '+( item.age_now )+'岁 ';}out+=' </div> </div> </a></li>';} } return out;
};
return comebackhome;
}));
