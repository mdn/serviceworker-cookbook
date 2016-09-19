'use strict';

function resizeIframe(iframe) {
  var documentElement = iframe.contentWindow.document.documentElement;
  var height = documentElement.getClientRects()[0].height;
  iframe.style.height = height + 'px';
}

(function() {

  document.getElementById('navToggle').addEventListener('click', function() {
    var book = document.querySelector('.book');
    localStorage.setItem('hideNav', 1-Number(book.classList.toggle('with-nav')));
  });

  // This is a hacky way to highlight the current active tab. This should
  // probably be done in the template generation, but this is way easier.
  var pathname = window.location.pathname;
  var file = pathname.substr(pathname.lastIndexOf('/') + 1);
  var navItem = document.querySelector('.nav-top .item a[href="' + file + '"]');
  if (navItem) {
    navItem.classList.add('active');
  }

  var mainNavItem = document.querySelector('nav a[href^="' + (file.split('_')[0] || 'index.html') + '"]');
  if (mainNavItem) {
    mainNavItem.classList.add('active');
  }

})();

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.book').classList.toggle(
    'with-nav',
    1-Number(localStorage.getItem('hideNav'))
  );
});

// Marking as loaded triggers tabzilla fade-in
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});

// Demos that dynamically make the page grow require extra effort in sizing the iframe
// These demos should trigger a custom event on the parent:
// if (window.parent !== window) { window.parent.document.body.dispatchEvent(new CustomEvent('iframeresize')); }
(function(iframe)  {
  var callback = function () {
    resizeIframe(iframe);
  };

  if(iframe) {
    document.body.addEventListener('iframeresize', callback);
    iframe.addEventListener('load', callback);
  }
})(document.querySelector('iframe'));

// Launch demos in new window when image is clicked
(function(launchIcon) {
  if(launchIcon) {
      launchIcon.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(launchIcon.getAttribute('data-href'));
      });
  }
})(document.querySelector('.demo-launch'));
