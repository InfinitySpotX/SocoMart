/**
 * config.js
 * -----------------------------------------------------------------------
 * Single source of truth for environment configuration.
 * When a backend (Google Apps Script, or later Node/Express) is ready,
 * this is the ONLY file that needs to change.
 * -----------------------------------------------------------------------
 */

const SOCOMART_CONFIG = Object.freeze({
  // Replace with your deployed Google Apps Script Web App URL.
  // Example: "https://script.google.com/macros/s/AKfycb.../exec"
  GOOGLE_SHEETS_ENDPOINT: "https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec",

  // Toggle: while no backend is connected, orders are only stored locally.
  ENABLE_REMOTE_ORDER_SYNC: false,

  CURRENCY_SYMBOL: "₹",
  CURRENCY_CODE: "INR",

  DELIVERY_CHARGE: 49,
  FREE_DELIVERY_THRESHOLD: 999,

  STORE_NAME: "SOCOMART",
  STORE_TAGLINE: "Everything, tagged fairly.",

  CONTACT: {
    whatsapp: "https://wa.me/910000000000",
    email: "support@socomart.example",
    instagram: "https://instagram.com/socomart",
    facebook: "https://facebook.com/socomart",
    youtube: "https://youtube.com/@socomart"
  }
});
