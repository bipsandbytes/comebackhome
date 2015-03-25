// Shameless copied from https://github.com/substack/insert-css
var elem = document.createElement('style');
elem.setAttribute('type', 'text/css');

var css = '<%= contents %>';
if ('textContent' in elem) {
  elem.textContent = css;
} else {
  elem.styleSheet.cssText = css;
}

var head = document.getElementsByTagName('head')[0];
head.appendChild(elem);
