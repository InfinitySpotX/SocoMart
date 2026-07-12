/**
 * validation.js
 * -----------------------------------------------------------------------
 * Declarative field validation shared by checkout and contact forms.
 * Rules are attached via [data-validate] attributes on inputs.
 * -----------------------------------------------------------------------
 */

const Validation = (() => {

  const RULES = {
    required: (value) => value.trim().length > 0 || "This field is required.",
    name: (value) => /^[a-zA-Z\s.'-]{2,60}$/.test(value.trim()) || "Enter a valid name.",
    phone: (value) => /^[6-9]\d{9}$/.test(value.trim()) || "Enter a valid 10-digit phone number.",
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Enter a valid email address.",
    pincode: (value) => /^\d{6}$/.test(value.trim()) || "Enter a valid 6-digit pincode.",
    minlength5: (value) => value.trim().length >= 5 || "Please provide more detail (min 5 characters)."
  };

  const validateField = (field) => {
    const rules = (field.dataset.validate || "").split(" ").filter(Boolean);
    const wrapper = field.closest(".field") || field.parentElement;
    const errorEl = wrapper?.querySelector(".error-msg");

    for (const rule of rules) {
      const validator = RULES[rule];
      if (!validator) continue;
      const result = validator(field.value);
      if (result !== true) {
        wrapper?.classList.add("invalid");
        if (errorEl) errorEl.textContent = result;
        return false;
      }
    }
    wrapper?.classList.remove("invalid");
    if (errorEl) errorEl.textContent = "";
    return true;
  };

  /** Validate every [data-validate] field inside a form; returns true if all pass */
  const validateForm = (form) => {
    const fields = Utils.qsa("[data-validate]", form);
    let allValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) allValid = false;
    });
    return allValid;
  };

  /** Wire live validation (on blur + on input after first error) */
  const bindLiveValidation = (form) => {
    Utils.qsa("[data-validate]", form).forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        const wrapper = field.closest(".field");
        if (wrapper?.classList.contains("invalid")) validateField(field);
      });
    });
  };

  return { validateField, validateForm, bindLiveValidation };
})();
