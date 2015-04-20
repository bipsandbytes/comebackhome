/*globals util, templates*/

var apiURL = 'http://comebackhome.org/api/v1/person/';
var ipURL = 'https://freegeoip.net/json/';

var defaults = {
  maxResults: Math.floor(util.documentWidth()/400) * 2,
  limit: 50,
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
      var missing = util.shuffle(data.objects).slice(0, options.maxResults);
      $results.innerHTML = template(missing);
    });
  });

  util.trackUsage();
};

comebackhome.getData = getData;

util.ready(function() {
  comebackhome(document.body, {});
});
