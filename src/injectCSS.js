/*globals util*/
// Shameless copied from https://github.com/substack/insert-css
var elem = document.createElement('style');
elem.setAttribute('type', 'text/css');

var css = '<%= contents %>';

// use window width to center results
var width = Math.floor(util.documentWidth()/400)*400;
css = css.replace('comebackhome-results{', 'comebackhome-results{width:' + width + 'px;');

if ('textContent' in elem) {
  elem.textContent = css;
} else {
  elem.styleSheet.cssText = css;
}

var head = document.getElementsByTagName('head')[0];
head.appendChild(elem);
