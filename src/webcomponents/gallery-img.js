/* eslint no-undef: 0 */ // So react (es-lint) does not complain about ShadyCSS not beeing defined (it is included in index.html)

import './dynamic-img';

const ELEMENT_NAME = "gallery-img";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }
    :host,
    dynamic-img {
      border-radius: 10px;
    }
    dynamic-img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    dynamic-img[loading] {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.1);
    }
  </style>
  <dynamic-img></dynamic-img>
`;

// ShadyCSS is included as a polyfill in index.html on browsers which does not support shadow DOM.
const hasShadyCss = typeof ShadyCSS !== "undefined";

hasShadyCss && ShadyCSS.prepareTemplate(template, ELEMENT_NAME);
/**
 * Reusable component wich wraps and styles a dynamic-img.
 *
 * The dynamic-img does not know its final aspect ratio when the image is loading (since it needs to download the image first).
 * This causes problems with loading when multiple dynamic-imgs are listed after eachother. 
 * When the page is loaded, only the loading icon will be displayed, and it can be much smaller than the final image.
 * This causes more dynamic-imgs to fit on the screen, which triggers their loading. Thus a lot of images can be unnecessarily loaded.
 * (It also looks bad). This class gives images a predefined aspect ratio (given by the aspect-ratio property).
 * This solves these problems and makes the loading of images much nicer to look at.
 * You can see it in action in chrome with right-click -> Inspect -> Network -> No throttling -> Fast 3G
 * and then reload the page.
 */
class GalleryImg extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._img = this.shadowRoot.querySelector("dynamic-img");
  }

  static get observedAttributes() {
    return ["src", "alt", "aspect-ratio"];
  }

  connectedCallback() {
    hasShadyCss && ShadyCSS.styleElement(this);

    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "img");
    }

    this._img.setAttribute("src", this.getAttribute("src"));
    this._img.setAttribute("alt", this.getAttribute("alt"));

    this._updateAspectRatio();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src" || name === "alt") {
      this._img.setAttribute(name, newValue);
    } else if (name === "aspect-ratio") {
      this._updateAspectRatio();
    }
  }

  _updateAspectRatio() {
    var aspectRatio = this.hasAttribute("aspect-ratio")
      ? this.getAttribute("aspect-ratio")
      : 1;

    this.style.paddingBottom = 100 / aspectRatio + "%";

    hasShadyCss && ShadyCSS.styleSubtree(this);
  }

  get src() {
    return this.getAttribute("src");
  }

  set src(value) {
    this.setAttribute("src", value);
  }

  get alt() {
    return this.getAttribute("alt");
  }

  set alt(value) {
    this.setAttribute("alt", value);
  }

  get aspectRatio() {
    return this.getAttribute("aspect-ratio");
  }

  set aspectRatio(value) {
    this.setAttribute("aspect-ratio", value);
  }
}

window.customElements.define(ELEMENT_NAME, GalleryImg);
