/**
 * notification.js
 * -----------------------------------------------------------------------
 * Animated toast notifications: success / error / warning / info.
 * -----------------------------------------------------------------------
 */

const NotificationManager = (() => {

  let container = null;

  const ICONS = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i"
  };

  const ensureContainer = () => {
    if (container) return container;
    container = document.createElement("div");
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
    return container;
  };

  const show = (message, type = "info", title = "", duration = 3500) => {
    const root = ensureContainer();
    const toast = Utils.createFromHTML(`
      <div class="toast ${type}" role="status">
        <strong class="t-icon">${ICONS[type] || ICONS.info}</strong>
        <div>
          ${title ? `<div class="t-title">${Utils.escapeHtml(title)}</div>` : ""}
          <div class="t-msg">${Utils.escapeHtml(message)}</div>
        </div>
        <button class="t-close" aria-label="Dismiss notification">✕</button>
      </div>
    `);

    root.appendChild(toast);

    const dismiss = () => {
      toast.classList.add("closing");
      toast.addEventListener("animationend", () => toast.remove(), { once: true });
    };

    toast.querySelector(".t-close").addEventListener("click", dismiss);
    setTimeout(dismiss, duration);
  };

  return {
    success: (msg, title = "Success") => show(msg, "success", title),
    error: (msg, title = "Error") => show(msg, "error", title),
    warning: (msg, title = "Warning") => show(msg, "warning", title),
    info: (msg, title = "") => show(msg, "info", title)
  };
})();
