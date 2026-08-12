/* Chat page - works with the current root-level base.js without changing it. */
(function ($) {
  "use strict";

  var TG = window.TG = window.TG || {};
  var CHAT_KEY = "tg_chats";
  var USER_KEY = "tg_users";

  var PERSONAS = TG.PERSONAS || {
    seller: { label: "Seller", color: "#ff7a45" },
    builder: { label: "Builder", color: "#2dd4ff" },
    idea: { label: "Idea person", color: "#8b5cff" },
    student: { label: "Student", color: "#22f5c8" }
  };
  TG.PERSONAS = PERSONAS;

  function read(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      if (typeof TG.toast === "function") TG.toast("Your browser could not save this change", "err");
      return false;
    }
  }

  function currentSession() {
    if (typeof TG.currentUser === "function") return TG.currentUser();
    try {
      return JSON.parse(localStorage.getItem("tg_session")) ||
        JSON.parse(sessionStorage.getItem("tg_session"));
    } catch (error) {
      return null;
    }
  }

  function users() {
    return read(USER_KEY, []);
  }

  function chats() {
    return read(CHAT_KEY, []);
  }

  function saveChats(items) {
    return write(CHAT_KEY, items);
  }

  function findChat(firstEmail, secondEmail) {
    return chats().filter(function (chat) {
      return chat.participants.indexOf(firstEmail) > -1 &&
        chat.participants.indexOf(secondEmail) > -1;
    })[0] || null;
  }

  function saveChat(chat) {
    var items = chats();
    if (!chat.id) chat.id = "c" + Date.now() + Math.random().toString(36).slice(2, 6);
    if (!chat.messages) chat.messages = [];
    if (!chat.lastActivity) chat.lastActivity = Date.now();
    items.unshift(chat);
    return saveChats(items) ? chat : null;
  }

  function saveMessage(chatId, message) {
    var items = chats();
    var saved = null;
    items.forEach(function (chat) {
      if (chat.id !== chatId) return;
      message.id = message.id || "m" + Date.now() + Math.random().toString(36).slice(2, 5);
      message.time = message.time || Date.now();
      chat.messages = chat.messages || [];
      chat.messages.push(message);
      chat.lastActivity = message.time;
      saved = message;
    });
    return saveChats(items) ? saved : null;
  }

  function timeAgo(timestamp) {
    var seconds = Math.max(0, Math.floor((Date.now() - Number(timestamp || 0)) / 1000));
    if (seconds < 60) return "just now";
    var minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + "m ago";
    var hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + "h ago";
    var days = Math.floor(hours / 24);
    if (days < 7) return days + "d ago";
    return new Date(timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  function esc(value) {
    return $("<span>").text(value == null ? "" : String(value)).html();
  }

  function avatarHTML(name, size, persona) {
    var safeName = String(name || "?");
    var colour = (PERSONAS[persona] || PERSONAS.builder).color;
    return '<span class="tg-avatar" title="' + esc(safeName) + '" style="width:' + size +
      'px;height:' + size + 'px;background:' + colour + ';">' + esc(safeName.charAt(0).toUpperCase()) + '</span>';
  }

  $(function () {
    if (!$("#chatPage").length) return;

    var session = currentSession();
    var $page = $("#chatPage");
    var $list = $("#chatList");
    var $main = $("#chatMain");
    var $messages = $("#chatMessages");
    var $input = $("#chatInput");
    var $empty = $("#chatEmpty");
    var $startForm = $("#chatStartForm");
    var $search = $("#chatSearch");
    var activeChatId = null;

    var demoUsers = [
      { name: "Alex M.", email: "alex@demo.com", persona: "seller" },
      { name: "Sarah K.", email: "sarah@demo.com", persona: "builder" },
      { name: "Jordan T.", email: "jordan@demo.com", persona: "student" },
      { name: "Priya S.", email: "priya@demo.com", persona: "idea" }
    ];

    if (!session || !session.email) {
      $("#chatAuth").css("display", "flex");
      $page.find(".chat-layout").hide();
      return;
    }

    var myEmail = String(session.email).toLowerCase();

    function knownUsers() {
      var combined = users().concat(demoUsers);
      var unique = {};
      combined.forEach(function (user) {
        if (user && user.email) unique[String(user.email).toLowerCase()] = user;
      });
      return Object.keys(unique).map(function (email) { return unique[email]; });
    }

    function findUser(email) {
      var wanted = String(email || "").toLowerCase();
      return knownUsers().filter(function (user) {
        return String(user.email || "").toLowerCase() === wanted;
      })[0] || null;
    }

    function getOtherUser(chat) {
      var otherEmail = chat.participants.filter(function (email) {
        return String(email).toLowerCase() !== myEmail;
      })[0];
      return findUser(otherEmail) || { name: otherEmail, email: otherEmail, persona: "builder" };
    }

    function seedChats() {
      if (chats().some(function (chat) { return chat.participants.indexOf(myEmail) > -1; })) return;
      var now = Date.now();
      [
        [demoUsers[0], "Hi, let me know if you need details about any of my parts."],
        [demoUsers[1], "I liked your robotics project. What are you building next?"]
      ].forEach(function (seed, index) {
        saveChat({
          participants: [myEmail, seed[0].email],
          messages: [{ from: seed[0].email, text: seed[1], time: now - (index + 1) * 3600000 }],
          lastActivity: now - (index + 1) * 3600000
        });
      });
    }

    function personaBadge(persona) {
      var item = PERSONAS[persona] || PERSONAS.builder;
      return '<span class="persona-badge" style="color:' + item.color + ';border-color:' + item.color +
        '55;background:' + item.color + '18;">' + esc(item.label) + '</span>';
    }

    function renderList(filter) {
      var query = String(filter || "").toLowerCase();
      var items = chats().filter(function (chat) {
        return chat.participants.map(function (email) { return String(email).toLowerCase(); }).indexOf(myEmail) > -1;
      }).sort(function (a, b) {
        return Number(b.lastActivity || 0) - Number(a.lastActivity || 0);
      });

      if (query) {
        items = items.filter(function (chat) {
          return getOtherUser(chat).name.toLowerCase().indexOf(query) > -1;
        });
      }

      $list.empty();
      if (!items.length) {
        $list.html('<div class="chat-list-empty">No conversations found</div>');
        return;
      }

      items.forEach(function (chat) {
        var user = getOtherUser(chat);
        var messages = chat.messages || [];
        var last = messages.length ? messages[messages.length - 1] : null;
        var preview = last ? (last.from === myEmail ? "You: " : "") + last.text : "No messages yet";
        $list.append(
          '<button class="chat-item' + (chat.id === activeChatId ? ' active' : '') + '" type="button" data-id="' + esc(chat.id) + '">' +
            avatarHTML(user.name, 42, user.persona) +
            '<span class="chat-item-info"><span class="chat-item-name">' + esc(user.name) + '</span>' +
            '<span class="chat-item-preview">' + esc(preview) + '</span></span>' +
            '<span class="chat-item-time">' + (last ? timeAgo(last.time) : "") + '</span>' +
          '</button>'
        );
      });
    }

    function renderMessages(chat) {
      $messages.empty();
      if (!chat || !(chat.messages || []).length) {
        $messages.html('<div class="chat-date-sep">No messages yet - say hello!</div>');
        return;
      }
      var lastDate = "";
      chat.messages.forEach(function (message) {
        var date = new Date(message.time).toLocaleDateString("en-GB");
        if (date !== lastDate) {
          $messages.append('<div class="chat-date-sep">' + date + '</div>');
          lastDate = date;
        }
        var sent = String(message.from).toLowerCase() === myEmail;
        $messages.append('<div class="chat-bubble ' + (sent ? 'sent' : 'received') + '">' +
          '<div>' + esc(message.text) + '</div><div class="chat-bubble-time">' + timeAgo(message.time) + '</div></div>');
      });
      requestAnimationFrame(function () {
        $messages.scrollTop($messages[0].scrollHeight);
      });
    }

    function openChat(chatId) {
      var chat = chats().filter(function (item) { return item.id === chatId; })[0];
      if (!chat) return;
      activeChatId = chatId;
      var user = getOtherUser(chat);
      $("#chatHeaderInfo").html('<div class="chat-header-name">' + esc(user.name) +
        ' <span class="online-dot"></span></div>' + personaBadge(user.persona));
      $empty.hide();
      $main.css("display", "flex");
      renderMessages(chat);
      renderList($search.val());
      $page.find(".chat-sidebar").addClass("hidden-mobile");
      $main.addClass("visible-mobile");
    }

    function startChatWith(user) {
      var existing = findChat(myEmail, user.email);
      var chat = existing || saveChat({
        participants: [myEmail, user.email],
        messages: [],
        lastActivity: Date.now()
      });
      if (chat) openChat(chat.id);
      return chat;
    }

    function sendMessage() {
      var message = $.trim($input.val());
      if (!message || !activeChatId) return;
      if (!saveMessage(activeChatId, { from: myEmail, text: message })) return;
      $input.val("");
      var chat = chats().filter(function (item) { return item.id === activeChatId; })[0];
      renderMessages(chat);
      renderList($search.val());
    }

    function startNewChat(name) {
      var query = $.trim(name).toLowerCase();
      if (!query) { TG.toast("Please enter a name", "err"); return; }
      var target = knownUsers().filter(function (user) {
        return user.name.toLowerCase() === query || user.name.toLowerCase().indexOf(query) > -1;
      })[0];
      if (!target) { TG.toast("User not found: " + name, "err"); return; }
      if (String(target.email).toLowerCase() === myEmail) { TG.toast("You cannot chat with yourself", "err"); return; }
      startChatWith(target);
      $startForm.removeClass("open");
      $("#newChatName").val("");
    }

    function loadProductContext() {
      var productId = new URLSearchParams(window.location.search).get("product");
      if (!productId) return;
      var products = (typeof TG.catalog === "function" ? TG.catalog() : [])
        .concat(typeof TG.listings === "function" ? TG.listings() : []);
      var product = products.filter(function (item) { return String(item.id) === String(productId); })[0];
      var productName = product ? product.name : "product " + productId;
      $("#chatProductContext").removeAttr("hidden").html(
        '<span>Conversation about <strong>' + esc(productName) + '</strong></span>' +
        '<a href="product.html?id=' + encodeURIComponent(productId) + '">View product</a>'
      );
      startChatWith(demoUsers[0]);
      if (!$input.val()) $input.val("Hi, I am interested in " + productName + ". Is it still available?");
    }

    seedChats();
    renderList();
    loadProductContext();

    $list.on("click", ".chat-item", function () { openChat($(this).data("id")); });
    $("#chatSendBtn").on("click", sendMessage);
    $input.on("keydown", function (event) {
      if (event.key === "Enter") { event.preventDefault(); sendMessage(); }
    });
    $search.on("input", function () { renderList(this.value); });
    $("#chatNewBtn").on("click", function () {
      $startForm.toggleClass("open");
      if ($startForm.hasClass("open")) $("#newChatName").trigger("focus");
    });
    $("#newChatSubmit").on("click", function () { startNewChat($("#newChatName").val()); });
    $("#newChatName").on("keydown", function (event) {
      if (event.key === "Enter") { event.preventDefault(); startNewChat(this.value); }
    });
    $("#chatBackBtn").on("click", function () {
      $page.find(".chat-sidebar").removeClass("hidden-mobile");
      $main.removeClass("visible-mobile");
    });
  });
})(jQuery);
