import '@testing-library/jest-dom';

// JSDOM does not provide the browser resize API used by Recharts.
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(target) {
    this.callback([{ target, contentRect: { width: 800, height: 300 } }]);
  }

  unobserve() {}
  disconnect() {}
};
