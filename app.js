/**
 * app.js
 * -----------------------------------------------------------------------
 * Application bootstrap. Loads product data, wires global event
 * delegation (add-to-cart, wishlist, quantity controls), initializes
 * shared UI (nav, search, animations), then hands off to whichever
 * page-specific renderer applies (home / products / product / cart /
 * wishlist / checkout).
 * -----------------------------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", async () => {
  await ProductManager.load();

  NavigationManager.init();
  SearchManager.init();
  bindGlobalActions();
  initScrollReveal();
  initRippleButtons();
  initNewsletterForm();
  hidePageLoader();

  routeToPageController();
});

/* ---------- Global delegated actions (present on every page) ---------- */
function bindGlobalActions() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    const id = target.dataset.id;

    switch (action) {
      case "add-to-cart":
        CartManager.addItem(id, 1);
        refreshCartAwareUI();
        break;
      case "toggle-wishlist": {
        const nowWished = WishlistManager.toggle(id);
        target.classList.toggle("active", nowWished);
        target.setAttribute("aria-pressed", String(nowWished));
        if (Utils.qs("[data-wishlist-grid]")) WishlistRenderer.renderWishlistPage();
        break;
      }
      case "remove-from-cart":
        CartManager.removeItem(id);
        CartRenderer.renderCartPage();
        break;
      case "qty-increase": {
        const item = CartManager.getItems().find((i) => i.id === id);
        if (item) CartManager.updateQuantity(id, item.quantity + 1);
        CartRenderer.renderCartPage();
        break;
      }
      case "qty-decrease": {
        const item = CartManager.getItems().find((i) => i.id === id);
        if (item && item.quantity > 1) CartManager.updateQuantity(id, item.quantity - 1);
        else if (item) CartManager.removeItem(id);
        CartRenderer.renderCartPage();
        break;
      }
      default:
        break;
    }
  });
}

function refreshCartAwareUI() {
  if (Utils.qs("[data-cart-list]")) CartRenderer.renderCartPage();
}

/* ---------- Ripple effect for .btn elements ---------- */
function initRippleButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}

/* ---------- Scroll reveal for .reveal elements ---------- */
function initScrollReveal() {
  const items = Utils.qsa(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el) => observer.observe(el));
}

/* Re-scan for newly injected .reveal elements after dynamic renders */
function refreshScrollReveal() { initScrollReveal(); }

/* ---------- Newsletter form (footer) ---------- */
function initNewsletterForm() {
  const form = Utils.qs("[data-newsletter-form]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = Utils.qs("input", form);
    if (!input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      NotificationManager.error("Enter a valid email to subscribe.");
      return;
    }
    NotificationManager.success("You're subscribed to SOCOMART offers!");
    form.reset();
  });
}

/* ---------- Page loader ---------- */
function hidePageLoader() {
  const loader = Utils.qs(".page-loader");
  if (loader) setTimeout(() => loader.classList.add("hidden"), 150);
}

/* ---------- Route to the correct page controller by body[data-page] ---------- */
function routeToPageController() {
  const page = document.body.dataset.page;
  const controllers = {
    home: HomeController,
    products: ProductsPageController,
    product: ProductDetailController,
    cart: CartPageController,
    wishlist: WishlistPageController,
    checkout: CheckoutController,
    contact: ContactController
  };
  controllers[page]?.init?.();
}

/* ============================================================
   Page controllers
   ============================================================ */

const HomeController = (() => {
  const init = () => {
    ProductRenderer.renderGrid(Utils.qs("[data-featured-grid]"), ProductManager.getByTag("featured"));
    ProductRenderer.renderGrid(Utils.qs("[data-trending-grid]"), ProductManager.getByTag("trending"));
    ProductRenderer.renderGrid(Utils.qs("[data-offer-grid]"), ProductManager.getByTag("offer"));
    refreshScrollReveal();

    const orderConfirmed = Utils.getQueryParam("orderConfirmed");
    if (orderConfirmed) {
      NotificationManager.success(`Order ${orderConfirmed} confirmed. We'll be in touch soon!`, "All set");
    }
  };
  return { init };
})();


