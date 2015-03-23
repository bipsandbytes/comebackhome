/*globals jQuery*/
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
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

var templates = {};
templates["body"] = function anonymous(data
/**/) {
var out='<div class="comebackhome-container"> <div class="comebackhome-header"> <div class="comebackhome-title">404 PERSON NOT FOUND</div> <div class="comebackhome-subheading">Help find missing people in your area</div> </div> <div class="comebackhome-panel"> <ul class="comebackhome-results"></ul> </div></div>';return out;
};
templates["items"] = function anonymous(data
/**/) {
var out='';var arr1=data;if(arr1){var item,i1=-1,l1=arr1.length-1;while(i1<l1){item=arr1[i1+=1];out+='<li class="comebackhome-person"> <a class="comebackhome-link" href=\''+( item.url )+'\' title=\''+( item.name )+'\' target=\'_blank\'> <div class="comebackhome-image" style="background-image:url('+( item.thumbnail_url )+');" alt=\''+( item.name )+'\'></div> <div class="comebackhome-name-container"> <span class="comebackhome-name">'+( item.name )+'</span> </div> </a></li>';} } return out;
};return $.found;

}));