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
  var templates = {};
  /*globals $, templates*/
var apiURL = 'http://52.0.62.66:8000/api/v1/person/';

var defaults = {
  limit: 10
};

var getData = function(options) {
  options = $.extend({format: 'json'}, defaults, options);
  return $.getJSON(apiURL, options);
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
  getData(options).done(function(data) {
    // shuffle the results around to randomize the results
    var missing = shuffle(data.objects);
    $results.html(template(missing));
  });
};

$.found.getData = getData;

templates["body"] = function anonymous(data
/**/) {
var out='<div class="comebackhome-container"> <div class="comebackhome-header"> <div class="comebackhome-pulluptab">^ Help find missing people</div> <div class="comebackhome-title">404 Person Not Found</div> </div> <div class="comebackhome-panel"> <ul class="comebackhome-results"></ul> </div></div>';return out;
};
templates["items"] = function anonymous(data
/**/) {
var out='';var arr1=data;if(arr1){var item,i1=-1,l1=arr1.length-1;while(i1<l1){item=arr1[i1+=1];out+='<li> <a href="'+( item.url)+'" target=\'__blank\'> <div class="comebackhome-person-frame"> <div class="comebackhome-person-col"> <img class="comebackhome-person-picture" src="http://res.cloudinary.com/comebackhome/image/fetch/w_150,h_150,c_fill,f_auto,g_face:center,e_grayscale/'+( item.thumbnail_url )+'" alt="'+( item.name )+'"> </div> <div class="comebackhome-person-col"> <div class="comebackhome-person-name">'+( item.name )+'</div> <div class="comebackhome-person-location">'+( item.city )+', '+( item.country )+'</div> <div class="comebackhome-person-extra"> Missing since '+( new Date(item.since).toDateString() )+'<br> Age now: 6 years<br> </div> </div> </div> </a></li>';} } return out;
};
  return $.found;
}));