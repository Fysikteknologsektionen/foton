/* eslint no-undef: 0 */ // So react (es-lint) does not complain about ShadyCSS not beeing defined (it is included in index.html)

import './gallery-img';

const ELEMENT_NAME = "lightbox-img";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
    }
  </style>
  <gallery-img aspect-ratio="1.5"></gallery-img>
`;

// ShadyCSS is included as a polyfill in index.html on browsers which does not support shadow DOM.
const hasShadyCss = typeof ShadyCSS !== "undefined";

hasShadyCss && ShadyCSS.prepareTemplate(template, ELEMENT_NAME);

/**
 * Encapsulates information about a image (raw source and thumbnail) and displays a thumbnail image for the lightbox.
 */
class LightboxImg extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._img = this.shadowRoot.querySelector("gallery-img");
  }

  static get observedAttributes() {
    return ["src", "alt", "thumbnail"];
  }

  connectedCallback() {
    hasShadyCss && ShadyCSS.styleElement(this);

    this.setAttribute("slot", "thumbnail");

    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "img");
    }

    this._updateAttributes();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._updateAttributes();
  }

  _updateAttributes() {
    this._img.setAttribute("alt", this.alt);
    this._img.setAttribute("src", this.thumbnail);
  }

  get src() {
    return this.getAttribute("src");
  }

  set src(value) {
    this.setAttribute("src", value);
  }

  get thumbnail() {
    // If there is no thumbnail, use the raw source instead.
    return this.hasAttribute("thumbnail")
      ? this.getAttribute("thumbnail")
      : this.src;
  }

  set thumbnail(value) {
    this.setAttribute("thumbnail", value);
  }

  get alt() {
    return this.getAttribute("alt");
  }

  set alt(value) {
    this.setAttribute("alt", value);
  }
}

window.customElements.define(ELEMENT_NAME, LightboxImg);
