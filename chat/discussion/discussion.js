/* discussions.js — Technologia Discussions Page */
(function ($) {
  "use strict";

  var CATS = ["All", "Help", "Projects", "Show & Tell", "Parts", "Collaboration", "Education"];
  var catClass = function (c) { return c.replace(/[& ]+/g, "-"); };

  function seedThreads() {
    if (TG.threads().length) return;
    var now = Date.now();
    var demos = [
      { title: "How to control a NEMA 17 stepper with Arduino?", category: "Help", tags: ["arduino", "stepper", "NEMA 17"], author: "Alex M.", authorEmail: "alex@demo.com", persona: "seller", content: "I\'m trying to drive a NEMA 17 stepper motor using an Arduino Uno and an A4988 driver. The motor just vibrates but doesn\'t turn. I\'ve checked the wiring against the datasheet and adjusted the current limiter pot on the driver. Has anyone dealt with this? Any tips on microstepping settings would also be appreciated.", upvotes: 7, time: now - 3600000 * 3, replies: [
        { author: "Jordan T.", authorEmail: "jordan@demo.com", persona: "student", content: "Make sure you\'re using a 12V power supply — the USB 5V isn\'t enough for a NEMA 17. Also double-check that the STEP and DIR pins are on PWM-capable pins (or just any digital pin works actually). The vibration usually means the current is too low or the steps are coming too fast.", upvotes: 4, time: now - 3600000 * 2 },
        { author: "Chris L.", authorEmail: "chris@demo.com", persona: "builder", content: "Try lowering the step rate first. Start at 1 step per millisecond, then increase. Also check the A4988 MS1/MS2/MS3 jumpers — they should match your code\'s microstepping config. I had the same issue when MS1 was loose.", upvotes: 3, time: now - 3600000 }
      ]},
      { title: "My first IoT greenhouse project", category: "Projects", tags: ["IoT", "greenhouse", "ESP32"], author: "Sarah K.", authorEmail: "sarah@demo.com", persona: "builder", content: "Just finished the first prototype of my automated greenhouse! It uses an ESP32 to monitor soil moisture, temperature, and humidity via DHT22 and capacitive soil sensors. The data gets pushed to a simple web dashboard and it can auto-water via a relay-controlled pump. I\'m planning to add light control next.", upvotes: 12, time: now - 3600000 * 8, replies: [
        { author: "Emma W.", authorEmail: "emma@demo.com", persona: "student", content: "This looks amazing! Would you share your wiring diagram? I\'m working on something similar for a uni project.", upvotes: 2, time: now - 3600000 * 6 },
        { author: "Priya S.", authorEmail: "priya@demo.com", persona: "idea", content: "Great project! Have you thought about adding a CO2 sensor? It could help optimize ventilation for plant growth.", upvotes: 1, time: now - 3600000 * 5 },
        { author: "Alex M.", authorEmail: "alex@demo.com", persona: "seller", content: "I sell the capacitive soil sensors and DHT22 modules on Technologia if you need spares. Happy to bundle a discount for the community!", upvotes: 5, time: now - 3600000 * 4 }
      ]},
      { title: "Showcasing my 3D-printed robot arm", category: "Show & Tell", tags: ["3D printing", "robotics", "servo"], author: "Jordan T.", authorEmail: "jordan@demo.com", persona: "student", content: "I designed and 3D-printed a 6-DOF robot arm for my final year project. It\'s controlled by an Arduino Mega with 6 SG90 servos. The inverse kinematics are calculated in Python and sent over serial. Total cost was under \u00a330 in parts! The arm can pick up small objects and sort them by colour using a TCS3200 sensor.", upvotes: 18, time: now - 3600000 * 14, replies: [
        { author: "Chris L.", authorEmail: "chris@demo.com", persona: "builder", content: "\u00a330 is insane for a 6-DOF arm! How accurate is the positioning? I built one with MG996R servos and got about 2cm repeatability.", upvotes: 3, time: now - 3600000 * 12 },
        { author: "Sarah K.", authorEmail: "sarah@demo.com", persona: "builder", content: "Love the colour sorting feature! Did you 3D print the gripper too? I\'d love to see the STL files if you\'re sharing.", upvotes: 4, time: now - 3600000 * 10 },
        { author: "Emma W.", authorEmail: "emma@demo.com", persona: "student", content: "This is so inspiring. I\'m just starting with servos — any advice on learning inverse kinematics?", upvotes: 1, time: now - 3600000 * 8 },
        { author: "Priya S.", authorEmail: "priya@demo.com", persona: "idea", content: "Have you considered adding a camera module for vision-based picking? That would make it even more capable.", upvotes: 2, time: now - 3600000 * 6 },
        { author: "Alex M.", authorEmail: "alex@demo.com", persona: "seller", content: "Brilliant work! If you need stronger servos or better power supply modules for v2, check the marketplace.", upvotes: 2, time: now - 3600000 * 4 }
      ]},
      { title: "Looking for ultrasonic sensor recommendations", category: "Parts", tags: ["ultrasonic", "sensors", "recommendation"], author: "Priya S.", authorEmail: "priya@demo.com", persona: "idea", content: "I need an ultrasonic distance sensor for a parking assistant prototype. The HC-SR04 is cheap but I\'ve read it can be unreliable at longer ranges. Does anyone have experience with the JSN-SR04T (waterproof version) or DYP-A02? I need at least 3m reliable range, preferably 4m+.", upvotes: 5, time: now - 3600000 * 20, replies: [
        { author: "Alex M.", authorEmail: "alex@demo.com", persona: "seller", content: "The JSN-SR04T is great for outdoor/wet use and has a solid 4.5m range. For indoor precision, the DYP-A02 is more accurate but costs a bit more. Both are available on the shop.", upvotes: 3, time: now - 3600000 * 18 },
        { author: "Jordan T.", authorEmail: "jordan@demo.com", persona: "student", content: "I used the HC-SR04 in my robot arm project for basic obstacle detection and it was fine up to about 2.5m. For a parking system I\'d definitely go with the JSN-SR04T.", upvotes: 2, time: now - 3600000 * 16 }
      ]},
      { title: "Need a collaborator for autonomous drone build", category: "Collaboration", tags: ["drone", "autonomous", "collaboration"], author: "Chris L.", authorEmail: "chris@demo.com", persona: "builder", content: "I\'m building an autonomous drone for agricultural surveying and I need help with the flight controller programming and computer vision pipeline. I\'ve got the mechanical frame and ESCs sorted, but the PID tuning and GPS waypoint navigation are beyond my current skill level. Looking for someone with ArduPilot or PX4 experience. Happy to share credit on the project and split any competition prizes.", upvotes: 9, time: now - 3600000 * 30, replies: [
        { author: "Sarah K.", authorEmail: "sarah@demo.com", persona: "builder", content: "I have experience with PX4 and ROS! I\'ve been looking for a drone project to join. Could you share your frame specs and motor/prop combo? I can handle the flight controller side.", upvotes: 6, time: now - 3600000 * 28 },
        { author: "Priya S.", authorEmail: "priya@demo.com", persona: "idea", content: "I don\'t have the technical skills but I\'d love to help with the project planning, documentation, and potentially finding sponsors. DM me if interested!", upvotes: 2, time: now - 3600000 * 24 },
        { author: "Emma W.", authorEmail: "emma@demo.com", persona: "student", content: "This sounds like an amazing project! I\'m studying computer vision and would love to help with the image processing pipeline for crop analysis.", upvotes: 4, time: now - 3600000 * 22 }
      ]},
      { title: "Best resources for learning embedded systems?", category: "Education", tags: ["learning", "embedded", "resources"], author: "Emma W.", authorEmail: "emma@demo.com", persona: "student", content: "I\'m a second-year EE student and I want to get serious about embedded systems. I know the basics of Arduino but want to move into bare-metal ARM programming, RTOS concepts, and PCB design. What are the best books, courses, or YouTube channels you\'d recommend? I\'m considering the STM32 platform as a starting point.", upvotes: 14, time: now - 3600000 * 48, replies: [
        { author: "Alex M.", authorEmail: "alex@demo.com", persona: "seller", content: "\"Making Embedded Systems\" by Elecia White is the gold standard intro book. For STM32 specifically, the ST official getting-started docs and the Cortex-M4 technical reference manual are essential reading.", upvotes: 5, time: now - 3600000 * 44 },
        { author: "Chris L.", authorEmail: "chris@demo.com", persona: "builder", content: "For RTOS, check out the \"Mastering the FreeRTOS Real Time Kernel\" handbook — it\'s free online. Pair it with an STM32 Nucleo board and you\'ll be writing multitasking firmware in no time.", upvotes: 4, time: now - 3600000 * 40 },
        { author: "Jordan T.", authorEmail: "jordan@demo.com", persona: "student", content: "Phil\'s Lab on YouTube is incredible for STM32 bare-metal and PCB design. He goes from schematic to manufactured board. Also, FastBit Embedded Brain Academy on Udemy has great courses.", upvotes: 6, time: now - 3600000 * 36 },
        { author: "Sarah K.", authorEmail: "sarah@demo.com", persona: "builder", content: "Don\'t skip KiCad for PCB design! Start with their official tutorial, then build a simple Arduino shield before moving to custom designs. It\'s a game-changer when you can make your own boards.", upvotes: 3, time: now - 3600000 * 32 }
      ]}
    ];
    demos.forEach(function (d) { d.id = "t" + Date.now() + Math.random().toString(36).slice(2, 6); d.replies.forEach(function (r) { r.id = "r" + Date.now() + Math.random().toString(36).slice(2, 6); }); TG.saveThread(d); });
  }

  $(function () {
    if (!$("#discPage").length) return;
    seedThreads();

    var state = { cat: "All", q: "", active: null, upvoted: {}, replyUpvoted: {} };
    var sess = TG.session();

    // Build category chips
    CATS.forEach(function (c) { $("#discCatChips").append('<button class="chip' + (c === "All" ? " active" : "") + '" data-cat="' + c + '">' + c + '</button>'); });

    function threadListItem(t) {
      var cls = catClass(t.category);
      return '<div class="disc-thread' + (state.active === t.id ? " active" : "") + '" data-id="' + t.id + '">' +
        TG.avatarHTML(t.author, 36, t.persona) +
        '<div class="disc-thread-body">' +
          '<span class="disc-cat-tag ' + cls + '">' + t.category + '</span>' +
          '<p class="disc-thread-title">' + t.title + '</p>' +
          '<div class="disc-thread-meta"><span class="author-name">' + t.author + '</span><span>' + TG.timeAgo(t.time) + '</span></div>' +
        '</div>' +
        '<div class="disc-thread-stats"><span class="stat-num">' + (t.replies || []).length + '</span><span>replies</span></div>' +
        '<div class="disc-thread-stats"><span class="stat-num">' + t.upvotes + '</span><span>votes</span></div>' +
      '</div>';
    }

    function renderList() {
      var threads = TG.threads();
      if (state.cat !== "All") threads = threads.filter(function (t) { return t.category === state.cat; });
      if (state.q) { var q = state.q.toLowerCase(); threads = threads.filter(function (t) { return (t.title + " " + (t.tags || []).join(" ")).toLowerCase().indexOf(q) > -1; }); }
      var $list = $("#discThreadList").empty();
      if (!threads.length) { $list.html('<div class="empty" style="padding:40px 16px;"><p>No threads found.</p></div>'); return; }
      threads.forEach(function (t) { $list.append(threadListItem(t)); });
    }

    function renderDetail(t) {
      var cls = catClass(t.category);
      var p = t.persona && TG.PERSONAS[t.persona] ? TG.PERSONAS[t.persona] : null;
      var html = '<div class="disc-detail">' +
        '<div class="cat-row"><span class="disc-cat-tag ' + cls + '">' + t.category + '</span></div>' +
        '<h2>' + t.title + '</h2>' +
        '<div class="author">' + TG.avatarHTML(t.author, 38, t.persona) +
          '<span class="author-name">' + t.author + '</span>' +
          (p ? '<span class="persona-badge" style="background:' + p.color + '22;color:' + p.color + ';">' + p.label + '</span>' : '') +
          '<span class="author-time">' + TG.timeAgo(t.time) + '</span>' +
        '</div>' +
        '<div class="body">' + t.content + '</div>' +
        '<div class="tags">' + (t.tags || []).map(function (tag) { return '<span class="disc-cat-tag Education">' + tag + '</span>'; }).join("") + '</div>' +
        '<div class="actions">' +
          '<button class="upvote-btn' + (state.upvoted[t.id] ? " voted" : "") + '" data-type="thread" data-id="' + t.id + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' + t.upvotes +
          '</button>' +
          '<span style="color:var(--faint);font-size:.85rem;">' + (t.replies || []).length + ' repl' + ((t.replies || []).length === 1 ? 'y' : 'ies') + '</span>' +
        '</div>' +
        '<div class="disc-replies"><h3>Replies</h3>';
      (t.replies || []).forEach(function (r) {
        var rp = r.persona && TG.PERSONAS[r.persona] ? TG.PERSONAS[r.persona] : null;
        html += '<div class="disc-reply" data-rid="' + r.id + '">' + TG.avatarHTML(r.author, 32, r.persona) +
          '<div class="reply-body">' +
            '<div class="reply-meta"><span class="author-name">' + r.author + '</span>' +
            (rp ? '<span class="persona-badge" style="background:' + rp.color + '22;color:' + rp.color + ';"><a href="profile.html">' + rp.label + '</a></span>' : '') +
            '<span class="author-time">' + TG.timeAgo(r.time) + '</span></div>' +
            '<div class="reply-text">' + r.content + '</div>' +
            '<div class="reply-actions"><button class="upvote-btn' + (state.replyUpvoted[t.id + ":" + r.id] ? " voted" : "") + '" data-type="reply" data-tid="' + t.id + '" data-rid="' + r.id + '">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' + r.upvotes +
            '</button></div>' +
          '</div></div>';
      });
      html += '</div>' +
        '<div class="disc-reply-form">' + TG.avatarHTML(sess ? sess.name : "You", 32, sess ? sess.persona : "builder") +
          '<textarea class="field" id="replyText" rows="3" placeholder="Write a reply…"></textarea>' +
          '<button class="btn btn-primary btn-sm" id="replyBtn" style="align-self:flex-end;">Reply</button>' +
        '</div></div>';
      $("#discDetail").html(html).show();
      $("#discEmpty").hide();
      $("#discNewForm").hide();
    }

    // Category chips
    $("#discCatChips").on("click", ".chip", function () {
      state.cat = $(this).data("cat");
      $(".disc-chips .chip").removeClass("active");
      $(this).addClass("active");
      renderList();
    });

    // Search
    var st; $("#discSearch").on("input", function () { var v = this.value; clearTimeout(st); st = setTimeout(function () { state.q = v; renderList(); }, 180); });

    // Click thread
    $("#discThreadList").on("click", ".disc-thread", function () {
      var id = $(this).data("id");
      state.active = id;
      renderList();
      var t = TG.threads().filter(function (x) { return x.id === id; })[0];
      if (t) renderDetail(t);
    });

    // Upvote
    $("#discDetail").on("click", ".upvote-btn", function () {
      var $btn = $(this), type = $btn.data("type"), threads = TG.threads();
      if (type === "thread") {
        var id = $btn.data("id"), t = null;
        for (var i = 0; i < threads.length; i++) { if (threads[i].id === id) { t = threads[i]; break; } }
        if (!t) return;
        if (state.upvoted[id]) { t.upvotes = Math.max(0, t.upvotes - 1); delete state.upvoted[id]; }
        else { t.upvotes++; state.upvoted[id] = true; }
        TG.deleteThread(id); TG.saveThread(t);
        $btn.toggleClass("voted", !!state.upvoted[id]);
        $btn.html('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' + t.upvotes);
        renderList();
      } else if (type === "reply") {
        var tid = $btn.data("tid"), rid = $btn.data("rid"), t = null, r = null;
        for (var i = 0; i < threads.length; i++) { if (threads[i].id === tid) { t = threads[i]; break; } }
        if (!t) return;
        for (var j = 0; j < t.replies.length; j++) { if (t.replies[j].id === rid) { r = t.replies[j]; break; } }
        if (!r) return;
        var key = tid + ":" + rid;
        if (state.replyUpvoted[key]) { r.upvotes = Math.max(0, r.upvotes - 1); delete state.replyUpvoted[key]; }
        else { r.upvotes++; state.replyUpvoted[key] = true; }
        TG.deleteThread(tid); TG.saveThread(t);
        $btn.toggleClass("voted", !!state.replyUpvoted[key]);
        $btn.html('<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' + r.upvotes);
      }
    });

    // Reply
    $("#discDetail").on("click", "#replyBtn", function () {
      var text = $("#replyText").val().trim();
      if (!text) return;
      if (!sess) { TG.toast("Please log in to reply", "err"); return; }
      TG.saveThreadReply(state.active, { author: sess.name, authorEmail: sess.email, persona: sess.persona || "builder", content: text, upvotes: 0 });
      $("#replyText").val("");
      var t = TG.threads().filter(function (x) { return x.id === state.active; })[0];
      if (t) renderDetail(t);
      renderList();
      TG.toast("Reply posted", "ok");
      var $replies = $(".disc-replies");
      setTimeout(function () { $replies[0].scrollIntoView({ behavior: "smooth", block: "end" }); }, 100);
    });

    // New thread toggle
    $("#discNewBtn").on("click", function () {
      $("#discEmpty").hide();
      $("#discDetail").hide();
      $("#discNewForm").show();
      state.active = null;
      renderList();
    });
    $("#newCancel").on("click", function () {
      $("#discNewForm").hide();
      if (state.active) { var t = TG.threads().filter(function (x) { return x.id === state.active; })[0]; if (t) renderDetail(t); }
      else $("#discEmpty").show();
    });

    // Submit new thread
    $("#newSubmit").on("click", function () {
      var title = $("#newTitle").val().trim(), cat = $("#newCategory").val(),
          tags = $("#newTags").val().split(",").map(function (s) { return s.trim(); }).filter(Boolean),
          content = $("#newContent").val().trim();
      if (!title || !content) { TG.toast("Please fill in title and content", "err"); return; }
      if (!sess) { TG.toast("Please log in to create a thread", "err"); return; }
      var t = TG.saveThread({ title: title, category: cat, tags: tags, content: content, author: sess.name, authorEmail: sess.email, persona: sess.persona || "builder", upvotes: 0, replies: [] });
      $("#newTitle").val(""); $("#newTags").val(""); $("#newContent").val("");
      state.active = t.id;
      renderList();
      renderDetail(t);
      TG.toast("Thread created", "ok");
    });

    renderList();
  });
})(jQuery);
