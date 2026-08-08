
(function ($) {
  "use strict";

  window.TG = window.TG || {};

  TG.toast = function (message, status) {
    var host = document.querySelector('.toast-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toast-host';
      document.body.appendChild(host);
    }
  }
})(jQuery);
