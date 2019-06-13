import * as functions from "./functions.js";

const template = document.createElement("template");
template.innerHTML = `
<div class="category-wrapper">
    <div class="category-image"></div>
    <div class="category-text">
        <div class="category-title"></div>
        <div class="category-info"></div>
        <div class="category-description"></div>
    </div>
</div>
`;

class CategoryItem extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add("category-itm");

        this.appendChild(template.content.cloneNode(true));

        this._image = this.querySelector(".category-image");
        this._title = this.querySelector(".category-title");
        this._info = this.querySelector(".category-info");
        this._description = this.querySelector(".category-description");

        if (this.hasAttribute("title")) {
            this._title.innerText = this.getAttribute("title");
        } else {
            this._title.innerText = "Kategori";
        }
        if (this.hasAttribute("info")) {
            this._info.innerText = this.getAttribute("info");
        }
        if (this.hasAttribute("description")) {
            this._description.innerText = this.getAttribute("description");
        }

        const imageLoader = () => {
            const preloadRadius = 0;

            if (functions.elementInViewport(this, preloadRadius)) {
                if (this.hasAttribute("img")) {
                    this._image.style.backgroundImage = "url('" + this.getAttribute("img") + "')";
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

window.customElements.define("category-item", CategoryItem);