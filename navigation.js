/**
 * navigation.js
 * -----------------------------------------------------------------------
 * Sticky header behaviour, mobile hamburger menu, and cart/wishlist
 * badge counters shown in the navbar.
 * -----------------------------------------------------------------------
 */

const NavigationManager = (() => {

  const init = () => {
    const header = Utils.qs(".site-header");
    const hamburger = Utils.qs(".hamburger");
    const mobileMenu = Utils.qs(".mobile-menu");
    const mobileSearchToggle = Utils.qs("[data-action='toggle-mobile-search']");
    const navSearch = Utils.qs(".nav-search");

    if (header) {
      const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
      document.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("open");
        hamburger.setAttribute("aria-expanded", String(isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
      });
      Utils.qsa("a", mobileMenu).forEach((link) =>
        link.addEventListener("click", () => {
          mobileMenu.classList.remove("open");
          document.body.style.overflow = "";
        })
      );
    }

    if (mobileSearchToggle && navSearch) {
      mobileSearchToggle.addEventListener("click", () => navSearch.classList.toggle("mobile-open"));
    }

    highlightActiveLink();
    updateBadges();
    ThemeManager.init();
  };

  const highlightActiveLink = () => {
    const current = window.location.pathname.split("/").pop() || "index.html";
    Utils.qsa(".nav-links a, .mobile-menu a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === current) link.classList.add("active");
    });
  };

  const updateBadges = () => {
    const cartBadge = Utils.qs("[data-badge='cart']");
    const wishlistBadge = Utils.qs("[data-badge='wishlist']");
    const cartCount = StorageManager.getCart().reduce((sum, i) => sum + i.quantity, 0);
    const wishlistCount = StorageManager.getWishlist().length;

    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.classList.toggle("hidden", cartCount === 0);
    }
    if (wishlistBadge) {
      wishlistBadge.textContent = wishlistCount;
      wishlistBadge.classList.toggle("hidden", wishlistCount === 0);
    }
  };

  return { init, updateBadges };
})();


const ThemeManager = (() => {
  const init = () => {
    const saved = StorageManager.getTheme();
    document.documentElement.setAttribute("data-theme", saved);

    const toggle = Utils.qs("[data-action='toggle-theme']");
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", String(saved === "dark"));

    toggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      StorageManager.setTheme(next);
      toggle.setAttribute("aria-pressed", String(next === "dark"));
    });
  };
  return { init };
})();
