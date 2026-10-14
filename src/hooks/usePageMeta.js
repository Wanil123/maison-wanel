import { useEffect } from "react";

const ensureMeta = (selector, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => {
      if (k !== "content") el.setAttribute(k, v);
    });
    document.head.appendChild(el);
  }
  if (attrs.content !== undefined) el.setAttribute("content", attrs.content);
};

const ensureLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export default function usePageMeta({ title, description, canonical } = {}) {
  useEffect(() => {
    if (title) {
      document.title = title.endsWith("Maison Wanél") ? title : `${title} — Maison Wanél`;
      ensureMeta('meta[property="og:title"]', { property: "og:title", content: title });
      ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    }
    if (description) {
      ensureMeta('meta[name="description"]', { name: "description", content: description });
      ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
      ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    }
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (url) {
      ensureMeta('meta[property="og:url"]', { property: "og:url", content: url });
      ensureLink("canonical", canonical || url);
    }

  }, [title, description, canonical]);
}
