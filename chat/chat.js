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

    /* ── Demo users ─────────────────────────────────────── */
    var demoUsers = [
      { name: "Alex M.", email: "alex@demo.com", persona: "seller" },
      { name: "Sarah K.", email: "sarah@demo.com", persona: "builder" },
      { name: "Jordan T.", email: "jordan@demo.com", persona: "student" },
      { name: "Priya S.", email: "priya@demo.com", persona: "idea" }
    ];

    var demoSeeds = [
      {
        user: demoUsers[0],
        messages: [
          {
            from: "alex@demo.com",
            text: "Hey! I saw you were looking for stepper motors.",
            time: Date.now() - 3600000 * 3
          },
          {
            from: "me",
            text: "Yes! Do you have NEMA 17 in stock?",
            time: Date.now() - 3600000 * 2.5
          },
          {
            from: "alex@demo.com",
            text: "I've got a few — including the StepLine ones. Want me to list them?",
            time: Date.now() - 3600000 * 2
          },
          {
            from: "me",
            text: "That would be great, thanks Alex!",
            time: Date.now() - 3600000
          }
        ]
      },
      {
        user: demoUsers[1],
        messages: [
          {
            from: "sarah@demo.com",
            text: "Your drone frame design looks amazing.",
            time: Date.now() - 7200000 * 2
          },
          {
            from: "me",
            text: "Thanks! I'm using carbon fibre tubes for the arms.",
            time: Date.now() - 7200000 * 1.8
          },
          {
            from: "sarah@demo.com",
            text: "Nice choice. What ESCs are you running?",
            time: Date.now() - 7200000
          },
          {
            from: "me",
            text: "BLHeli_S 30A — solid so far.",
            time: Date.now() - 3600000 * 4
          },
          {
            from: "sarah@demo.com",
            text: "Perfect, those are reliable. Good luck with the build!",
            time: Date.now() - 3600000 * 2
          }
        ]
      },
      {
        user: demoUsers[2],
        messages: [
          {
            from: "jordan@demo.com",
            text: "Hi! I need help with my Arduino final project.",
            time: Date.now() - 86400000
          },
          {
            from: "me",
            text: "Sure, what's the project about?",
            time: Date.now() - 82800000
          },
          {
            from: "jordan@demo.com",
            text: "A temperature monitoring system with ESP32 and OLED display.",
            time: Date.now() - 79200000
          },
          {
            from: "me",
            text: "Sounds fun! DHT22 + SSD1306 should work well for that.",
            time: Date.now() - 75600000
          }
        ]
      },
      {
        user: demoUsers[3],
        messages: [
          {
            from: "priya@demo.com",
            text: "I have an idea for a smart garden system but need parts.",
            time: Date.now() - 86400000 * 2
          },
          {
            from: "me",
            text: "Interesting! What kind of sensors were you thinking?",
            time: Date.now() - 86400000 * 1.8
          },
          {
            from: "priya@demo.com",
            text: "Soil moisture, light level, and water flow. Maybe a relay for the pump too.",
            time: Date.now() - 86400000 * 1.5
          },
          {
            from: "me",
            text: "I can help source those. Let's put together a parts list.",
            time: Date.now() - 86400000 * 1.2
          },
          {
            from: "priya@demo.com",
            text: "That would be amazing, thank you! 🙌",
            time: Date.now() - 86400000
          }
        ]
      }
    ];
        function seedChats() {
      demoSeeds.forEach(function (seed) {
        var existing = TG.findChat(myEmail, seed.user.email);

        if (!existing) {
          TG.saveChat({
            id: "c" + Date.now() + Math.random().toString(36).slice(2, 6),
            participants: [myEmail, seed.user.email],
            messages: seed.messages,
            lastActivity: seed.messages[seed.messages.length - 1].time
          });
        }
      });

      demoUsers.forEach(function (u) {
        if (!TG.findUser(u.email)) {
          TG.registerUser({
            name: u.name,
            email: u.email,
            pass: "demo",
            persona: u.persona
          });
        }
      });
    }

    seedChats();

        function getOtherUser(chat) {
      var otherEmail = chat.participants.filter(function (e) {
        return e !== myEmail;
      })[0];

      var u = TG.findUser(otherEmail) ||
        demoUsers.filter(function (d) {
          return d.email === otherEmail;
        })[0];

      return u || {
        name: otherEmail,
        email: otherEmail,
        persona: "builder"
      };
    }

    function personaBadgeHTML(persona) {
      var p = TG.PERSONAS[persona];

      if (!p) return "";

      return '<span class="persona-badge" style="color:' +
        p.color +
        ';border-color:' +
        p.color +
        '33;background:' +
        p.color +
        '14;">' +
        p.label +
        '</span>';
    }

    function escHtml(s) {
      return $("<span>").text(s).html();
    }
        function renderList(filter) {
      var chats = TG.chats().filter(function (c) {
        return c.participants.indexOf(myEmail) > -1;
      });

      chats.sort(function (a, b) {
        return b.lastActivity - a.lastActivity;
      });

      if (filter) {
        var q = filter.toLowerCase();

        chats = chats.filter(function (c) {
          var u = getOtherUser(c);
          return u.name.toLowerCase().indexOf(q) > -1;
        });
      }

      $list.empty();

      if (!chats.length) {
        $list.html(
          '<div style="padding:32px 16px;text-align:center;color:var(--faint);font-size:.9rem;">' +
          'No conversations yet</div>'
        );
        return;
      }

      chats.forEach(function (chat) {
        var u = getOtherUser(chat);

        var last = chat.messages.length
          ? chat.messages[chat.messages.length - 1]
          : null;

        var preview = last
          ? (last.from === myEmail ? "You: " : "") + last.text
          : "";

        var isActive = chat.id === activeChatId;

        var $item = $(
          '<div class="chat-item' +
          (isActive ? " active" : "") +
          '" data-id="' +
          chat.id +
          '">' +

          TG.avatarHTML(u.name, 42, u.persona) +

          '<div class="chat-item-info">' +
            '<div class="chat-item-name">' +
              u.name +
            '</div>' +

            '<div class="chat-item-preview">' +
              escHtml(preview) +
            '</div>' +
          '</div>' +

          '<div class="chat-item-time">' +
            (last ? TG.timeAgo(last.time) : "") +
          '</div>' +

          '</div>'
        );

        $list.append($item);
      });
    }
        function renderList(filter) {
      var chats = TG.chats().filter(function (c) {
        return c.participants.indexOf(myEmail) > -1;
      });

      chats.sort(function (a, b) {
        return b.lastActivity - a.lastActivity;
      });

      if (filter) {
        var q = filter.toLowerCase();

        chats = chats.filter(function (c) {
          var u = getOtherUser(c);
          return u.name.toLowerCase().indexOf(q) > -1;
        });
      }

      $list.empty();

      if (!chats.length) {
        $list.html(
          '<div style="padding:32px 16px;text-align:center;color:var(--faint);font-size:.9rem;">' +
          'No conversations yet</div>'
        );
        return;
      }

      chats.forEach(function (chat) {
        var u = getOtherUser(chat);

        var last = chat.messages.length
          ? chat.messages[chat.messages.length - 1]
          : null;

        var preview = last
          ? (last.from === myEmail ? "You: " : "") + last.text
          : "";

        var isActive = chat.id === activeChatId;

        var $item = $(
          '<div class="chat-item' +
          (isActive ? " active" : "") +
          '" data-id="' +
          chat.id +
          '">' +

          TG.avatarHTML(u.name, 42, u.persona) +

          '<div class="chat-item-info">' +
            '<div class="chat-item-name">' +
              u.name +
            '</div>' +

            '<div class="chat-item-preview">' +
              escHtml(preview) +
            '</div>' +
          '</div>' +

          '<div class="chat-item-time">' +
            (last ? TG.timeAgo(last.time) : "") +
          '</div>' +

          '</div>'
        );

        $list.append($item);
      });
    }
        function renderMessages(chat) {
      $messages.empty();

      if (!chat || !chat.messages.length) {
        $messages.html(
          '<div class="chat-date-sep">' +
          'No messages yet — say hello!' +
          '</div>'
        );
        return;
      }

      var lastDate = "";

      chat.messages.forEach(function (msg) {
        var d = new Date(msg.time).toLocaleDateString();

        if (d !== lastDate) {
          $messages.append(
            '<div class="chat-date-sep">' +
            d +
            '</div>'
          );

          lastDate = d;
        }

        var isSent = msg.from === myEmail;

        var h =
          '<div class="chat-bubble ' +
          (isSent ? "sent" : "received") +
          '">' +

            '<div>' +
              escHtml(msg.text) +
            '</div>' +

            '<div class="chat-bubble-time">' +
              TG.timeAgo(msg.time) +
            '</div>' +

          '</div>';

        $messages.append(h);
      });

      scrollBottom();
    }

    function scrollBottom() {
      requestAnimationFrame(function () {
        $messages.scrollTop($messages[0].scrollHeight);
      });
    }

        function openChat(chatId) {
      activeChatId = chatId;

      var chats = TG.chats();
      var chat = null;

      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === chatId) {
          chat = chats[i];
          break;
        }
      }

      if (!chat) return;

      var u = getOtherUser(chat);

      $headerInfo.html(
        '<div class="chat-header-name">' +
          u.name +
          ' <span class="online-dot"></span>' +
        '</div>' +
        personaBadgeHTML(u.persona)
      );

      $empty.hide();
      $main.show();

      renderMessages(chat);
      renderList($search.val());

      $page
        .find(".chat-sidebar")
        .addClass("hidden-mobile");

      $main.addClass("visible-mobile");
    }
        function sendMessage() {
      var text = $.trim($input.val());

      if (!text || !activeChatId) return;

      TG.saveMessage(activeChatId, {
        from: myEmail,
        text: text
      });

      $input.val("");

      var chat = TG.chats().filter(function (c) {
        return c.id === activeChatId;
      })[0];

      renderMessages(chat);
      renderList($search.val());
    }
        function startNewChat(name) {
      name = $.trim(name);

      if (!name) {
        TG.toast("Please enter a name", "err");
        return;
      }

      var allUsers = TG.users();
      var target = null;

      for (var i = 0; i < allUsers.length; i++) {
        if (
          allUsers[i].name.toLowerCase() === name.toLowerCase()
        ) {
          target = allUsers[i];
          break;
        }
      }

      if (!target) {
        for (var j = 0; j < demoUsers.length; j++) {
          if (
            demoUsers[j].name
              .toLowerCase()
              .indexOf(name.toLowerCase()) > -1
          ) {
            target = demoUsers[j];
            break;
          }
        }
      }

      if (!target) {
        TG.toast("User not found: " + name, "err");
        return;
      }

      if (target.email === myEmail) {
        TG.toast("You can't chat with yourself", "err");
        return;
      }

      var existing = TG.findChat(myEmail, target.email);

      if (existing) {
        openChat(existing.id);
      } else {
        var chat = TG.saveChat({
          participants: [myEmail, target.email],
          messages: [],
          lastActivity: Date.now()
        });

        openChat(chat.id);
      }

      $startForm.removeClass("open");
      $("#newChatName").val("");

      TG.toast(
        "Chat started with " + target.name,
        "ok"
      );
    }

        /* ── Event listeners ────────────────────────────────── */

    // Click conversation
    $list.on("click", ".chat-item", function () {
      openChat($(this).data("id"));
    });

    // Send message
    $input.on("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    $("#chatSendBtn").on("click", sendMessage);

    // Search
    $search.on("input", function () {
      renderList($(this).val());
    });

    // New conversation toggle
    $("#chatNewBtn").on("click", function () {
      $startForm.toggleClass("open");

      if ($startForm.hasClass("open")) {
        $("#newChatName").focus();
      }
    });

    // New conversation submit
    $("#newChatSubmit").on("click", function () {
      startNewChat($("#newChatName").val());
    });

    $("#newChatName").on("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        startNewChat($(this).val());
      }
    });

    // Back button
    $("#chatBackBtn").on("click", function () {
      $page
        .find(".chat-sidebar")
        .removeClass("hidden-mobile");

      $main.removeClass("visible-mobile");
    });

    // Initial render
    renderList();

  });
})(jQuery);