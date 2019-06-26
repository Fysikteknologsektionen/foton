/* eslint no-undef: 0 */ // So react (es-lint) does not complain about ShadyCSS not beeing defined (it is included in index.html)

import './gallery-grid';

// Removes all children from element
function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

const ELEMENT_NAME = "lightbox-modal";
const ANIMATION_SPEED = "0.3s";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .modal {
      z-index: 1;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: black;
      box-sizing: border-box;
      transition: var(--animation-speed, ${ANIMATION_SPEED}) ease;
      display: flex;
      flex-flow: column;
    }
    .modal.visible {
      visibility: visible;
      opacity: 1;
    }
    .modal.hidden {
      visibility: hidden;
      opacity: 0;
    }
    .button {
      transition: var(--animation-speed, ${ANIMATION_SPEED}) ease;
      color: white;
      user-select: none;
      cursor: pointer;
      opacity: 0.6;
      position: absolute;
      border-radius: 10px;
    }
    .button:hover {
      background-color: rgba(60, 60, 60, 0.6);
      opacity: 1;
    }
    .view-raw {
      margin: 10px;
      height: 50px;
      line-height: 50px;
      left: 0;
      padding: 0 20px 0 20px;
    }
    .close {
      margin: 10px;
      right: 0;
      text-align: center;
      font-weight: bold;
      font-size: 40px;
      width: 50px;
      height: 50px;
      line-height: 50px;
    }
    .arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
      font-size: 40px;
      padding: 30px;
    }
    .arrow.left {
      border-radius: 0 10px 10px 0;
      left: 0;
    }
    .arrow.right {
      border-radius: 10px 0 0 10px;
      right: 0;
    }

    .image-content {
      position: relative;
      flex: 1 1 auto;
    }
    .image-list {
      transition: var(--animation-speed, ${ANIMATION_SPEED}) ease;
      white-space: nowrap;
      position: absolute;
      height: 100%;
      width: 100%;
    }
    .slide {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
    .icon-content {
      flex: 0 0 auto;
      padding: 5px;
    }
    .icon-list {
      transition: var(--animation-speed, ${ANIMATION_SPEED}) ease;
      white-space: nowrap;
      position: relative;
      left: 50%;
      width: 21vh;
      height: 14vh;
    }
    .icon {
      transition: var(--animation-speed, ${ANIMATION_SPEED}) ease;
      display: inline-block;
      width: 100%;
      height: 100%;
      cursor: pointer;
      opacity: 0.6;
    }
    .icon.selected,
    .icon:hover {
      opacity: 1;
    }
  </style>
  <gallery-grid>
    <slot name="thumbnail" slot="image"></slot>
  </gallery-grid>
  <div class="modal hidden">
    <div class="image-content">
      <div class="image-list"></div>
      <div class="view-raw button">Öppna bild</div>
      <div class="close button">&times</div>
      <div class="arrow left button">&#10094;</div>
      <div class="arrow right button">&#10095;</div>
    </div>
    <div class="icon-content">
      <div class="icon-list"></div>
    </div>
  </div>
`;

// ShadyCSS is included as a polyfill in index.html on browsers which does not support shadow DOM.
const hasShadyCss = typeof ShadyCSS !== "undefined";

hasShadyCss && ShadyCSS.prepareTemplate(template, ELEMENT_NAME);

/**
 * Displays child lightbox-img components in a gallery-grid and creates a lightbox modal for them.
 */
class LightboxModal extends HTMLElement {
  constructor() {
    super();

    // If children are added, they need to recieve a click-listener and the lightbox modal needs to update.
    var observer = new MutationObserver((mutations, observer) => {
      mutations.some(mutation => {
        if (mutation.type === "childList") {
          this._childrenChanged();
          return true;
        }
        return false;
      });
    });

    observer.observe(this, { childList: true });

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._modal = this.shadowRoot.querySelector(".modal");
    this._imageList = this.shadowRoot.querySelector(".image-list");
    this._iconList = this.shadowRoot.querySelector(".icon-list");

    this.shadowRoot.querySelector(".close").onclick = () => this._hideImages();
    this.shadowRoot.querySelector(".left").onclick = () =>
      this._showImage(this._imageIndex - 1, true);
    this.shadowRoot.querySelector(".right").onclick = () =>
      this._showImage(this._imageIndex + 1, true);

    this._updateModal = true;
    this._imageIndex = 0;
  }

  connectedCallback() {
    hasShadyCss && ShadyCSS.styleElement(this);

    /* In Edge, I think the webcomponent polyfill is messing with the DOM-tree in a way so you cant rely on the MutationObserver to capture children beeing added.
     * (What happens is when the page is loaded and children are added to the lightbox-modal by React, the MutationObserver IS triggered, however the nodes in mutation.addedNodes
     * have not yet been added to the document, so you cant access them with e.g. querySelector. You cant access the dirctly from mutation.addedNodes either, since these elements are just
     * slots (which you cant do anything with) in Edge, while they are lightbox-images in chrome. If you console.log(mutation.addedNodes) inside the MutationObserver callback though
     * in edge, it seems like you have recieved the lightbox-img nodes, but you have not. It seems like the console display updates once the polyfills have had time to change the document.)
     *
     * So my workaround is this: Add a click-listener to the lightbox-modal which has capture set to true. This listener adds listeners to the lightbox-imgs, which now can be accessed
     * with querySelector since the polyfills have had time since the page load to rework the DOM tree. These listeners have capture set to false just to be safe (it really doesnt matter).
     * Since their listeners are invoked later, they will register clicks and callback to the lightbox-modal. This way the lightbox-modal can know wich lightbox-img was clicked.
     */
    this.addEventListener(
      "click",
      () => {
        this._childrenChanged();
      },
      { capture: true, once: true }
    );

    // Add simple touch support for swiping between images
    var startTouch = null;

    function getTouch(evt) {
      return evt.touches[0]; // Needs changing if JQuery is added.
    }

    document.addEventListener(
      "touchstart",
      evt => {
        startTouch = getTouch(evt);
      },
      false
    );
    document.addEventListener(
      "touchmove",
      evt => {
        var currentTouch = getTouch(evt);

        if (!startTouch || this._modal.classList.contains("hidden")) {
          return;
        }

        var dx = currentTouch.clientX - startTouch.clientX;
        var dy = currentTouch.clientY - startTouch.clientY;

        if (Math.abs(dx) > 100 && Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) {
            this._showImage(this._imageIndex - 1, true);
          } else {
            this._showImage(this._imageIndex + 1, true);
          }
          startTouch = null;
        }
      },
      false
    );
  }

  _childrenChanged() {
    this._updateModal = true;
    var images = this.querySelectorAll("lightbox-img");
    images.forEach((image, index) => {
      // Listen for clicks on the lightbox-img thumbnails wich should open the lightbox modal.
      image.addEventListener(
        "click",
        () => {
          this._showImage(index, false);
        },
        { capture: false }
      );
    });
  }

  _showImage(n, smooth) {
    var images = this.querySelectorAll("lightbox-img");

    if (this._updateModal) {
      clearChildren(this._imageList);
      clearChildren(this._iconList);

      images.forEach((image, index) => {
        var slide = document.createElement("dynamic-img");
        slide.classList.add("slide");
        slide.src = image.src;
        slide.alt = image.alt;
        this._imageList.appendChild(slide);

        var icon = document.createElement("dynamic-img");
        icon.classList.add("icon");
        icon.src = image.thumbnail;
        icon.alt = image.alt;
        this._iconList.appendChild(icon);

        icon.onclick = () => this._showImage(index, true);
      });

      this._updateModal = false;
    }

    n = n % images.length;
    if (n < 0) {
      n += images.length;
    }

    // Select the current icon
    var icons = this._iconList.querySelectorAll(".icon");
    icons.forEach(icon => {
      icon.classList.remove("selected");
    });
    icons[n].classList.add("selected");

    if (smooth) {
      // Allow animation of elements
      this._imageList.style.removeProperty("transition");
      this._iconList.style.removeProperty("transition");
    } else {
      // Don't allow animation of elements
      this._imageList.style.transition = "0s ease";
      this._iconList.style.transition = "0s ease";
    }

    // Slide the images and icons along
    this._imageList.style.transform = "translateX(" + -100 * n + "%)";
    this._iconList.style.transform = "translateX(" + (-100 * n - 50) + "%)";

    this._modal.classList.replace("hidden", "visible");
    // Disable scrollbars on the background
    document.body.style.overflow = "hidden";

    this._imageIndex = n;
  }

  _hideImages() {
    this._modal.classList.replace("visible", "hidden");
    document.body.style.removeProperty("overflow");
  }
}

window.customElements.define(ELEMENT_NAME, LightboxModal);
