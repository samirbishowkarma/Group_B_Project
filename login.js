/* login.js — Technologia Marketplace */
(function ($) {
  "use strict";
  $(function () {
    if ($("#loginForm").length) {
      var emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      $(".tabs button").on("click", function () {
        var tab = $(this).data("tab");
        $(".tabs button").removeClass("active"); $(this).addClass("active");
        $("#loginForm").prop("hidden", tab !== "login");
        $("#registerForm").prop("hidden", tab !== "register");
        $("#authIntro").text(tab === "login" ? "Welcome back \u2014 sign in to your account." : "Join Technologia to buy and sell tech.");
      });
      function setErr(id, msg) { $("#" + id).toggleClass("invalid", !!msg); $('.err[data-for="' + id + '"]').text(msg); return !msg; }
      $("#loginForm").on("submit", function (e) {
        e.preventDefault();
        var ok = true, email = $("#li-email").val().trim(), pass = $("#li-pass").val();
        ok &= setErr("li-email", emailRe.test(email) ? "" : "Enter a valid email.");
        ok &= setErr("li-pass", pass.length ? "" : "Enter your password.");
        if (!ok) return;
        if (TG.login(email, pass)) { TG.toast("Signed in! Redirecting\u2026", "ok"); setTimeout(function () { location.href = "index.html"; }, 900); }
        else { setErr("li-pass", "Email or password is incorrect."); TG.toast("Login failed", "err"); }
      });
      $("#registerForm").on("submit", function (e) {
        e.preventDefault();
        var ok = true, name = $("#rg-name").val().trim(), email = $("#rg-email").val().trim(), pass = $("#rg-pass").val(), confirm = $("#rg-confirm").val();
        ok &= setErr("rg-name", name.length >= 2 ? "" : "Enter your name.");
        ok &= setErr("rg-email", emailRe.test(email) ? "" : "Enter a valid email.");
        ok &= setErr("rg-pass", pass.length >= 6 ? "" : "Use at least 6 characters.");
        ok &= setErr("rg-confirm", confirm === pass && confirm.length ? "" : "Passwords do not match.");
        if (!ok) return;
        if (!TG.registerUser({ name: name, email: email, pass: pass })) { setErr("rg-email", "An account with this email already exists."); TG.toast("Email already registered", "err"); return; }
        TG.login(email, pass); TG.toast("Account created! Redirecting\u2026", "ok"); setTimeout(function () { location.href = "index.html"; }, 900);
      });
    }
  });
})(jQuery);

