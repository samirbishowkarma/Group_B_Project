/* register.js — Technologia Marketplace */
(function ($) {
  "use strict";
  $(function () {
    if (!$("#regForm").length) return;

    var selectedPersona = "";
    var selectedSkills = [];
    var emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    function setErr(id, msg) {
      var $f = $("#" + id);
      if ($f.length) $f.toggleClass("invalid", !!msg);
      $(".err[data-for=\"" + id + "\"]").text(msg);
      return !msg;
    }

    /* Persona selection — single choice */
    $("#personaSelect").on("click", ".persona-opt", function () {
      $(".persona-opt").removeClass("selected");
      $(this).addClass("selected");
      selectedPersona = $(this).data("persona");
      setErr("persona", "");
    });

    /* Skills — multi toggle */
    $("#skillsSelect").on("click", ".skill-chip", function () {
      var skill = $(this).data("skill");
      $(this).toggleClass("active");
      if ($(this).hasClass("active")) { selectedSkills.push(skill); }
      else { selectedSkills = selectedSkills.filter(function (s) { return s !== skill; }); }
    });

    /* Submit */
    $("#regForm").on("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var name = $("#reg-name").val().trim();
      var email = $("#reg-email").val().trim();
      var pass = $("#reg-pass").val();
      var confirm = $("#reg-confirm").val();
      var bio = $("#reg-bio").val().trim();
      var terms = $("#reg-terms").is(":checked");

      ok &= setErr("reg-name", name.length >= 2 ? "" : "Enter your full name.");
      ok &= setErr("reg-email", emailRe.test(email) ? "" : "Enter a valid email.");
      ok &= setErr("reg-pass", pass.length >= 6 ? "" : "Use at least 6 characters.");
      ok &= setErr("reg-confirm", confirm === pass && confirm.length ? "" : "Passwords do not match.");
      ok &= setErr("persona", selectedPersona ? "" : "Please select a persona.");
      ok &= setErr("reg-terms", terms ? "" : "You must agree to the terms.");

      if (!ok) return;

      if (!TG.registerUser({ name: name, email: email, pass: pass, persona: selectedPersona, skills: selectedSkills, bio: bio, joined: Date.now(), avatar: null, reputation: 4.5 })) {
        setErr("reg-email", "An account with this email already exists.");
        TG.toast("Email already registered", "err");
        return;
      }

      TG.login(email, pass);
      TG.toast("Account created! Redirecting\u2026", "ok");
      setTimeout(function () { location.href = "index.html"; }, 900);
    });
  });
})(jQuery);
