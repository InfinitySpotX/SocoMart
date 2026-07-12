/**
 * storage.js
 * -----------------------------------------------------------------------
 * Single abstraction over localStorage. Every other module reads/writes
 * persisted data ONLY through this manager, so the storage strategy
 * (localStorage today, IndexedDB / backend later) can change in one place.
 * -----------------------------------------------------------------------
 */

const StorageManager = (() => {

  const KEYS = Object.freeze({
    CART: "socomart_cart",
    WISHLIST: "socomart_wishlist",
    THEME: "socomart_theme",
    PREFERENCES: "socomart_preferences",
    RECENTLY_VIEWED: "socomart_recently_viewed",
    SEARCH_HISTORY: "socomart_search_history"
  });

  const get = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.error(`StorageManager: failed to read "${key}"`, err);
      return fallback;
    }
  };

  const set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`StorageManager: failed to write "${key}"`, err);
      return false;
    }
  };

  const remove = (key) => localStorage.removeItem(key);

  // ----- Convenience accessors -----
  const getCart = () => get(KEYS.CART, []);
  const setCart = (cart) => set(KEYS.CART, cart);

  const getWishlist = () => get(KEYS.WISHLIST, []);
  const setWishlist = (list) => set(KEYS.WISHLIST, list);

  const getTheme = () => get(KEYS.THEME, "light");
  const setTheme = (theme) => set(KEYS.THEME, theme);

  const getRecentlyViewed = () => get(KEYS.RECENTLY_VIEWED, []);
  const addRecentlyViewed = (productId) => {
    const list = getRecentlyViewed().filter((id) => id !== productId);
    list.unshift(productId);
    set(KEYS.RECENTLY_VIEWED, list.slice(0, 12));
  };

  const getSearchHistory = () => get(KEYS.SEARCH_HISTORY, []);
  const addSearchHistory = (term) => {
    if (!term || !term.trim()) return;
    const list = getSearchHistory().filter((t) => t.toLowerCase() !== term.toLowerCase());
    list.unshift(term.trim());
    set(KEYS.SEARCH_HISTORY, list.slice(0, 8));
  };

  return {
    KEYS, get, set, remove,
    getCart, setCart,
    getWishlist, setWishlist,
    getTheme, setTheme,
    getRecentlyViewed, addRecentlyViewed,
    getSearchHistory, addSearchHistory
  };
})();
