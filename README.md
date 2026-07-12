# SOCOMART

A premium, all-in-one online mall built with **only HTML, CSS, and vanilla JavaScript** — no frameworks. Designed to run entirely on **GitHub Pages** with **Google Sheets** as a zero-cost first database, and architected so a real backend can be dropped in later without a rewrite.

## Design identity

- **Palette** — deep navy ink (`#12182B`) and warm paper white (`#F6F5F1`), with an amber "price-tag gold" accent (`#E8A33D`) and a teal used for savings/success (`#1E8A78`).
- **Type** — Space Grotesk (display), Inter (body), JetBrains Mono (prices, SKUs, specs) — the mono face ties every price back to the "price tag" concept.
- **Signature element** — the animated price-tag / barcode motif in the hero, echoed by the product card's punch-hole wishlist button and dashed "ticket" dividers throughout.

## Folder structure

```
SOCOMART/
├── index.html / products.html / product.html / categories.html
├── wishlist.html / cart.html / checkout.html
├── contact.html / about.html / privacy.html / terms.html
├── css/
│   ├── style.css        → variables, reset, typography, nav, buttons, cards, footer
│   ├── products.css     → hero, category grid, product grid, product detail page
│   ├── cart.css         → cart, wishlist, checkout
│   ├── forms.css        → form fields
│   ├── animations.css   → keyframes, toasts, skeletons, reveal-on-scroll
│   └── responsive.css   → 1440 / 1024 / 768 / 480 / 320 breakpoints
├── js/
│   ├── config.js         → single point of configuration (API endpoint, currency, delivery)
│   ├── utils.js          → formatting, DOM helpers, debounce, id generation
│   ├── storage.js        → localStorage abstraction (cart, wishlist, theme, history)
│   ├── notification.js   → animated toast notifications
│   ├── data.js            → sample product catalog (swap for a real API later)
│   ├── products.js       → ProductManager (query/filter/sort) + ProductRenderer
│   ├── navigation.js     → sticky nav, hamburger menu, theme toggle, badges
│   ├── search.js         → instant search suggestions
│   ├── cart.js           → CartManager + CartRenderer
│   ├── wishlist.js       → WishlistManager + WishlistRenderer
│   ├── validation.js     → declarative form validation
│   ├── api.js             → Google Sheets / future-backend integration boundary
│   ├── checkout.js       → checkout page controller
│   └── app.js              → bootstrap, event delegation, page routing
├── images/icons/ , assets/, data/
```

## Running locally

No build step. Just serve the folder statically, e.g.:

```bash
npx serve SOCOMART
# or
python3 -m http.server --directory SOCOMART 8000
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository (contents at the repo root, or in `/docs`).
2. Repo **Settings → Pages** → set the source branch/folder.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

## Connecting Google Sheets (first "database")

1. Create a Google Sheet with a header row matching the order fields:
   `Customer Name | Phone | Email | Address | District | State | Pincode | Product Names | Product IDs | Quantities | Prices | Order Total | Payment Method | Date | Time | Status`
2. In the Sheet, open **Extensions → Apps Script** and paste:

   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.customerName, data.phone, data.email, data.address,
       data.district, data.state, data.pincode,
       data.productNames, data.productIds, data.quantities, data.prices,
       data.orderTotal, data.paymentMethod, data.date, data.time, data.status
     ]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Web app** — set "Execute as: Me" and "Who has access: Anyone", then deploy and copy the Web App URL.
4. Paste that URL into `js/config.js`:

   ```javascript
   GOOGLE_SHEETS_ENDPOINT: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ENABLE_REMOTE_ORDER_SYNC: true,
   ```

That's it — every checkout now writes a row into your Sheet via `SheetsAPI.submitOrder()` in `js/api.js`. Until this is switched on, orders are still captured locally (`localStorage` key `socomart_orders`) so nothing is lost.

## Swapping in a real backend later

Everything reads product data through `ProductManager.load()` (in `js/products.js`) and writes orders through `SheetsAPI.submitOrder()` (in `js/api.js`). To move to Node/Express, Firebase, or anything else:

- Replace the body of `ProductManager.load()` with a `fetch()` to your products API.
- Replace the body of `SheetsAPI.submitOrder()` with a `fetch()` to your orders API.
- No HTML, CSS, or other JS module needs to change.

## Notes

- All state (cart, wishlist, theme, recently viewed, search history) persists via `localStorage` — see `js/storage.js`.
- Product images in `js/data.js` are placeholder Unsplash URLs — swap in real product photography for production.
- Replace the emoji icons in the nav/footer with an SVG icon set under `images/icons/` for a production-grade finish.
