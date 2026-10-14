import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock framer-motion to avoid runtime issues with jsdom
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    // motion.* returns plain elements in tests (no animations)
    motion: new Proxy(
      {},
      {
        get: (_t, prop) => {
          const Component = ({ children, ...rest }) => {
            const Tag = String(prop);
            return <Tag {...filterMotionProps(rest)}>{children}</Tag>;
          };
          Component.displayName = `motion.${String(prop)}`;
          return Component;
        },
      }
    ),
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

function filterMotionProps(props) {
  const skip = new Set([
    "initial", "animate", "exit", "transition", "variants",
    "whileHover", "whileTap", "whileInView", "viewport", "layout",
    "layoutId", "drag", "dragConstraints",
  ]);
  const out = {};
  for (const k of Object.keys(props)) {
    if (!skip.has(k)) out[k] = props[k];
  }
  return out;
}

// matchMedia stub
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// IntersectionObserver stub
global.IntersectionObserver = class {
  observe() {}
  disconnect() {}
  unobserve() {}
};
