export const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

export const safeQuerySelector = (selector: string) => {
  if (!isBrowser()) return null;
  if (!selector || selector.startsWith("/")) return null;
  try {
    return document.querySelector(selector);
  } catch (e) {
    console.warn(`Invalid selector passed: "${selector}"`, e);
    return null;
  }
};


export const safeGetElementById = (id: string) => {
  if (!isBrowser()) return null;
  return document.getElementById(id);
};

export const safeScrollIntoView = (element: HTMLElement | null, options?: ScrollIntoViewOptions) => {
  if (!isBrowser() || !element) return;
  element.scrollIntoView(options);
};

export const safeWindow = {
  get location() {
    return isBrowser() ? window.location : null;
  },
  get history() {
    return isBrowser() ? window.history : null;
  },
  get innerWidth() {
    return isBrowser() ? window.innerWidth : 0;
  },
  get innerHeight() {
    return isBrowser() ? window.innerHeight : 0;
  },
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
    if (!isBrowser()) return;
    window.addEventListener(type, listener);
  },
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
    if (!isBrowser()) return;
    window.removeEventListener(type, listener);
  }
}; 