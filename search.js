/**
 * search.js
 * -----------------------------------------------------------------------
 * Instant search: shows a live suggestions dropdown as the user types
 * in any nav search box, and redirects to products.html?q=... on submit.
 * -----------------------------------------------------------------------
 */

const SearchManager = (() => {

  const init = () => {
    Utils.qsa("[data-search-form]").forEach((form) => {
      const input = Utils.qs("input", form);
      const wrap = form.closest(".search-wrap") || form;
      let suggestionsBox = Utils.qs(".search-suggestions", wrap);

      if (!suggestionsBox && input) {
        suggestionsBox = document.createElement("div");
        suggestionsBox.className = "search-suggestions";
        wrap.appendChild(suggestionsBox);
      }

      if (!input) return;

      input.addEventListener("input", Utils.debounce(() => {
        renderSuggestions(input.value, suggestionsBox);
      }, 200));

      input.addEventListener("focus", () => renderSuggestions(input.value, suggestionsBox));

      document.addEventListener("click", (e) => {
        if (!wrap.contains(e.target)) suggestionsBox?.classList.remove("open");
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        submitSearch(input.value);
      });
    });
  };

  const renderSuggestions = (term, box) => {
    if (!box) return;
    if (!term || term.trim().length < 2) {
      box.classList.remove("open");
      box.innerHTML = "";
      return;
    }
    const results = ProductManager.query({ query: term }).slice(0, 6);
    if (!results.length) {
      box.innerHTML = `<div class="suggestion-item"><span class="s-name">No matches for "${Utils.escapeHtml(term)}"</span></div>`;
      box.classList.add("open");
      return;
    }
    box.innerHTML = results.map((p) => `
      <a class="suggestion-item" href="product.html?id=${p.id}">
        <img src="${p.image}" alt="" loading="lazy">
        <span class="s-name">${Utils.escapeHtml(p.name)}</span>
        <span class="s-price mono">${Utils.formatCurrency(p.offerPrice)}</span>
      </a>
    `).join("");
    box.classList.add("open");
  };

  const submitSearch = (term) => {
    if (!term.trim()) return;
    StorageManager.addSearchHistory(term.trim());
    window.location.href = `products.html?q=${encodeURIComponent(term.trim())}`;
  };

  return { init, submitSearch };
})();
