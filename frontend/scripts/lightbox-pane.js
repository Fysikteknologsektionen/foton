import * as functions from "./functions.js";

const template = document.createElement("template");
template.innerHTML = `
<div> 
    <slot name="thumbnail"></slot>
</div>
<div class="lightbox-backdrop hidden">
    <div class="lightbox-close">&times</div>
    <div class="lightbox-image-content">
        <div class="lightbox-arrow left">&#10094;</div>
        <div class="lightbox-arrow right">&#10095;</div>
        <div class="lightbox-image-list"></div>
    </div>
    <div class="lightbox-icon-list"></div>
    <div class="lightbox-description"></div>
</div>
`;

class LightboxPane extends HTMLElement {
    constructor() {
        super();

        this._slideShowIndex = 0;
    }

    connectedCallback() {
        this.classList.add("lightbox-pn");

        this.appendChild(template.content.cloneNode(true));

        this._images = this.querySelectorAll("lightbox-image");
        this._backdrop = this.querySelector(".lightbox-backdrop");
        this._imageList = this.querySelector(".lightbox-image-list");
        this._iconList = this.querySelector(".lightbox-icon-list");
        this._description = this.querySelector(".lightbox-description");

        const _this = this;
        this._images.forEach(function (image, index) {
            const slide = document.createElement("div");
            slide.classList.add("lightbox-slide");
            if (image.hasAttribute("src")) {
                slide.src = image.getAttribute("src");
            } else if (image.hasAttribute("thumbnail")) {
                slide.src = image.getAttribute("thumbnail");
            }
            _this._imageList.appendChild(slide);

            const icon = document.createElement("div");
            icon.classList.add("lightbox-icon");
            if (image.hasAttribute("thumbnail")) {
                icon.src = image.getAttribute("thumbnail");
            } else if (image.hasAttribute("src")) {
                icon.src = image.getAttribute("src");
            }
            _this._iconList.appendChild(icon);

            image.onclick = () => {
                _this._showLightbox(index, false);
            };

            const i = index;;
            icon.onclick = () => {
                _this._showLightbox(i, true);
            };
        });

        this.querySelector(".lightbox-close").onclick = () => this._hideImages();
        this.querySelector(".right").onclick = () => this._showLightbox(this._slideShowIndex + 1, true);
        this.querySelector(".left").onclick = () => this._showLightbox(this._slideShowIndex - 1, true);

        var startTouch = null;
        var currentTouch = null;

        function getTouch(evt) {
            return evt.touches[0]; // Needs changing if JQuery is added.
        };

        document.addEventListener("touchstart", (evt) => {
            startTouch = getTouch(evt);
        }, false);
        document.addEventListener("touchmove", (evt) => {
            currentTouch = getTouch(evt);
        }, false);
        document.addEventListener("touchend", (evt) => {
            if (!startTouch || !currentTouch || this._backdrop.classList.contains("hidden")) {
                return;
            }

            const dx = currentTouch.clientX - startTouch.clientX;
            const dy = currentTouch.clientY - startTouch.clientY;

            if (Math.abs(dx) > 100 && Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) {
                    this._showLightbox(this._slideShowIndex - 1, true);
                } else {
                    this._showLightbox(this._slideShowIndex + 1, true);
                }
            }

            startTouch = null;
            currentTouch = null;
        }, false);
    }

    _showLightbox(n, smooth) {
        this._backdrop.style.transition = "";
        this._backdrop.className = this._backdrop.className.replace("hidden", "visible");
        document.documentElement.style.overflow = "hidden";

        const slides = this._imageList.querySelectorAll(".lightbox-slide");
        const icons = this._iconList.querySelectorAll(".lightbox-icon");

        n = functions.mod(n, slides.length);

        const preloadRadius = 0;

        var i;
        for (i = n - preloadRadius; i <= n + preloadRadius; i++) {
            const index = functions.mod(i, slides.length);
            slides[index].style.backgroundImage = "url('" + slides[index].src + "')";
        }

        const aabb0 = icons[0].getBoundingClientRect();
        const viewportWidthInIcons = functions.getViewportWidth() / aabb0.width;

        const r = Math.ceil(viewportWidthInIcons / 2) + preloadRadius;
        
        for (i = n - r; i <= n + r; i++) {
            const index = functions.mod(i, slides.length);
            icons[index].style.backgroundImage = "url('" + icons[index].src + "')";
        }

        icons[this._slideShowIndex].classList.remove("active");
        icons[n].classList.add("active");

        if (smooth) {
            this._imageList.style.transition = "";
            this._iconList.style.transition = "";
        } else {
            this._imageList.style.transition = "0s ease";
            this._iconList.style.transition = "0s ease";
        }

        this._imageList.style.left = (-100 * n) + "%";
        this._iconList.style.left = "calc(50% - var(--lightbox-icon-w) * (2 * " + n + " + 1) / 2)";

        if (this._images[n].hasAttribute("description")) {
            this._description.innerText = this._images[n].getAttribute("description");
        } else {
            this._description.innerText = "";
        }

        this._slideShowIndex = n;
    }

    _hideImages() {
        this._backdrop.className = this._backdrop.className.replace("visible", "hidden");
        document.documentElement.style.overflow = "";
    }

}

window.customElements.define("lightbox-pane", LightboxPane);