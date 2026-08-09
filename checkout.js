/* ===================================================================
   Technologia — Checkout: Cart 
   ---------------------------------------------------------------------
   =================================================================== */

const CART_STORAGE_KEY = "technologiaCart";

$(function () {
  // 1. Load the cart summary on page load
  renderCartSummary();

  // 2. LISTEN FOR FORM SUBMISSION (This was the missing part)
  $("#checkout-form").on("submit", handleCheckoutSubmit);
});

/**
 * Reads the cart from localStorage, defends against missing/corrupt
 * data, and returns a clean array.
 */
function getCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Cart data corrupted, resetting.", err);
    return [];
  }
}

/** Formats a number as GBP */
function formatCurrency(amount) {
  return "£" + amount.toFixed(2);
}

/**
 * Renders the cart into #cart-items and updates #cart-total.
 */
function renderCartSummary() {
  const cart = getCart();
  const $list = $("#cart-items");
  const $emptyMessage = $("#cart-empty-message");
  const $total = $("#cart-total");
  const $placeOrderBtn = $("#place-order-btn");

  $list.empty();

  if (cart.length === 0) {
    $emptyMessage.prop("hidden", false);
    $total.text(formatCurrency(0));
    $placeOrderBtn.prop("disabled", true);
    return;
  }

  $emptyMessage.prop("hidden", true);
  $placeOrderBtn.prop("disabled", false);

  let grandTotal = 0;

  cart.forEach(function (item) {
    const lineTotal = item.price * item.qty;
    grandTotal += lineTotal;

    const $li = $("<li>").append(
      $("<div>").append(
        $("<span>").addClass("cart-item-name").text(item.name),
        $("<span>")
          .addClass("cart-item-meta")
          .text(item.category + " · " + item.seller + " · qty " + item.qty)
      ),
      $("<span>").addClass("cart-item-price").text(formatCurrency(lineTotal))
    );

    $list.append($li);
  });

  $total.text(formatCurrency(grandTotal));
}

const VALIDATORS = {
  "full-name": function (value) {
    if (!value.trim()) return "Please enter your full name.";
    return null;
  },

  email: function (value) {
    if (!value.trim()) return "Please enter your email address.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return "Enter a valid email address.";
    return null;
  },

  address: function (value) {
    if (!value.trim()) return "Please enter a delivery address.";
    return null;
  },

  postcode: function (value) {
    if (!value.trim()) return "Please enter a postcode.";
    const postcodePattern = /^[A-Za-z0-9]{2,4}\s?[A-Za-z0-9]{3}$/;
    if (!postcodePattern.test(value.trim())) return "Enter a valid postcode.";
    return null;
  },

  "card-name": function (value) {
    if (!value.trim()) return "Please enter the name on the card.";
    return null;
  },

  "card-number": function (value) {
    const digitsOnly = value.replace(/\s/g, "");
    if (!digitsOnly) return "Please enter a card number.";
    if (!/^\d{13,19}$/.test(digitsOnly)) {
      return "Card number should be 13–19 digits.";
    }
    return null;
  },

  "card-expiry": function (value) {
    const match = value.trim().match(/^(\d{2})\/(\d{2})$/);
    if (!match) return "Use MM/YY format.";

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;
    if (month < 1 || month > 12) return "Enter a valid month.";

    const now = new Date();
    const expiryDate = new Date(year, month);
    if (expiryDate <= now) return "This card has expired.";

    return null;
  },

  "card-cvc": function (value) {
    if (!/^\d{3,4}$/.test(value.trim())) return "CVC should be 3–4 digits.";
    return null;
  },
};

function clearErrors() {
  $(".error-message").text("");
  $(".form-field").removeClass("has-error");
}

function showFieldError(fieldId, message) {
  $("#" + fieldId + "-error").text(message);
  $("#" + fieldId).closest(".form-field").addClass("has-error");
}

function validateForm() {
  const errors = [];
  Object.keys(VALIDATORS).forEach(function (fieldId) {
    const value = $("#" + fieldId).val() || "";
    const errorMessage = VALIDATORS[fieldId](value);
    if (errorMessage) {
      errors.push({ fieldId: fieldId, message: errorMessage });
    }
  });
  return errors;
}

function handleCheckoutSubmit(event) {
  event.preventDefault(); // Stop page reload
  clearErrors();

  const cart = getCart();
  const $status = $("#form-status");

  if (cart.length === 0) {
    $status
      .removeClass("success")
      .addClass("error")
      .text("Your cart is empty — add something from the marketplace first.");
    return;
  }

  const errors = validateForm();

  if (errors.length > 0) {
    errors.forEach(function (err) {
      showFieldError(err.fieldId, err.message);
    });

    $status
      .removeClass("success")
      .addClass("error")
      .text("Please fix " + errors.length + " field(s) below.");

    $("#" + errors[0].fieldId).trigger("focus");
    return;
  }

  completeOrder(cart);
}

function completeOrder(cart) {
  const order = {
    id: "ORD-" + Date.now(),
    placedAt: new Date().toISOString(),
    items: cart,
    total: cart.reduce(function (sum, item) {
      return sum + item.price * item.qty;
    }, 0),
    customerName: $("#full-name").val(),
    email: $("#email").val(),
  };

  const pastOrders = JSON.parse(localStorage.getItem("technologiaOrders") || "[]");
  pastOrders.push(order);
  localStorage.setItem("technologiaOrders", JSON.stringify(pastOrders));

  localStorage.removeItem(CART_STORAGE_KEY);
  renderCartSummary();

  $("#form-status")
    .removeClass("error")
    .addClass("success")
    .text("Order placed! Confirmation: " + order.id);

  $("#checkout-form")[0].reset();
}

