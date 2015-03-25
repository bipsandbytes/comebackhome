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
  <%= contents %>
  return $.found;
}));
