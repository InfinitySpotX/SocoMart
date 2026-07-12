/**
 * products.js
 * -----------------------------------------------------------------------
 * ProductManager: single source of truth for reading catalog data.
 * ProductRenderer: turns product objects into DOM markup.
 *
 * When the real backend arrives, only ProductManager.load() needs to
 * change (swap the local array read for a fetch() to Apps Script / API);
 * every screen that calls ProductManager.getAll() keeps working.
 * -----------------------------------------------------------------------
 */

const ProductManager = (() => {

  let catalog = [];

  const load = async () => {
    // Placeholder "database" call. Replace with:
    // const res = await fetch(SOCOMART_CONFIG.API_PRODUCTS_ENDPOINT);
    // catalog = await res.json();
    catalog = SOCOMART_PRODUCTS;
    return catalog;
  };

  const getAll = () => catalog;

  const getById = (id) => catalog.find((p) => p.id === id);

  const getByTag = (tag) => catalog.filter((p) => p.tags?.includes(tag));

  const getRelated = (product, limit = 4) =>
    catalog.filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit);

  const getCategories = () => [...new Set(catalog.map((p) => p.category))];

  const getBrands = () => [...new Set(catalog.map((p) => p.brand))];

  /**
   * Apply a filter/sort spec to the catalog and return the resulting list.
   * spec = { query, categories:[], brands:[], minPrice, maxPrice, sort }
   */
  const query = (spec = {}) => {
    let results = [...catalog];

    if (spec.query) {
      const q = spec.query.toLowerCase();
      results = results.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (spec.categories?.length) {
      results = results.filter((p) => spec.categories.includes(p.category));
    }
    if (spec.brands?.length) {
      results = results.filter((p) => spec.brands.includes(p.brand));
    }
    if (spec.minPrice != null) {
      results = results.filter((p) => p.offerPrice >= spec.minPrice);
    }
    if (spec.maxPrice != null) {
      results = results.filter((p) => p.offerPrice <= spec.maxPrice);
    }

    switch (spec.sort) {
      case "price-asc": results.sort((a, b) => a.offerPrice - b.offerPrice); break;
      case "price-desc": results.sort((a, b) => b.offerPrice - a.offerPrice); break;
      case "popular": results.sort((a, b) => b.reviewsCount - a.reviewsCount); break;
      case "newest": results.sort((a, b) => b.id.localeCompare(a.id)); break;
      default: break; // "featured" / default catalog order
    }

    return results;
  };

  return { load, getAll, getById, getByTag, getRelated, getCategories, getBrands, query };
})();


const ProductRenderer = (() => {

  const cardHTML = (product) => {
    const wishlist = StorageManager.getWishlist();
    const isWished = wishlist.includes(product.id);
    const discount = Math.round(100 - (product.offerPrice / product.price) * 100);
    const lowStock = product.stock > 0 && product.stock <= 5;
    const outOfStock = product.stock === 0;

    return `
      <article class="card product-card reveal" data-id="${product.id}">
        ${discount > 0 ? `<span class="tag-offer">${discount}% OFF</span>` : ""}
        ${outOfStock ? `<span class="tag-stock">Sold out</span>` : lowStock ? `<span class="tag-stock">Only ${product.stock} left</span>` : ""}
        <a href="product.html?id=${product.id}" class="media" aria-label="View ${Utils.escapeHtml(product.name)}">
          <img src="${product.image}" alt="${Utils.escapeHtml(product.name)}" loading="lazy" width="400" height="400">
        </a>
        <button class="wishlist-toggle ${isWished ? "active" : ""}" data-action="toggle-wishlist" data-id="${product.id}" aria-pressed="${isWished}" aria-label="Toggle wishlist for ${Utils.escapeHtml(product.name)}">♥</button>
        <div class="body">
          <span class="cat">${Utils.escapeHtml(product.category)}</span>
          <a href="product.html?id=${product.id}" class="name">${Utils.escapeHtml(product.name)}</a>
          <div class="rating"><span class="stars">${Utils.starString(product.rating)}</span><span>(${product.reviewsCount})</span></div>
          <div class="price-row">
            <span class="price-now mono">${Utils.formatCurrency(product.offerPrice)}</span>
            ${product.price > product.offerPrice ? `<span class="price-old mono">${Utils.formatCurrency(product.price)}</span>` : ""}
          </div>
          <div class="actions">
            <button class="btn btn-primary" data-action="add-to-cart" data-id="${product.id}" ${outOfStock ? "disabled" : ""}>
              ${outOfStock ? "Sold out" : "Add to cart"}
            </button>
          </div>
        </div>
      </article>
    `;
  };

  const skeletonHTML = () => `
    <div class="skeleton-card">
      <div class="media skeleton-block"></div>
      <div class="body">
        <div class="skeleton-line skeleton-block" style="width:40%"></div>
        <div class="skeleton-line skeleton-block" style="width:80%"></div>
        <div class="skeleton-line skeleton-block" style="width:60%"></div>
      </div>
    </div>
  `;

  const renderGrid = (container, products) => {
    if (!container) return;
    if (!products.length) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search term.</p>
        </div>`;
      return;
    }
    container.innerHTML = products.map(cardHTML).join("");
  };

  const renderSkeletons = (container, count = 8) => {
    if (!container) return;
    container.innerHTML = Array.from({ length: count }).map(skeletonHTML).join("");
  };

  return { cardHTML, renderGrid, renderSkeletons };
})();
