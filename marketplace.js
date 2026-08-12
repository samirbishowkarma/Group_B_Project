/* Marketplace page interactions kept local so base.js stays unchanged. */
(function ($) {
  "use strict";

  var TG = window.TG = window.TG || {};
  var WISHLIST_KEY = "tg_wishlist";

  TG.PERSONAS = TG.PERSONAS || {
    seller: { label: "Seller", color: "#ff7a45", desc: "List spare parts and connect with local makers." },
    builder: { label: "Builder", color: "#2dd4ff", desc: "Find reliable components for your next build." },
    idea: { label: "Idea person", color: "#8b5cff", desc: "Turn an early idea into a practical project." },
    student: { label: "Student", color: "#22f5c8", desc: "Discover affordable parts and learn by making." }
  };

  function allProducts() {
    var catalog = typeof TG.catalog === "function" ? TG.catalog() : [];
    var listings = typeof TG.listings === "function" ? TG.listings() : [];
    return catalog.concat(listings);
  }

  function readWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveWishlist(items) {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
      return true;
    } catch (error) {
      if (typeof TG.toast === "function") TG.toast("Your browser could not save the wishlist", "err");
      return false;
    }
  }

  function setWishlistButton($button, saved) {
    $button.toggleClass("saved", saved)
      .attr("aria-pressed", saved ? "true" : "false")
      .attr("aria-label", saved ? "Remove from wishlist" : "Add to wishlist");
  }

  function markImageUnavailable(image) {
    var $image = $(image);
    var $thumb = $image.closest(".thumb");
    if ($thumb.hasClass("has-image-fallback")) return;
    $thumb.addClass("has-image-fallback");
    $image.remove();
  }

  $(function () {
    var $grid = $("#mpGrid");
    if (!$grid.length) return;

    var ICONS = {
      seller: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
      builder: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
      idea: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>',
      student: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 10 3 12 0v-5"/></svg>'
    };
    var categories = ["all", "Sensors", "Mechanical", "Gadgets", "IoT"];
    var params = new URLSearchParams(window.location.search);
    var requestedCategory = params.get("cat") || "all";
    var requestedCondition = (params.get("cond") || "all").toLowerCase();
    var state = {
      cat: categories.indexOf(requestedCategory) > -1 ? requestedCategory : "all",
      q: "",
      cond: ["all", "new", "used"].indexOf(requestedCondition) > -1 ? requestedCondition : "all",
      sort: "newest"
    };

    var $personas = $("#personaRow");
    $.each(TG.PERSONAS, function (key, persona) {
      $personas.append(
        '<a class="persona-card" href="sell.html" style="--persona-color:' + persona.color + '">' +
          '<span class="pc-icon">' + ICONS[key] + '</span>' +
          '<span class="pc-label">' + persona.label + '</span>' +
          '<span class="pc-desc">' + persona.desc + '</span>' +
        '</a>'
      );
    });

    var $chips = $("#mpCatChips");
    categories.forEach(function (category) {
      $chips.append('<button class="chip" type="button" data-cat="' + category + '">' +
        (category === "all" ? "All" : category) + '</button>');
    });

    function syncControls() {
      $chips.find(".chip").each(function () {
        $(this).toggleClass("active", $(this).data("cat") === state.cat);
      });
      $("#mpCond").val(state.cond);
    }

    function prepareCard($card, product) {
      $card.attr("data-product-id", product.id);
      var $chatButton = $card.find(".add-btn");
      $chatButton.attr({
        "aria-label": "Chat about " + product.name,
        "title": "Chat about this item"
      }).html('<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>');

      var saved = readWishlist().indexOf(String(product.id)) > -1;
      setWishlistButton($card.find(".wish"), saved);

      $card.find("img").each(function () {
        var image = this;
        $(image).one("error", function () { markImageUnavailable(image); });
        if (image.complete && !image.naturalWidth) markImageUnavailable(image);
      });
    }

    function render() {
      var items = allProducts().slice();

      if (state.cat !== "all") {
        items = items.filter(function (product) { return product.cat === state.cat; });
      }
      if (state.cond === "new") {
        items = items.filter(function (product) { return product.cond === "New"; });
      } else if (state.cond === "used") {
        items = items.filter(function (product) { return product.cond && product.cond !== "New"; });
      }
      if (state.q) {
        var query = state.q.toLowerCase();
        items = items.filter(function (product) {
          return [product.name, product.cat, product.brand, product.desc].join(" ").toLowerCase().indexOf(query) > -1;
        });
      }
      if (state.sort === "price-low") {
        items.sort(function (a, b) { return a.price - b.price; });
      } else if (state.sort === "price-high") {
        items.sort(function (a, b) { return b.price - a.price; });
      }

      $grid.empty();
      if (!items.length) {
        $grid.html('<div class="empty mp-empty"><h3>No listings match your filters</h3><p>Try a different search or clear the filters.</p></div>');
        return;
      }

      items.forEach(function (product) {
        var $card = $(TG.cardHTML(product));
        prepareCard($card, product);
        $grid.append($card);
      });
      if (window.tgObserve) window.tgObserve();
    }

    $chips.on("click", ".chip", function () {
      state.cat = $(this).data("cat");
      syncControls();
      render();
    });

    var debounce;
    $("#mpSearch").on("input", function () {
      var value = this.value;
      window.clearTimeout(debounce);
      debounce = window.setTimeout(function () {
        state.q = value.trim();
        render();
      }, 180);
    });
    $("#mpSort").on("change", function () { state.sort = this.value; render(); });
    $("#mpCond").on("change", function () { state.cond = this.value; render(); });

    $grid.on("click", ".add-btn", function () {
      var productId = $(this).closest(".card").data("product-id");
      window.location.href = "chat.html?product=" + encodeURIComponent(productId);
    });
    $grid.on("click", ".wish", function () {
      var productId = String($(this).closest(".card").data("product-id"));
      var items = readWishlist();
      var index = items.indexOf(productId);
      if (index > -1) items.splice(index, 1); else items.push(productId);
      if (!saveWishlist(items)) return;
      setWishlistButton($(this), index === -1);
      if (typeof TG.toast === "function") TG.toast(index === -1 ? "Saved to your wishlist" : "Removed from your wishlist", "ok");
    });

    syncControls();
    render();
  });
})(jQuery);
