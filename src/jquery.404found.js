/*globals $, templates*/
var apiURL = 'http://52.0.62.66:8000/api/v1/person/';

var defaults = {
  maxResults: 10,
};

var selector = function(name) {
  return '[data-js~="' + name + '"]';
};

var getData = function(options) {
  options = $.extend({format: 'json'}, defaults, options);
  return $.getJSON(apiURL, options);
};

$.found = function(target, options) {
  options = $.extend({}, defaults, options);
  var $target = target instanceof $ ? target : $(target);
  $target.append(templates.body());

  var $frame = $target.find(selector('404found-frame'));
  var $panel = $target.find(selector('404found-panel'));
  var $results = $target.find(selector('404found-results'));

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
