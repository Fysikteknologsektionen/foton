// Custom category item web component
class CategoryItem extends HTMLElement {
    constructor() {
        super();
    }

    setProperty(name, info, description, img, link) {
        this.name = name;
        this.info = info;
        this.description = description;
        this.img = img;
        this.link = link;
    }

    connectedCallback() {
        // This method is called when the element is connected to the document. Don't initialize twice.
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        // Standardnamn på kategorier
        if (this.name.length == 0) {
            this.name = "Kategori";
        }

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("category-item-wrapper");

        this.wrapper.onclick = () => {
            window.location.href = this.link;
        };

        this.wrapperChild = document.createElement("div");
        this.wrapperChild.classList.add("category-item-wrapper-child");

        this.image = document.createElement("div");
        this.image.classList.add("category-item-img");
        this.wrapperChild.appendChild(this.image);

        this.text = document.createElement("div");
        this.text.classList.add("category-item-text");

        this.nameWrapper = document.createElement("div");
        this.nameWrapper.classList.add("category-item-name");
        this.nameWrapper.innerText = this.name;
        this.text.appendChild(this.nameWrapper);

        this.infoWrapper = document.createElement("div");
        this.infoWrapper.classList.add("category-item-info");
        if (this.info.length > 0) {
            this.infoWrapper.innerText = this.info;
        } else {
            this.infoWrapper.classList.add("empty");
        }
        this.text.appendChild(this.infoWrapper);

        this.descriptionWrapper = document.createElement("div");
        this.descriptionWrapper.classList.add("category-item-description");
        if (this.description.length > 0) {
            this.descriptionWrapper.innerText = this.description;
        } else {
            this.descriptionWrapper.classList.add("empty");
        }
        this.text.appendChild(this.descriptionWrapper);

        this.wrapperChild.appendChild(this.text);
        this.wrapper.appendChild(this.wrapperChild);
        this.appendChild(this.wrapper);

        this.attemptImageLoading();

        // When the view is scrolled, check if more images should be loaded in.
        window.addEventListener("scroll", () => {
            this.attemptImageLoading();
        });
        window.addEventListener("resize", () => {
            this.attemptImageLoading();
        });
    }

    // Checks if the thumbnail image should be loaded and loads it if that's the case.
    attemptImageLoading() {
        const aabb0 = this.image.getBoundingClientRect();
        const aabb1 = getViewportRect();

        // Is the thumbnail visible on screen?
        if (aabbCollision(aabb0, aabb1)) {
            if (this.img.length > 0) {
                this.image.style.backgroundImage = "url('" + this.img + "')";
                this.image.style.backgroundRepeat = "no-repeat";
                this.image.style.backgroundSize = "contain";
            } else {
                this.image.classList.add("empty");
            }
        }
    }
}


// Custom category list web component
class CategoryList extends HTMLElement {
    constructor() {
        super();
    }

    setProperties(categories) {
        this.categories = categories;
    }

    connectedCallback() {
        // This method is called when the element is connected to the document. Don't initialize twice.
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("category-list-wrapper");

        this.categoryItems = [];

        var i;
        for (i = 0; i < this.categories.length; i++) {
            const categoryItem = document.createElement("category-item");

            // Only display categories with a link (the ones you can go to).
            if (isSet(this.categories[i].link)) {
                categoryItem.setProperty(nullToEmpty(this.categories[i].name), 
                        nullToEmpty(this.categories[i].info),
                        nullToEmpty(this.categories[i].description),
                        isSet(this.categories[i].img) ? this.categories[i].img : null, 
                        this.categories[i].link);
                
                this.wrapper.append(categoryItem);

                this.categoryItems.push(categoryItem);
            }
        }

        this.appendChild(this.wrapper);

        const imgLoading = () => {
            var i;
            for (i = 0; i < this.categoryItems.length; i++) {
                this.categoryItems[i].attemptImageLoading();
            }
        };
    }
}


// Create custom web components
window.customElements.define("category-item", CategoryItem);
window.customElements.define("category-list", CategoryList);