const ProductsPageController = (() => {
  let state = { query: "", categories: [], brands: [], minPrice: null, maxPrice: null, sort: "featured" };

  const init = () => {
    state.query = Utils.getQueryParam("q") || "";
    const catParam = Utils.getQueryParam("cat");
    if (catParam) state.categories = [catParam];
    const searchInput = Utils.qs("[data-search-form] input");
    if (searchInput && state.query) searchInput.value = state.query;

    buildFilterPanel();
    bindToolbar();
    render();
  };

  const buildFilterPanel = () => {
    const catWrap = Utils.qs("[data-filter-categories]");
    const brandWrap = Utils.qs("[data-filter-brands]");

    if (catWrap) {
      catWrap.innerHTML = ProductManager.getCategories().map((cat) => `
        <label class="filter-option">
          <input type="checkbox" value="${cat}" data-filter-type="category" ${state.categories.includes(cat) ? "checked" : ""}> ${Utils.escapeHtml(cat)}
        </label>`).join("");
    }
    if (brandWrap) {
      brandWrap.innerHTML = ProductManager.getBrands().map((brand) => `
        <label class="filter-option">
          <input type="checkbox" value="${brand}" data-filter-type="brand"> ${Utils.escapeHtml(brand)}
        </label>`).join("");
    }

    Utils.qsa("[data-filter-type]").forEach((input) =>
      input.addEventListener("change", () => { syncStateFromForm(); render(); })
    );

    Utils.qs("[data-price-min]")?.addEventListener("input", Utils.debounce(() => { syncStateFromForm(); render(); }, 300));
    Utils.qs("[data-price-max]")?.addEventListener("input", Utils.debounce(() => { syncStateFromForm(); render(); }, 300));

    Utils.qs("[data-clear-filters]")?.addEventListener("click", () => {
      state = { query: state.query, categories: [], brands: [], minPrice: null, maxPrice: null, sort: state.sort };
      Utils.qsa("[data-filter-type]").forEach((el) => (el.checked = false));
      if (Utils.qs("[data-price-min]")) Utils.qs("[data-price-min]").value = "";
      if (Utils.qs("[data-price-max]")) Utils.qs("[data-price-max]").value = "";
      render();
    });
  };

  const syncStateFromForm = () => {
    state.categories = Utils.qsa("[data-filter-type='category']:checked").map((el) => el.value);
    state.brands = Utils.qsa("[data-filter-type='brand']:checked").map((el) => el.value);
    const min = Utils.qs("[data-price-min]")?.value;
    const max = Utils.qs("[data-price-max]")?.value;
    state.minPrice = min ? Number(min) : null;
    state.maxPrice = max ? Number(max) : null;
  };

  const bindToolbar = () => {
    Utils.qs("[data-sort-select]")?.addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });
    Utils.qs("[data-search-form]")?.addEventListener("submit", (e) => {
      e.preventDefault();
      state.query = Utils.qs("input", e.target).value.trim();
      render();
    });
  };

  const render = () => {
    const grid = Utils.qs("[data-product-grid]");
    const results = ProductManager.query(state);
    const countEl = Utils.qs("[data-result-count]");
    if (countEl) countEl.textContent = `${results.length} product${results.length === 1 ? "" : "s"} found`;
    ProductRenderer.renderGrid(grid, results);
    refreshScrollReveal();
  };

  return { init };
})();


