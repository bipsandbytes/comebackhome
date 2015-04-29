/*globals util, templates*/

var API_URL = 'http://comebackhome.org/api/v1/person/';
var IPLOOKUP_URL = 'https://ifreegeoip.net/json/';
// default to San Francisco
var DEFAULT_LOCATION = {
  latitude: 37.7833,
  longitude: 122.4167
};

var itemWidth = 310;
var itemHeight = 180;

var getData = function(options) {
  return util.getJSON(API_URL, util.extend({}, options));
};

var getUserLocation = util.getJSON.bind(util, IPLOOKUP_URL);

var called = false;
var comebackhome = function($target, options) {
  if (called) return;

  called = true;

  var viewport = util.getViewport();
  var constrain = function(value) {
    return Math.max(Math.floor(value), 1);
  };
  var columns = constrain(viewport.width / itemWidth);
  var rows = constrain(viewport.height / 2 / itemHeight);
  var containerWidth = columns * itemWidth;

  var defaults = {
    limit: rows * columns
  };

  var element = document.createElement('div');
  element.innerHTML = templates.body();
  $target.appendChild(element);

  var $frame = document.getElementById('comebackhome-container');
  var $panel = document.getElementById('comebackhome-panel');
  var $title = document.getElementById('comebackhome-title');
  var $results = document.getElementById('comebackhome-results');
  $results.style.width = containerWidth + 'px';

  var template = templates.items;
  var showResults = function(location) {
    options = util.extend({
      lat: Math.round(location.latitude),
      lon: Math.round(location.longitude)
    }, defaults, options);
    getData(options).success(function(data) {
      // shuffle the results around to randomize the results
      var missing = util.shuffle(data.objects);
      $results.innerHTML = template(missing);
      util.addEvent($frame, 'click', function() {
        util.toggleClass($panel, 'comebackhome-show');
        util.toggleClass($title, 'comebackhome-title-throb');
      });
    });
  };
  getUserLocation().success(showResults(location)).error(showResults(DEFAULT_LOCATION));

  util.trackUsage();
};

comebackhome.getData = getData;

util.ready(function() {
  comebackhome(document.body, {});
});
