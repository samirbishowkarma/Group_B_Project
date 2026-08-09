/* chat.js — Technologia Marketplace */
(function ($) {
  "use strict";

  $(function () {
    if (!$("#chatPage").length) return;

    var sess = TG.session();
    var $page = $("#chatPage");
    var $list = $("#chatList");
    var $main = $("#chatMain");
    var $messages = $("#chatMessages");
    var $input = $("#chatInput");
    var $headerInfo = $("#chatHeaderInfo");
    var $empty = $("#chatEmpty");
    var $authGate = $("#chatAuth");
    var $startForm = $("#chatStartForm");
    var $search = $("#chatSearch");
    var activeChatId = null;

    if (!sess) {
      $authGate.show();
      $page.find(".chat-layout").hide();
      return;
    }

    var myEmail = sess.email;
  });
})(jQuery);