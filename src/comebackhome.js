/*globals util, templates*/

var API_URL = 'https://comebackhome.org/api/v1/person/';
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

var getData = function(options) {
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

    var $frame = document.getElementById('comebackhome-container');
    var $panel = document.getElementById('comebackhome-panel');
    var $title = document.getElementById('comebackhome-title');
    var $results = document.getElementById('comebackhome-results');

    $results.style.width = containerWidth + 'px';
    util.addEvent($frame, 'click', function() {
      util.toggleClass($panel, 'comebackhome-show');
      util.toggleClass($title, 'comebackhome-title-throb');
    });

  };

  var showResults = function(location) {
    var params = {
      format: 'json',
      lat: Math.round(location.latitude),
      lon: Math.round(location.longitude),
      limit: options.limit || rows * columns
    };
    getData(params).success(function(data) {
      // shuffle the results around to randomize the results
      render(util.shuffle(data.objects));
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
