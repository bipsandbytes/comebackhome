/*globals $, templates*/
var apiURL = 'http://52.0.62.66:8000/api/v1/person/';

var defaults = {
  limit: 6
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
  var $target = target instanceof $ ? target : $(target);
  $target.append(templates.body());

  var $frame = $target.find('.comebackhome-container');
  var $panel = $target.find('.comebackhome-panel');
  var $results = $target.find('.comebackhome-results');

  $frame.click(function(){
    $panel.slideToggle();
  });

  var template = templates.items;
  // TODO: get a larger number of results, and then select a few
  // TODO: so that you get a different set each time
  getUserLocation().done(function(location) {
      options.location_city = location.city;
      options.location_country = location.country_name;
      getData(options).done(function(data) {
        // shuffle the results around to randomize the results
        var missing = shuffle(data.objects);
        $results.html(template(missing));
      });
  });
};

$.found.getData = getData;

$(function() {
  $.found($('body'), {});  // TODO: do not call if already invoked by library user
});
