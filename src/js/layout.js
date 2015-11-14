'use strict';

function resizeIframe(obj) {
  obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

(function() {

  document.getElementById('navToggle').addEventListener('click', function() {
    document.querySelector('.book').classList.toggle('with-nav');
  });

  // This is a hacky way to highlight the current active tab. This should
  // probably be done in the template generation, but this is way easier.
  var pathname = window.location.pathname;
  var file = pathname.substr(pathname.lastIndexOf('/') + 1);
  var navItem = document.querySelector('.nav-top .item a[href="' + file + '"]');
  if (navItem) {
    navItem.classList.add('active');
  }

})();
