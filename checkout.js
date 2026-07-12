/**
 * checkout.js
 * -----------------------------------------------------------------------
 * Wires up the checkout page: renders the order summary, validates the
 * customer form, and submits the order via SheetsAPI.
 * -----------------------------------------------------------------------
 */

const CheckoutController = (() => {

  const init = () => {
    const form = Utils.qs("[data-checkout-form]");
    if (!form) return;

    const items = CartManager.getEnrichedItems();
    if (!items.length) {
      window.location.href = "cart.html";
      return;
    }

    renderOrderSummary(items);
    Validation.bindLiveValidation(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSubmit(form, items);
    });
  };

  const renderOrderSummary = (items) => {
    const list = Utils.qs("[data-order-lines]");
    if (list) {
      list.innerHTML = items.map((i) => `
        <div class="order-line">
          <span class="oi-name">${Utils.escapeHtml(i.product.name)} × ${i.quantity}</span>
          <span class="mono">${Utils.formatCurrency(i.product.offerPrice * i.quantity)}</span>
        </div>
      `).join("");
    }
    CartRenderer.renderSummary();
  };

  const handleSubmit = async (form, items) => {
    if (!Validation.validateForm(form)) {
      NotificationManager.error("Please fix the highlighted fields.");
      return;
    }

    const submitBtn = Utils.qs("button[type='submit']", form);
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> Placing order…`;

    const customer = {
      name: Utils.qs("#custName", form).value.trim(),
      phone: Utils.qs("#custPhone", form).value.trim(),
      email: Utils.qs("#custEmail", form).value.trim(),
      address: Utils.qs("#custAddress", form).value.trim(),
      district: Utils.qs("#custDistrict", form).value.trim(),
      state: Utils.qs("#custState", form).value.trim(),
      pincode: Utils.qs("#custPincode", form).value.trim(),
      paymentMethod: Utils.qs("input[name='payment']:checked", form)?.value || "COD"
    };

    try {
      const result = await SheetsAPI.submitOrder(customer, items);
      if (result.ok) {
        CartManager.clear();
        NotificationManager.success(`Order ${result.orderId} placed successfully!`, "Thank you");
        form.reset();
        setTimeout(() => {
          window.location.href = `index.html?orderConfirmed=${result.orderId}`;
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      NotificationManager.error("Something went wrong placing your order. Please try again.");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  };

  return { init };
})();
