export const triggerCartUpdated = () => {
  window.dispatchEvent(new Event("cartUpdated"));
};

