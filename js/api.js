/**
 * api.js
 * -----------------------------------------------------------------------
 * The single boundary between SOCOMART's frontend and any backend.
 * Today: submits orders to a Google Apps Script Web App, which writes a
 * row into Google Sheets. Tomorrow: point ENDPOINT (see config.js) at a
 * real API — nothing outside this file needs to change.
 * -----------------------------------------------------------------------
 */

const SheetsAPI = (() => {

  /**
   * Build the flat payload shape expected by the Apps Script doPost handler.
   * One row per order is written with pipe-joined product fields, which
   * keeps the Sheet simple to read while still being fully re-parseable.
   */
  const buildOrderPayload = (customer, cartItems) => {
    const now = new Date();
    return {
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      district: customer.district,
      state: customer.state,
      pincode: customer.pincode,
      productNames: cartItems.map((i) => i.product.name).join(" | "),
      productIds: cartItems.map((i) => i.id).join(" | "),
      quantities: cartItems.map((i) => i.quantity).join(" | "),
      prices: cartItems.map((i) => i.product.offerPrice).join(" | "),
      orderTotal: cartItems.reduce((sum, i) => sum + i.product.offerPrice * i.quantity, 0),
      paymentMethod: customer.paymentMethod,
      date: now.toLocaleDateString("en-IN"),
      time: now.toLocaleTimeString("en-IN"),
      status: "Pending"
    };
  };

  /**
   * Send the order to Google Sheets via Apps Script.
   * Falls back to local-only storage when remote sync is disabled or fails,
   * so checkout always completes for the customer.
   */
  const submitOrder = async (customer, cartItems) => {
    const payload = buildOrderPayload(customer, cartItems);
    const orderId = Utils.generateId("ORD");
    const localRecord = { orderId, ...payload, placedAt: new Date().toISOString() };

    // Always keep a local copy — acts as an order history fallback.
    const history = StorageManager.get("socomart_orders", []);
    history.unshift(localRecord);
    StorageManager.set("socomart_orders", history);

    if (!SOCOMART_CONFIG.ENABLE_REMOTE_ORDER_SYNC) {
      return { ok: true, orderId, synced: false };
    }

    try {
      await fetch(SOCOMART_CONFIG.GOOGLE_SHEETS_ENDPOINT, {
        method: "POST",
        mode: "no-cors", // Apps Script web apps typically require no-cors from the browser
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return { ok: true, orderId, synced: true };
    } catch (err) {
      console.error("SheetsAPI: order sync failed, order saved locally only.", err);
      return { ok: true, orderId, synced: false };
    }
  };

  const submitContactForm = async (formData) => {
    // Placeholder for wiring a "Contact" Apps Script endpoint the same way.
    console.info("Contact form captured (no backend connected yet):", formData);
    return { ok: true };
  };

  return { buildOrderPayload, submitOrder, submitContactForm };
})();
