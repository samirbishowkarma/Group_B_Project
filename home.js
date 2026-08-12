
(function ($) {
  "use strict";
  $(function () {
    if ($("#catGrid").length) {
      var cats = [
        { name: "Sensors", image: "assets/images/category-sensors.webp", desc: "Temp, motion, distance & more", ic: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>' },
        { name: "Mechanical", image: "assets/images/category-mechanical.webp", desc: "Motors, gears & hardware", ic: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 7 2.6h.1A1.6 1.6 0 0 0 9 1.1V1a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 17 2.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H23a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>' },
        { name: "Gadgets", image: "assets/images/category-gadgets.webp", desc: "Wearables, cameras & audio", ic: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 18h.01"/></svg>' },
        { name: "IoT", image: "assets/images/category-iot.webp", desc: "Boards, kits & smart home", ic: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>' }
      ];
      var $cg = $("#catGrid");
      cats.forEach(function (c, i) {
        $cg.append('<a class="cat-card reveal" href="marketplace.html?cat=' + encodeURIComponent(c.name) + '"><img src="' + c.image + '" alt="' + c.name + ' components" width="500" height="400" loading="lazy" decoding="async" onerror="tgImgErr(this)"><span class="arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span><span class="ic">' + c.ic + '</span><h3>' + c.name + '</h3><p>' + c.desc + '</p></a>');
      });

      var picks = TG.catalog().filter(function (p) { return ["s1","m1","g1","i1","g2","s3","i4","m3"].indexOf(p.id) > -1; });
      var $f = $("#featured"); picks.forEach(function (p) { $f.append(TG.cardHTML(p)); });

      var $r = $("#recent");
      var listings = TG.listings();
      if (!listings.length) {
        listings = [
          { id: "demo1", name: "Used Arduino Uno R3", cat: "IoT", img: "arduino,board", price: 18.99, old: 29.99, rating: 4.2, cond: "Good" },
          { id: "demo2", name: "Second-hand Servo Pack (x4)", cat: "Mechanical", img: "servo,motor", price: 12.99, old: 22.99, rating: 4.0, cond: "Fair" },
          { id: "demo3", name: "Pre-owned Fitness Band", cat: "Gadgets", img: "fitness,band,watch", price: 19.99, old: 44.99, rating: 4.1, cond: "Good" },
          { id: "demo4", name: "Used IR Sensor Bundle", cat: "Sensors", img: "infrared,sensor", price: 3.99, old: 7.49, rating: 4.3, cond: "Good" }
        ];
      }
      listings.slice(0, 4).forEach(function (p) { $r.append(TG.cardHTML(p)); });

      var WISHLIST_KEY = "tg_wishlist";

      function readWishlist() {
        try {
          return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
        } catch (err) {
          return [];
        }
      }

      function saveWishlist(items) {
        try {
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
          return true;
        } catch (err) {
          TG.toast("Your browser could not save the wishlist", "err");
          return false;
        }
      }

      function productId($card) {
        var href = $card.find("a.thumb").attr("href") || "";
        return new URL(href, window.location.href).searchParams.get("id");
      }

      function updateWishlistButton($button, saved) {
        $button.toggleClass("on", saved);
        $button.attr("aria-pressed", saved ? "true" : "false");
        $button.attr("aria-label", saved ? "Remove from wishlist" : "Add to wishlist");
      }

      function prepareProductCards() {
        var saved = readWishlist();

        $("#featured .card, #recent .card").each(function () {
          var $card = $(this);
          var id = productId($card);
          var name = $card.find("h3").text().trim() || "this product";

          updateWishlistButton($card.find(".wish"), saved.indexOf(id) > -1);
          $card.find(".add-btn")
            .attr("aria-label", "Chat about " + name)
            .attr("title", "Chat with the seller")
            .html('<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>');
        });

        $("#featured img, #recent img").each(function () {
          var image = this;
          image.onerror = function () { window.tgImgErr(image); };
          if (image.complete && !image.naturalWidth) window.tgImgErr(image);
        });
      }

      prepareProductCards();

      $("#featured, #recent").on("click", ".wish", function () {
        var $button = $(this);
        var id = productId($button.closest(".card"));
        var saved = readWishlist();
        var position = saved.indexOf(id);

        if (position > -1) saved.splice(position, 1);
        else saved.push(id);

        if (saveWishlist(saved)) {
          var isSaved = position === -1;
          updateWishlistButton($button, isSaved);
          TG.toast(isSaved ? "Saved to your wishlist" : "Removed from your wishlist", "ok");
        }
      });

      $("#featured, #recent").on("click", ".add-btn", function () {
        var id = productId($(this).closest(".card"));
        window.location.href = "chat.html?product=" + encodeURIComponent(id);
      });

      if (window.tgObserve) window.tgObserve();

      $(".num[data-count]").each(function () {
        var $el = $(this), target = +$el.data("count"), start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1600, 1);
          $el.text(Math.floor(p * target).toLocaleString() + (p === 1 ? "+" : ""));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });

      $("#newsForm").on("submit", function (e) {
        e.preventDefault();
        var $i = $(this).find("input");
        if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($i.val())) { TG.toast("You're subscribed!", "ok"); $i.val(""); }
        else { TG.toast("Enter a valid email", "err"); }
      });
    }
  });
})(jQuery);
