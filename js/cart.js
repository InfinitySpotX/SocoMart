/**
 * cart.js
 * -----------------------------------------------------------------------
 * CartManager: all cart state mutations, persisted via StorageManager.
 * CartRenderer: renders the cart page and the order summary totals.
 * -----------------------------------------------------------------------
 */

const CartManager = (() => {

  const getItems = () => StorageManager.getCart();

  const save = (items) => {
    StorageManager.setCart(items);
    NavigationManager.updateBadges();
  };

  const addItem = (productId, quantity = 1) => {
    const product = ProductManager.getById(productId);
    if (!product) return;
    if (product.stock === 0) {
      NotificationManager.warning("This item is currently sold out.");
      return;
    }

    const items = getItems();
    const existing = items.find((i) => i.id === productId);

    if (existing) {
      existing.quantity = Utils.clamp(existing.quantity + quantity, 1, product.stock);
    } else {
      items.push({ id: productId, quantity: Utils.clamp(quantity, 1, product.stock) });
    }
    save(items);
    NotificationManager.success(`${product.name} added to cart.`, "Added to cart");
  };

  const removeItem = (productId) => {
    save(getItems().filter((i) => i.id !== productId));
    NotificationManager.info("Item removed from cart.");
  };

  const updateQuantity = (productId, quantity) => {
    const product = ProductManager.getById(productId);
    const items = getItems();
    const item = items.find((i) => i.id === productId);
    if (!item || !product) return;

    item.quantity = Utils.clamp(quantity, 1, product.stock);
    save(items);
  };

  const clear = () => save([]);

  const getEnrichedItems = () =>
    getItems()
      .map((item) => {
        const product = ProductManager.getById(item.id);
        return product ? { ...item, product } : null;
      })
      .filter(Boolean);

  const getTotals = () => {
    const items = getEnrichedItems();
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const offerTotal = items.reduce((sum, i) => sum + i.product.offerPrice * i.quantity, 0);
    const discount = subtotal - offerTotal;
    const delivery = offerTotal === 0 || offerTotal >= SOCOMART_CONFIG.FREE_DELIVERY_THRESHOLD
      ? 0 : SOCOMART_CONFIG.DELIVERY_CHARGE;
    const grandTotal = offerTotal + delivery;

    return { itemCount: items.reduce((s, i) => s + i.quantity, 0), subtotal, discount, delivery, grandTotal };
  };

  return { getItems, addItem, removeItem, updateQuantity, clear, getEnrichedItems, getTotals };
})();


const CartRenderer = (() => {

  const renderCartPage = () => {
    const list = Utils.qs("[data-cart-list]");
    const emptyState = Utils.qs("[data-cart-empty]");
    const summaryWrap = Utils.qs("[data-cart-summary]");
    if (!list) return;

    const items = CartManager.getEnrichedItems();

    if (!items.length) {
      list.innerHTML = "";
      emptyState?.classList.remove("hidden");
      summaryWrap?.classList.add("hidden");
      return;
    }

    emptyState?.classList.add("hidden");
    summaryWrap?.classList.remove("hidden");

    list.innerHTML = items.map((item) => `
      <div class="cart-item" data-id="${item.id}">
        <div class="thumb"><img src="${item.product.image}" alt="${Utils.escapeHtml(item.product.name)}" loading="lazy"></div>
        <div>
          <a href="product.html?id=${item.id}" class="name">${Utils.escapeHtml(item.product.name)}</a>
          <div class="variant">${Utils.escapeHtml(item.product.brand)} · ${Utils.escapeHtml(item.product.category)}</div>
          <button class="remove-link" data-action="remove-from-cart" data-id="${item.id}">Remove</button>
        </div>
        <div class="qty-selector" data-qty-for="${item.id}">
          <button data-action="qty-decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button data-action="qty-increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <div class="price mono">${Utils.formatCurrency(item.product.offerPrice * item.quantity)}</div>
      </div>
    `).join("");

    renderSummary();
  };

  const renderSummary = () => {
    const totals = CartManager.getTotals();
    const map = {
      "[data-sum-subtotal]": Utils.formatCurrency(totals.subtotal),
      "[data-sum-discount]": `− ${Utils.formatCurrency(totals.discount)}`,
      "[data-sum-delivery]": totals.delivery === 0 ? "Free" : Utils.formatCurrency(totals.delivery),
      "[data-sum-total]": Utils.formatCurrency(totals.grandTotal),
      "[data-sum-count]": totals.itemCount
    };
    Object.entries(map).forEach(([selector, value]) => {
      Utils.qsa(selector).forEach((el) => (el.textContent = value));
    });
  };

  return { renderCartPage, renderSummary };
})();
