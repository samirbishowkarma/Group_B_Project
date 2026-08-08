
(function ($) {
  "use strict";
  $(function () {
    if (!$('#profileHeader').length) return;

    $('#profileHeader').html(
      '<div class="profile-avatar">A</div>' +
      '<h1 class="profile-name">Alex Maker</h1>' +
      '<div class="profile-persona"><span class="dot" style="background: var(--ok)"></span> Verified Seller</div>' +
      '<p class="profile-bio">Hardware builder with a passion for robotics, sensing systems, and sustainable maker gear. Browse listings, projects and community feedback.</p>' +
      '<div class="profile-actions"><a class="btn btn-primary" href="sell.html">List item</a><a class="btn btn-ghost" href="chat.html">Message</a></div>'
    );

  });
})(jQuery);
