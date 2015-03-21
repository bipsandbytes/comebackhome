;(function($, window, document, undefined) {
    $.fn.found = function(options) {
        var settings = $.extend({}, $.fn.found.defaults, options);
        this.append(settings.frame_template);
        $("#person_found_frame").click(function(){
            $("#person_found_panel").slideToggle();

        });
        return $('#missing_people').each(function() {
            var template = $.templates(settings.item_template);
            var el = this;
            geoip2.city(function(data) {
                var params = {
                    limit: settings.max_results,
                    location_city: data.city.names.en,
                    location_country: data.country.names.en,
                    format: 'json',
                };
                $.getJSON(settings.feed_url, params).done(function(data) {
                    var missing = _.shuffle(data.objects);
                    template.link(el, missing);
                });
            });
        });
    };
})(jQuery, window, document);

$.fn.found.frame_template = "\
    <div id='person_found_frame'>\
        <div id='person_found_title' class='pulsating'>404 PERSON NOT FOUND\
          <div id='person_found_desc'>Help find missing people in your area</div>\
        </div>\
        <div id='person_found_panel'>\
            <h1>Help find missing people in your area</h1>\
            <ul class='polaroids '>\
                <div id='missing_people'></div>\
            </ul>\
        </div>\
    </div>\
";

$.fn.found.item_template = "\
    <li>\
      <a href='{{:url}}' title='{{:name}}' target='_blank'>\
          <img src='{{:thumbnail_url}}' alt='{{:name}}'>\
      </a>\
    </li>\
";

$.fn.found.defaults = {
  max_results: 10,
  frame_template: $.fn.found.frame_template,
  item_template: $.fn.found.item_template,
  feed_url: "http://52.0.62.66:8000/api/v1/person/",
};
