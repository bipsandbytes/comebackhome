;(function($, window, document, undefined) {
    $.fn.found = function(options) {
        var settings = $.extend({}, $.fn.found.defaults, options);
        this.append(settings.frame_template);
        $("#person_found_frame").click(function(){
            $("#person_found_panel").slideToggle();

        });
        return $('#missing_people').each(function() {
            var template = $.templates(settings.item_template);
            var country = "en_US";
            var el = this;
            $.fn.found.fetch_feed(country, settings.max_results, function(data) {
              template.link(el, data);
            });
        });
    };
})(jQuery, window, document);

$.fn.found.fetch_feed = function(country, max_results, success) {
    var feed = "https://query.yahooapis.com/v1/public/yql?format=json&q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww.missingkids.com%2Fmissingkids%2Fservlet%2FXmlServlet%3Fact%3Drss%26" + "LanguageCountry%3D" + country + "%26orgPrefix%3DNCMC%26" + "%22";
    $.get(feed, $.proxy(function(data) {
        var missing = data.query.results.rss.channel.item;
        missing = _.filter(missing, function(m) { return m.enclosure; });
        missing = _.map(missing, function(m) {
            m.title = m.title.replace(/^(.*?): /, "");
            m.title = m.title.replace(/ \(.*?\)$/, "");
            m.title = m.title.toLowerCase();
            m.name = m.title;
            m.img_url = m.enclosure.url.replace(/t.jpg/, ".jpg");
            return m;
        });

        // randomize list each time
        missing = _.shuffle(missing);
        missing = missing.slice(0, max_results);

        success(missing);
    }, this));
};

$.fn.found.frame_template = "\
    <div id='person_found_frame'>\
        <div id='person_found_title'>404 PERSON NOT FOUND\
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
      <a href='{{:link}}' title='{{:name}}' target='_blank'>\
          <img src='{{:img_url}}' alt='{{:name}}'>\
      </a>\
    </li>\
";

$.fn.found.defaults = {
  max_results: 10,
  frame_template: $.fn.found.frame_template,
  item_template: $.fn.found.item_template,
  fetch_feed: $.fn.found.fetch_feed
};
