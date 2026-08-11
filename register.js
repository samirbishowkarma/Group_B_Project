(function ($) {
  "use strict";
  $(function () {
    if ($("#pdp").length) {
      var id = new URLSearchParams(location.search).get("id");
      var p = TG.find(id);
      var $pdp = $("#pdp");
      if (!p) { $pdp.html('<div class="empty" style="grid-column:1/-1"><h3>Product not found</h3><p>This item may have been removed. <a href="shop.html">Back to shop</a>.</p></div>'); return; }
      document.title = p.name + " \u2014 Technologia";
      $("#crumbName").text(p.name);
      var used = p.cond !== "New";
      var save = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
      $pdp.html(
        '<div class="pdp-media">' + TG.imgTag(p, 900, 900) + '</div>' +
        '<div class="pdp-info">' +
          '<span class="tag ' + (used ? "used" : "new") + '" style="position:static;display:inline-block;">' + (used ? "Used \u00b7 " + p.cond : "Brand new") + '</span>' +
          '<h1>' + p.name + '</h1>' +
          '<div class="rating" style="color:#ffc857;">\u2605\u2605\u2605\u2605\u2605 <span style="color:var(--faint);margin-left:6px;">' + p.rating.toFixed(1) + ' rating</span></div>' +
          '<div class="price grad-text">' + TG.money(p.price) + (p.old ? '<span class="old">' + TG.money(p.old) + '</span>' : '') + (save > 0 ? ' <span style="font-size:.9rem;color:var(--ok);font-weight:700;-webkit-text-fill-color:var(--ok);">Save ' + save + '%</span>' : '') + '</div>' +
          '<p class="desc">' + (p.desc || "A quality item listed on the Technologia marketplace.") + '</p>' +
          '<div class="spec">' +
            '<div><span>Category</span><span>' + p.cat + '</span></div>' +
            '<div><span>Brand</span><span>' + (p.brand || "\u2014") + '</span></div>' +
            '<div><span>Condition</span><span>' + p.cond + '</span></div>' +
            '<div><span>Availability</span><span style="color:var(--ok);font-weight:700;">In stock</span></div>' +
          '</div>' +
          '<div class="pdp-actions">' +
            '<div class="qty"><button type="button" id="minus" aria-label="Decrease">\u2212</button><input type="number" id="qty" value="1" min="1" aria-label="Quantity"><button type="button" id="plus" aria-label="Increase">+</button></div>' +
            '<button class="btn btn-primary" id="addBtn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg> Add to cart</button>' +
            '<button class="btn btn-ghost wish ' + (TG.inWish(p.id) ? "on" : "") + '" data-id="' + p.id + '" style="position:static;width:auto;height:auto;border-radius:12px;">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 5 5.3 5c2 0 3.4 1.2 4.2 2.4C10.3 6.2 11.7 5 13.7 5 17 5 18.6 8.4 17 11.8 15.5 16.4 12 21 12 21z"/></svg> Save</button>' +
          '</div>' +
          '<div style="margin-top:24px;display:flex;gap:22px;flex-wrap:wrap;color:var(--muted);font-size:.9rem;"><span>Fast UK delivery</span><span>7-day returns</span><span>Secure checkout</span></div>' +
        '</div>'
      );
      var $q = $("#qty");
      $("#minus").on("click", function () { $q.val(Math.max(1, (+$q.val() || 1) - 1)); });
      $("#plus").on("click", function () { $q.val((+$q.val() || 1) + 1); });
      $q.on("change", function () { if (+this.value < 1 || isNaN(+this.value)) this.value = 1; });
      $("#addBtn").on("click", function () { TG.addToCart(p.id, Math.max(1, +$q.val() || 1)); TG.toast("Added " + $q.val() + " to cart", "ok"); });
      var rel = TG.all().filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 4);
      if (rel.length) { $("#relatedWrap").removeAttr("hidden"); var $r = $("#related"); rel.forEach(function (x) { $r.append(TG.cardHTML(x)); }); $(".card.reveal").addClass("in"); }
    }
  });
})(jQuery);