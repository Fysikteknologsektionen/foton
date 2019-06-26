/* eslint no-undef: 0 */ // So react (es-lint) does not complain about ShadyCSS not beeing defined (it is included in index.html)

const ELEMENT_NAME = "gallery-grid";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      grid-gap: 20px 20px;
    }
  </style>
  <slot name="image"></slot>
`;

// ShadyCSS is included as a polyfill in index.html on browsers which does not support shadow DOM.
const hasShadyCss = typeof ShadyCSS !== "undefined";

hasShadyCss && ShadyCSS.prepareTemplate(template, ELEMENT_NAME);

/**
 * Reusable component wich displays children in columns (A grid if all children are of equal size)
 */
class GalleryGrid extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    hasShadyCss && ShadyCSS.styleElement(this);

    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "feed");
    }
  }
}

window.customElements.define(ELEMENT_NAME, GalleryGrid);