const ProductDetailController = (() => {
  const init = () => {
    const id = Utils.getQueryParam("id");
    const product = ProductManager.getById(id);
    const root = Utils.qs("[data-pdp-root]");

    if (!product || !root) {
      NotificationManager.error("Product not found.");
      window.location.href = "products.html";
      return;
    }

    StorageManager.addRecentlyViewed(product.id);
    renderProduct(product);
    bindGallery(product);
    bindQuantity(product);
    bindTabs();
    bindBuyActions(product);
    renderRelated(product);
    refreshScrollReveal();
  };

  const renderProduct = (product) => {
    document.title = `${product.name} | SOCOMART`;
    Utils.qs("[data-pdp-main-image]").src = product.image;
    Utils.qs("[data-pdp-main-image]").alt = product.name;
    Utils.qs("[data-pdp-thumbs]").innerHTML = product.gallery.map((src, i) => `
      <button class="${i === 0 ? "active" : ""}" data-thumb data-src="${src}"><img src="${src}" alt="${Utils.escapeHtml(product.name)} view ${i + 1}"></button>
    `).join("");

    Utils.qs("[data-pdp-brand-cat]").textContent = `${product.brand} · ${product.category}`;
    Utils.qs("[data-pdp-name]").textContent = product.name;
    Utils.qs("[data-pdp-rating]").innerHTML = `<span class="stars">${Utils.starString(product.rating)}</span> <span>(${product.reviewsCount} reviews)</span>`;
    Utils.qs("[data-pdp-price-now]").textContent = Utils.formatCurrency(product.offerPrice);
    const oldPriceEl = Utils.qs("[data-pdp-price-old]");
    const discount = Math.round(100 - (product.offerPrice / product.price) * 100);
    if (product.price > product.offerPrice) {
      oldPriceEl.textContent = Utils.formatCurrency(product.price);
      Utils.qs("[data-pdp-save]").textContent = `Save ${discount}%`;
    } else {
      oldPriceEl.classList.add("hidden");
      Utils.qs("[data-pdp-save]").classList.add("hidden");
    }
    Utils.qs("[data-pdp-desc]").textContent = product.description;
    Utils.qs("[data-pdp-stock]").textContent = product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock";

    Utils.qs("[data-pdp-features]").innerHTML = product.features.map((f) => `<li>${Utils.escapeHtml(f)}</li>`).join("");
    Utils.qs("[data-pdp-specs]").innerHTML = Object.entries(product.specs)
      .map(([k, v]) => `<tr><td>${Utils.escapeHtml(k)}</td><td>${Utils.escapeHtml(String(v))}</td></tr>`).join("");

    const wished = WishlistManager.isWished(product.id);
    const wishBtn = Utils.qs("[data-pdp-wishlist]");
    wishBtn.classList.toggle("active", wished);
    wishBtn.dataset.id = product.id;
  };

  const bindGallery = () => {
    Utils.qsa("[data-thumb]").forEach((btn) =>
      btn.addEventListener("click", () => {
        Utils.qs("[data-pdp-main-image]").src = btn.dataset.src;
        Utils.qsa("[data-thumb]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      })
    );
  };

  const bindQuantity = (product) => {
    const display = Utils.qs("[data-pdp-qty]");
    let qty = 1;
    Utils.qs("[data-pdp-qty-minus]")?.addEventListener("click", () => {
      qty = Utils.clamp(qty - 1, 1, product.stock || 1);
      display.textContent = qty;
    });
    Utils.qs("[data-pdp-qty-plus]")?.addEventListener("click", () => {
      qty = Utils.clamp(qty + 1, 1, product.stock || 1);
      display.textContent = qty;
    });
    ProductDetailController._getQty = () => qty;
  };

  const bindTabs = () => {
    Utils.qsa(".tab-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        Utils.qsa(".tab-btn").forEach((b) => b.classList.remove("active"));
        Utils.qsa(".tab-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        Utils.qs(`#${btn.dataset.tab}`).classList.add("active");
      })
    );
  };

  const bindBuyActions = (product) => {
    Utils.qs("[data-pdp-add-cart]")?.addEventListener("click", () => {
      const qty = ProductDetailController._getQty ? ProductDetailController._getQty() : 1;
      CartManager.addItem(product.id, qty);
    });
    Utils.qs("[data-pdp-buy-now]")?.addEventListener("click", () => {
      const qty = ProductDetailController._getQty ? ProductDetailController._getQty() : 1;
      CartManager.addItem(product.id, qty);
      window.location.href = "checkout.html";
    });
  };

  const renderRelated = (product) => {
    ProductRenderer.renderGrid(Utils.qs("[data-related-grid]"), ProductManager.getRelated(product));
  };

  return { init };
})();


const CartPageController = (() => {
  const init = () => CartRenderer.renderCartPage();
  return { init };
})();

const WishlistPageController = (() => {
  const init = () => WishlistRenderer.renderWishlistPage();
  return { init };
})();

const ContactController = (() => {
  const init = () => {
    const form = Utils.qs("[data-contact-form]");
    if (!form) return;
    Validation.bindLiveValidation(form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!Validation.validateForm(form)) {
        NotificationManager.error("Please fix the highlighted fields.");
        return;
      }
      const data = {
        name: Utils.qs("#contactName", form).value.trim(),
        email: Utils.qs("#contactEmail", form).value.trim(),
        message: Utils.qs("#contactMessage", form).value.trim()
      };
      await SheetsAPI.submitContactForm(data);
      NotificationManager.success("Your message has been sent. We'll reply soon!");
      form.reset();
    });
  };
  return { init };
})();
