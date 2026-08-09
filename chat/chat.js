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