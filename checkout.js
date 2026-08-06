/* ===================================================================
   Technologia — Checkout: Cart 
   ---------------------------------------------------------------------
   =================================================================== */

const CART_STORAGE_KEY = "technologiaCart";

$(function () {
  renderCartSummary();
});

/**
 * Reads the cart from localStorage, defends against missing/corrupt
 * data, and returns a clean array (empty array if nothing usable).
 */
function getCart() {
  const raw = localStorage.getItem(CART_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Cart data in localStorage was corrupted, resetting.", err);
    return [];
  }
}

/** Formats a number as GBP, e.g. 6.5 -> "£6.50" */
function formatCurrency(amount) {
  return "£" + amount.toFixed(2);
}

/**
 * Renders the cart into #cart-items and updates #cart-total.
 * Shows the empty-cart message and disables checkout when there's
 * nothing to buy.
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
          .text(
            item.category +
              " · " +
              item.seller +
              " · qty " +
              item.qty
          )
      ),
      $("<span>").addClass("cart-item-price").text(formatCurrency(lineTotal))
    );

    $list.append($li);
  });

  $total.text(formatCurrency(grandTotal));
}
