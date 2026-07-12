/**
 * wishlist.js
 * -----------------------------------------------------------------------
 * WishlistManager: toggle/add/remove, persisted via StorageManager.
 * WishlistRenderer: renders the wishlist page grid.
 * -----------------------------------------------------------------------
 */

const WishlistManager = (() => {

  const getIds = () => StorageManager.getWishlist();

  const isWished = (productId) => getIds().includes(productId);

  const toggle = (productId) => {
    const ids = getIds();
    const idx = ids.indexOf(productId);
    const product = ProductManager.getById(productId);

    if (idx > -1) {
      ids.splice(idx, 1);
      NotificationManager.info(`${product?.name || "Item"} removed from wishlist.`);
    } else {
      ids.push(productId);
      NotificationManager.success(`${product?.name || "Item"} added to wishlist.`, "Wishlist");
    }
    StorageManager.setWishlist(ids);
    NavigationManager.updateBadges();
    return ids.includes(productId);
  };

  const remove = (productId) => {
    StorageManager.setWishlist(getIds().filter((id) => id !== productId));
    NavigationManager.updateBadges();
  };

  const getEnrichedItems = () =>
    getIds().map((id) => ProductManager.getById(id)).filter(Boolean);

  return { getIds, isWished, toggle, remove, getEnrichedItems };
})();


const WishlistRenderer = (() => {
  const renderWishlistPage = () => {
    const grid = Utils.qs("[data-wishlist-grid]");
    const emptyState = Utils.qs("[data-wishlist-empty]");
    if (!grid) return;

    const items = WishlistManager.getEnrichedItems();

    if (!items.length) {
      grid.innerHTML = "";
      emptyState?.classList.remove("hidden");
      return;
    }
    emptyState?.classList.add("hidden");
    ProductRenderer.renderGrid(grid, items);
  };

  return { renderWishlistPage };
})();
