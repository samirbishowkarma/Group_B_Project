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

