import * as functions from "./functions.js";

class LightboxImage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add("lightbox-img");

        this.setAttribute("slot", "thumbnail");

        const imageLoader = () => {
            const preloadRadius = 0;

            if (functions.elementInViewport(this, preloadRadius)) {
                if (this.hasAttribute("thumbnail")) {
                    this.style.backgroundImage = "url('" + this.getAttribute("thumbnail") + "')";
                } else if (this.hasAttribute("src")) {
                    this.style.backgroundImage = "url('" + this.getAttribute("src") + "')";
                }

                window.removeEventListener("scroll", imageLoader);
                window.removeEventListener("resize", imageLoader);
            }
        }

        window.addEventListener("scroll", imageLoader);
        window.addEventListener("resize", imageLoader);

        imageLoader();
    }
}

window.customElements.define("lightbox-image", LightboxImage);