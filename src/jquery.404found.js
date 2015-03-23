/*globals $, templates*/
var apiURL = 'http://52.0.62.66:8000/api/v1/person/';

var defaults = {
  limit: 10
};

var getData = function(options) {
  options = $.extend({format: 'json'}, defaults, options);
  return $.getJSON(apiURL, options);
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
  getData(options).done(function(data) {
    var missing = data.objects;
    $results.html(template(missing));
  });
};

$.found.getData = getData;
