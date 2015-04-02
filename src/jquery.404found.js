/*globals $, templates*/
var apiURL = 'http://comebackhome.org/api/v1/person/';

var defaults = {
  max_results: 6
};

var getData = function(options) {
  options = $.extend({format: 'json'}, defaults, options);
  return $.getJSON(apiURL, options);
};

var getUserLocation = function() {
  return $.getJSON('https://freegeoip.net/json/');
};

var shuffle = function(o) {
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

$.found = function(target, options) {
  options = $.extend({}, defaults, options);
  options.limit = Math.max(50, options.max_results);  // how many results to get
  var $target = target instanceof $ ? target : $(target);
  $target.append(templates.body());

  var $frame = $target.find('.comebackhome-container');
  var $panel = $target.find('.comebackhome-panel');
  var $results = $target.find('.comebackhome-results');

  $frame.click(function(){
    $panel.slideToggle();
  });

  var template = templates.items;
  getUserLocation().done(function(location) {
      options.location_city = location.city;
      options.location_country = location.country_name;
      getData(options).done(function(data) {
        // shuffle the results around to randomize the results
        var missing = shuffle(data.objects).slice(0, options.max_results);
        $results.html(template(missing));
      });
  });
};

$.found.getData = getData;

$(function() {
  $.found($('body'), {});  // TODO: do not call if already invoked by library user
});
