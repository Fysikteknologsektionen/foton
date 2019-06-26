/* eslint no-undef: 0 */ // So react (es-lint) does not complain about ShadyCSS not beeing defined (it is included in index.html)

import loadingGif from './loading.gif';

const ELEMENT_NAME = "dynamic-img";

// Checks for intersection between image and viewport
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target._loadImage();
        observer.unobserve(entry.target);
      }
    });
  },
  { root: null, rootMargin: "0px", threshold: 0 }
);

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: inline-flex;
      overflow: hidden;
    }
    img {
      position: absolute;
      object-fit: contain;
      max-height: 100%;
      width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    img.hidden {
      display: none;
    }
    #inflator {
      width: 50px;
      height: 50px;

      max-width: 100%;
      max-height: 100%;
      visibility: hidden;
    }
    #inflator.hidden {
      display: none;
    }

    #loading {
      width: 50px;
      height: 50px;

      max-width: 100%;
      max-height: 100%;

      position: absolute;
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;

      background-image: url('${loadingGif}');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }
    #loading.hidden {
      display: none;
    }
  </style>
  <div id="inflator" class="visible" ></div>
  <div id="loading" class="visible" ></div>
  <img class="hidden" />
`;

// ShadyCSS is included as a polyfill in index.html on browsers which does not support shadow DOM.
const hasShadyCss = typeof ShadyCSS !== "undefined";

hasShadyCss && ShadyCSS.prepareTemplate(template, ELEMENT_NAME);

/**
 * An image which displays a loading icon while it is beeing loaded.
 * 
 * The image checks for intersection with the viewport, and loads first when this happens.
 * The image also maintains its aspect ratio when resized. It centers itself within its given bounding box.
 */
class DynamicImg extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._img = this.shadowRoot.querySelector("img");
    this._loading = this.shadowRoot.querySelector("#loading");
    this._inflator = this.shadowRoot.querySelector("#inflator");
  }

  static get observedAttributes() {
    return ["src", "alt"];
  }

  connectedCallback() {
    hasShadyCss && ShadyCSS.styleElement(this);

    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "img");
    }

    this._checkIntersections();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src") {
      this._checkIntersections();
    } else {
      this._img.setAttribute(name, newValue);
    }
  }

  // Puts the image into a state of loading a new image. Loading icon will be displayed etc.
  _checkIntersections() {
    if (!this.hasAttribute("loading")) {
      this._setLoading(true);

      observer.observe(this);
    }
  }

  // Actually loads the image.
  _loadImage() {
    // This preloads the image.
    var img = new Image();
    img.src = this.getAttribute("src");

    // Once the image has loaded, display it.
    img.onload = img.onerror = () => {
      this._img.src = img.src;

      this._setLoading(false);
    };
  }

  // Sets styling/attributes associated with loading/not loading
  _setLoading(value) {
    if (value) {
      this.setAttribute("loading", "");
    } else {
      this.removeAttribute("loading");
    }

    var a = value ? "hidden" : "visible";
    var b = value ? "visible" : "hidden";

    this._img.classList.replace(b, a);
    this._loading.classList.replace(a, b);
    this._inflator.classList.replace(a, b);

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
}

window.customElements.define(ELEMENT_NAME, DynamicImg);
