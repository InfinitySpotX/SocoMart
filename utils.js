/**
 * utils.js
 * -----------------------------------------------------------------------
 * Small, pure, reusable helper functions used across every module.
 * No global state is stored here — only stateless utilities.
 * -----------------------------------------------------------------------
 */

const Utils = (() => {

  /** Shorthand querySelector */
  const qs = (selector, scope = document) => scope.querySelector(selector);

  /** Shorthand querySelectorAll -> real array */
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  /** Format a number as currency using the configured symbol */
  const formatCurrency = (amount) => {
    const value = Number(amount) || 0;
    return `${SOCOMART_CONFIG.CURRENCY_SYMBOL}${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  /** Generate a reasonably unique id (timestamp + random suffix) */
  const generateId = (prefix = "id") => {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  };

  /** Debounce a function call */
  const debounce = (fn, delay = 300) => {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  /** Clamp a number between min and max */
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  /** Read a query-string parameter by name */
  const getQueryParam = (name) => new URLSearchParams(window.location.search).get(name);

  /** Build a star-rating string, e.g. "★★★★☆" */
  const starString = (rating) => {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  };

  /** Escape user-provided text before inserting into innerHTML */
  const escapeHtml = (str = "") =>
    str.replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));

  /** Create a DOM element from an HTML string (single root element) */
  const createFromHTML = (html) => {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  };

  /** Simple slugify for building shareable URLs */
  const slugify = (str = "") =>
    str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return {
    qs, qsa, formatCurrency, generateId, debounce, clamp,
    getQueryParam, starString, escapeHtml, createFromHTML, slugify
  };
})();
