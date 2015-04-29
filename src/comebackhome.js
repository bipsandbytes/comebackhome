/*globals util, templates*/

var apiURL = 'http://comebackhome.org/api/v1/person/';
var ipURL = 'https://ifreegeoip.net/json/';
var DEFAULT_LOCATION = {
    city: "San Francisco",
    country_code: "US",
    country_name: "United States",
    ip: "50.203.185.210",
    latitude: 37.7833,
    longitude: 122.4167,
    metro_code: 415,
    region_code: "CA",
    region_name: "California",
    time_zone: "America/Los_Angeles",
    zip_code: "94107",
};

var itemWidth = 310;
var itemHeight = 180;

var getData = function(options) {
  return util.getJSON(apiURL, util.extend({}, options));
};

var getUserLocation = util.getJSON.bind(util, ipURL);

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
