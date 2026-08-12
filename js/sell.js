
(function ($) {
  "use strict";
  $(function () {
    if ($("#sellForm").length) {
      var kwByCat = { Sensors: "sensor,electronics", Mechanical: "motor,gears,machine", Gadgets: "gadget,device", IoT: "circuit,board,iot" };
      var photos = [];
      function drawPreview() {
        var cat = $("#category").val() || "Sensors";
        var p = { id: "preview", name: $("#title").val() || "Your item title", cat: cat, img: kwByCat[cat] || "electronics", photos: photos.slice(), price: +$("#price").val() || 0, old: +$("#old").val() || 0, rating: 4.5, cond: $("#condition").val() || "Good" };
        $("#preview").html(TG.cardHTML(p));
        $("#preview .card").addClass("in");
      }
      $("#title,#category,#price,#old,#condition").on("input change", drawPreview);
      drawPreview();

      var $files = $("#files"), $drop = $("#drop"), $prev = $("#previews");
      $drop.on("click", function () { $files.click(); });
      $drop.on("dragover", function (e) { e.preventDefault(); $drop.addClass("drag"); });
      $drop.on("dragleave drop", function () { $drop.removeClass("drag"); });
      $drop.on("drop", function (e) { e.preventDefault(); handle(e.originalEvent.dataTransfer.files); });
      $files.on("change", function () { handle(this.files); });
      function handle(list) {
        Array.prototype.forEach.call(list, function (f) {
          if (!f.type.match(/^image\//)) return;
          var reader = new FileReader();
          reader.onload = function (ev) { photos.push(ev.target.result); renderPreviews(); drawPreview(); };
          reader.readAsDataURL(f);
        });
      }
      function renderPreviews() {
        $prev.empty();
        photos.forEach(function (src, i) { $prev.append('<div class="pv"><img src="' + src + '" alt="preview"><button type="button" data-i="' + i + '" aria-label="Remove">×</button></div>'); });
      }
      $prev.on("click", "button", function () { photos.splice(+$(this).data("i"), 1); renderPreviews(); drawPreview(); });

      var rules = {
        title: function (v) { return v.trim().length >= 4 ? "" : "Enter a title of at least 4 characters."; },
        category: function (v) { return v ? "" : "Please pick a category."; },
        condition: function (v) { return v ? "" : "Please pick a condition."; },
        price: function (v) { return (+v > 0) ? "" : "Enter a price greater than zero."; },
        phone: function (v) { return /^07[0-9]{9}$/.test(v.trim()) ? "" : "Enter a valid UK phone number."; },
        desc: function (v) { return v.trim().length >= 20 ? "" : "Description must be at least 20 characters."; }
      };
      function validateField(name) { var $f = $("#" + name); var msg = rules[name] ? rules[name]($f.val()) : ""; $f.toggleClass("invalid", !!msg); $('.err[data-for="' + name + '"]').text(msg); return !msg; }
      Object.keys(rules).forEach(function (name) { $("#" + name).on("blur input change", function () { validateField(name); }); });

      $("#sellForm").on("submit", function (e) {
        e.preventDefault();
        var ok = true;
        Object.keys(rules).forEach(function (name) { if (!validateField(name)) ok = false; });
        if (!$("#terms").is(":checked")) { ok = false; $('.err[data-for="terms"]').text("Please confirm ownership to continue."); } else { $('.err[data-for="terms"]').text(""); }
        if (!ok) { TG.toast("Please fix the highlighted fields", "err"); return; }
        var cat = $("#category").val();
        var item = { id: "u" + Date.now(), name: $("#title").val().trim(), cat: cat, img: kwByCat[cat] || "electronics", photos: photos.slice(), price: +$("#price").val(), old: +$("#old").val() || 0, rating: 4.5, cond: $("#condition").val(), brand: $("#brand").val().trim() || "Unbranded", phone: $("#phone").val().trim(), desc: $("#desc").val().trim() };
        TG.saveListing(item);
        TG.toast("Listing published! Redirecting…", "ok");
        setTimeout(function () { location.href = "product.html?id=" + item.id; }, 1100);
      });
    }
  });
})(jQuery);
