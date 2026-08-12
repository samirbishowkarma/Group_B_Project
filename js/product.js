/* Product detail page */
(function ($) {
  "use strict";

  function clean(value, fallback) {
    var text = value == null ? (fallback || "") : String(value);
    return $("<div>").text(text).html();
  }

  function allProducts() {
    var catalog = typeof TG.catalog === "function" ? TG.catalog() : [];
    var listings = typeof TG.listings === "function" ? TG.listings() : [];
    return catalog.concat(listings);
  }

  function findProduct(id) {
    return allProducts().filter(function (item) {
      return String(item.id) === String(id);
    })[0];
  }

  function money(value) {
    if (typeof TG.money === "function") return TG.money(value);
    return "$" + Number(value || 0).toFixed(2);
  }

  function productImage(product) {
    if (typeof TG.imgTag === "function") {
      return TG.imgTag(product, 900, 900, "product-photo");
    }

    return '<img class="product-photo" src="../assets/images/product-fallback.webp" alt="' +
      clean(product.name, "Product image") + '" width="900" height="900" loading="lazy" decoding="async" onerror="tgImgErr(this)">';
  }

  var WISHLIST_KEY = "tg_wish";

  function wishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function isSaved(id) {
    return wishlist().indexOf(String(id)) > -1;
  }

  function toggleSaved(id) {
    var productId = String(id);
    var items = wishlist();
    var index = items.indexOf(productId);

    if (index > -1) {
      items.splice(index, 1);
    } else {
      items.push(productId);
    }

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    return index === -1;
  }

  function starLine(rating) {
    var rounded = Math.max(0, Math.min(5, Math.round(rating)));
    return new Array(rounded + 1).join("★") + new Array(6 - rounded).join("☆");
  }

  function conditionLabel(product) {
    if (!product.cond || product.cond === "New") return "Brand new";
    return "Used · " + clean(product.cond);
  }

  function renderMissing($pdp) {
    document.title = "Product not found — Technologia";
    $pdp.html(
      '<div class="product-missing">' +
        '<h1 id="productTitle">We couldn\'t find that product</h1>' +
        '<p>It may have been removed, or the link may be out of date.</p>' +
        '<a class="btn btn-primary" href="marketplace.html">Back to the shop</a>' +
      '</div>'
    );
  }

  function renderProduct($pdp, product) {
    var rating = Number(product.rating) || 0;
    var discount = product.old ? Math.round((1 - product.price / product.old) * 100) : 0;
    var image = productImage(product);
    var brand = clean(product.brand, "Independent seller");
    var description = clean(product.desc, "A quality item listed on the Technologia marketplace.");
    var sku = clean(product.id || "item").toUpperCase();

    $pdp.html(
      '<div class="pdp-media">' +
        '<div class="pdp-image">' + image + '</div>' +
        '<div class="image-note"><span>Product image</span><span>Colours may vary slightly on screen</span></div>' +
      '</div>' +
      '<div class="pdp-info">' +
        '<div class="product-labels">' +
          '<span class="tag ' + (product.cond === "New" ? "new" : "used") + ' product-condition">' + conditionLabel(product) + '</span>' +
          '<span class="stock-label">Available</span>' +
        '</div>' +
        '<h1 id="productTitle">' + clean(product.name, "Product") + '</h1>' +
        '<p class="product-byline">Sold by <strong>' + brand + '</strong></p>' +
        '<div class="product-rating" aria-label="Rated ' + rating.toFixed(1) + ' out of 5">' +
          '<span aria-hidden="true" style="color:#ffc857">' + starLine(rating) + '</span>' +
          '<span>' + rating.toFixed(1) + ' out of 5</span>' +
        '</div>' +
        '<div class="price-row">' +
          '<div class="price grad-text">' + money(product.price) + (product.old ? '<span class="old">' + money(product.old) + '</span>' : '') + '</div>' +
          (discount > 0 ? '<span class="saving-pill">Save ' + discount + '%</span>' : '') +
        '</div>' +
        '<p class="price-note">This is the seller\'s current asking price.</p>' +
        '<p class="desc">' + description + '</p>' +
        '<div class="spec" aria-label="Product details">' +
          '<div><span>Category</span><span>' + clean(product.cat, "Other") + '</span></div>' +
          '<div><span>Brand</span><span>' + brand + '</span></div>' +
          '<div><span>Condition</span><span>' + clean(product.cond, "Not stated") + '</span></div>' +
          '<div><span>Product code</span><span>' + sku + '</span></div>' +
        '</div>' +
        '<div class="purchase-box">' +
          '<strong class="purchase-title">Interested in this item?</strong>' +
          '<p class="purchase-copy">Message the seller to ask questions and agree the details directly.</p>' +
          '<div class="contact-actions">' +
            '<a class="btn btn-primary contact-seller" href="chat.html?product=' + encodeURIComponent(product.id) + '">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>' +
              'Chat with seller' +
            '</a>' +
            '<button class="btn btn-ghost save-product" id="saveBtn" type="button">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 5 5.3 5c2 0 3.4 1.2 4.2 2.4C10.3 6.2 11.7 5 13.7 5 17 5 18.6 8.4 17 11.8 15.5 16.4 12 21 12 21z"/></svg>' +
              '<span>Save</span>' +
            '</button>' +
          '</div>' +
          '<p class="purchase-note">Technologia does not handle payment for this listing.</p>' +
        '</div>' +
        '<div class="service-points" aria-label="Marketplace tips">' +
          '<div class="service-point"><strong>Ask first</strong>Check condition, availability and what is included.</div>' +
          '<div class="service-point"><strong>Agree the details</strong>Arrange delivery or collection with the seller.</div>' +
          '<div class="service-point"><strong>Stay sensible</strong>Keep personal details private until you are comfortable.</div>' +
        '</div>' +
      '</div>'
    );
  }

  function wireProductActions(product) {
    var $save = $("#saveBtn");

    function updateSaveButton(saved) {
      $save.toggleClass("on", saved);
      $save.attr("aria-pressed", saved ? "true" : "false");
      $save.find("span").text(saved ? "Saved" : "Save");
    }

    updateSaveButton(isSaved(product.id));

    $save.on("click", function () {
      var saved = toggleSaved(product.id);
      updateSaveButton(saved);
      TG.toast(saved ? "Saved to your wishlist" : "Removed from your wishlist");
    });
  }

  function showRelatedProducts(product) {
    var related = allProducts().filter(function (item) {
      return item.cat === product.cat && item.id !== product.id;
    }).slice(0, 4);

    if (!related.length) return;

    var $related = $("#related").empty();
    related.forEach(function (item) {
      var $card = $(TG.cardHTML(item));
      var $chatLink = $('<a class="add-btn contact-card" aria-label="Chat about this product">' +
        '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>' +
      '</a>');
      $chatLink.attr("href", "chat.html?product=" + encodeURIComponent(item.id));
      $card.find(".add-btn").replaceWith($chatLink);
      $related.append($card);
    });

    $("#relatedWrap").removeAttr("hidden");
    if (window.tgObserve) window.tgObserve();
  }

  $(function () {
    var $pdp = $("#pdp");
    if (!$pdp.length || !window.TG) return;

    var requestedId = new URLSearchParams(window.location.search).get("id");
    var product = findProduct(requestedId || "s1");

    if (!product) {
      renderMissing($pdp);
      return;
    }

    document.title = product.name + " — Technologia";
    $("#crumbName").text(product.name);
    renderProduct($pdp, product);
    wireProductActions(product);
    showRelatedProducts(product);
  });
})(jQuery);
