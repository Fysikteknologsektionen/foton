// Custom gallery thumbnail web component
class ThumbnailComponent extends HTMLElement {
    constructor() {
        super();

        this.lightboxes = [];
    }

    setProperties(src, title) {
        this.src = src;
        this.title = title;
    }

    connectedCallback() {
        // This method is called when the element is connected to the document. Don't initialize twice.
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("thumbnail-component-wrapper");

        this.img = document.createElement("div");
        this.img.classList.add("thumbnail-component-img");

        if (isSet(this.title) && this.title.length > 0) {
            this.text = document.createElement("div");
            this.text.classList.add("thumbnail-component-title");
            this.text.innerText = this.title;

            this.img.appendChild(this.text);
        }

        this.img.onclick = () => {
            var i;
            for (i = 0; i < this.lightboxes.length; i++) {
                this.lightboxes[i].pane.showImage(this.lightboxes[i].index);
            }
        };

        this.wrapper.appendChild(this.img);
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
        const aabb0 = this.img.getBoundingClientRect();
        const aabb1 = getViewportRect();

        // Is the thumbnail visible on screen?
        if (aabbCollision(aabb0, aabb1)) {
            this.img.style.backgroundImage = "url('" + this.src + "')";
            this.img.style.backgroundRepeat = "no-repeat";
            this.img.style.backgroundSize = "contain";
        }
    }

    addLightboxPane(lightboxPane, index) {
        this.lightboxes.push({"pane" : lightboxPane, "index" : index});
    }
}


// Custom thumbnail grid web component
class ThumbnailGrid extends HTMLElement {
    constructor() {
        super();
    }

    setProperties(thumbnailComponents) {
        this.thumbnailComponents = thumbnailComponents;
    }

    connectedCallback() {
        // This method is called when the element is connected to the document. Don't initialize twice.
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("thumbnail-grid-wrapper");

        this.wrapperChild = document.createElement("div");
        this.wrapperChild.classList.add("thumbnail-grid-wrapper-child");

        var i;
        for (i = 0; i < this.thumbnailComponents.length; i++) {
            this.wrapperChild.appendChild(this.thumbnailComponents[i]);
        }

        this.wrapper.appendChild(this.wrapperChild);
        this.appendChild(this.wrapper);
    }
}


// Custom lightbox icon web component
class LightboxIcon extends HTMLElement {
    constructor() {
        super();
    }

    setProperties(src, lightboxPane, index) {
        this.src = src;
        this.lightboxPane = lightboxPane;
        this.index = index;
    }

    connectedCallback() {
        // This method is called when the element is connected to the document. Don't initialize twice.
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        this.img = document.createElement("div");
        this.img.classList.add("lightbox-icon-img");

        this.img.onclick = () => {
            this.lightboxPane.showImage(this.index, true);
        };

        this.appendChild(this.img);
    }

    loadImage() {
        this.img.style.backgroundImage = "url('" + this.src + "')";
        this.img.style.backgroundRepeat = "no-repeat";
        this.img.style.backgroundSize = "contain";
    }
}


// Custom lightbox image web component
class LightboxImage extends HTMLElement {
    constructor() {
        super();
    }

    setProperties(src, title, description) {
        this.src = src;
        this.title = title;
        this.description = description;
    }

    connectedCallback() {
        // This method is called when the element is connected to the document. Don't initialize twice.
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        this.img = document.createElement("div");
        this.img.classList.add("lightbox-image-img");
        this.appendChild(this.img);
    }

    loadImage() {
        this.img.style.backgroundImage = "url('" + this.src + "')";
        this.img.style.backgroundRepeat = "no-repeat";
        this.img.style.backgroundSize = "contain";
    }
}


// Custom lightbox pane web component
class LightboxPane extends HTMLElement {
    constructor() {
        super();

        this.imageIndex = 0;
    }

    setProperties(thumbnailComponents, images) {
        this.thumbnailComponents = thumbnailComponents;
        this.images = images;
    }

    connectedCallback() {
        // This method is called when the element is connected to the document. Don't initialize twice.
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        this.lightboxImages = [];
        this.lightboxIcons = [];

        var i;
        for (i = 0; i < this.images.length; i++) {
            const lightboxImage = document.createElement("lightbox-image");
            lightboxImage.setProperties(this.images[i].src, this.images[i].title, this.images[i].description);
            this.lightboxImages.push(lightboxImage);

            const lightboxIcon = document.createElement("lightbox-icon");
            lightboxIcon.setProperties(this.images[i].thumbnail, this, i);
            this.lightboxIcons.push(lightboxIcon);
        }

        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("lightbox-pane-wrapper", "hidden")
        this.wrapper.style.zIndex = 1;
        this.wrapper.style.position = "fixed";
        this.wrapper.style.left = 0;
        this.wrapper.style.top = 0;
        this.wrapper.style.width = "100%";
        this.wrapper.style.height = "100%";
        this.wrapper.style.overflowX = "hidden";

        this.close = document.createElement("div");
        this.close.classList.add("lightbox-pane-close");
        this.close.innerHTML = "&times";

        this.close.onclick = () => {
            this.hideLightbox();
        };

        this.wrapper.appendChild(this.close);

        this.titleWrapper = document.createElement("div");
        this.titleWrapper.classList.add("lightbox-pane-title");
        this.wrapper.appendChild(this.titleWrapper);

        this.imageContent = document.createElement("div");
        this.imageContent.classList.add("lightbox-pane-image-content");

        this.imageList = document.createElement("div");
        this.imageList.classList.add("lightbox-pane-image-list");

        for (i = 0; i < this.lightboxImages.length; i++) {
            this.imageList.appendChild(this.lightboxImages[i]);
        }

        this.imageContent.appendChild(this.imageList);

        this.left = document.createElement("div");
        this.left.classList.add("lightbox-pane-arrow", "left");
        this.left.innerHTML = "&#10094;";

        this.left.onclick = () => {
            this.showImage(this.imageIndex - 1, true);
        };

        this.imageContent.appendChild(this.left);

        this.right = document.createElement("div");
        this.right.classList.add("lightbox-pane-arrow", "right");
        this.right.innerHTML = "&#10095;";

        this.right.onclick = () => {
            this.showImage(this.imageIndex + 1, true);
        };

        this.imageContent.appendChild(this.right);
        this.wrapper.appendChild(this.imageContent);

        this.iconList = document.createElement("div");
        this.iconList.classList.add("lightbox-pane-icon-list");

        for (i = 0; i < this.lightboxIcons.length; i++) {
            this.iconList.appendChild(this.lightboxIcons[i]);
        }

        this.wrapper.appendChild(this.iconList);

        this.description = document.createElement("div");
        this.description.classList.add("lightbox-pane-description");
        this.wrapper.appendChild(this.description);

        this.appendChild(this.wrapper);

        for (i = 0; i < this.thumbnailComponents.length; i++) {
            this.thumbnailComponents[i].addLightboxPane(this, i);
        }

        // Enable swiping on mobile
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
            if (!startTouch || !currentTouch) {
                return;
            }

            const dx = currentTouch.clientX - startTouch.clientX;
            const dy = currentTouch.clientY - startTouch.clientY;

            // Lower length limit of 100 px for gesture to be considered swipe
            if (Math.abs(dx) > 100 && Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) {
                    this.showImage(this.imageIndex - 1, true);
                } else {
                    this.showImage(this.imageIndex + 1, true);
                }
            }

            startTouch = null;
            currentTouch = null;
        }, false);
    }

    hideLightbox() {
        this.wrapper.classList.add("hidden");
        this.wrapper.classList.remove("visible");

        document.documentElement.style.overflow = "";
    }

    showImage(n, smooth) {
        this.wrapper.classList.remove("hidden");
        this.wrapper.classList.add("visible");

        document.documentElement.style.overflow = "hidden";

        n = loop(n, this.lightboxImages.length);

        // Select correnct icon
        var i;
        for (i = 0; i < this.lightboxIcons.length; i++) {
            this.lightboxIcons[i].img.classList.remove("active");
        }
        this.lightboxIcons[n].img.classList.add("active");

        // Load in visible images (an preload ones within preloadRadius of visible images)
        // First load the image were currently looking at (this order is probably not respected by the browser though...).
        this.lightboxImages[n].loadImage();

        const preloadRadius = 0; // Defines how many images to the side of the one beeing looked at will be preloaded.
        for (i = n - preloadRadius; i <= n + preloadRadius; i++) {
            this.lightboxImages[loop(i, this.lightboxImages.length)].loadImage();
        }

        const aabb0 = this.lightboxIcons[0].img.getBoundingClientRect();

        const radiusInIcons = Math.ceil(getViewportWidth() / (2 * aabb0.width)) - preloadRadius;
        for (i = n - radiusInIcons; i <= n + radiusInIcons; i++) {
            this.lightboxIcons[loop(i, this.lightboxIcons.length)].loadImage();
        }

        // Selects whether to animate transition between images.
        if (isSet(smooth)) {
            this.imageList.style.transition = "";
            this.iconList.style.transition = "";
        } else {
            this.imageList.style.transition = "0s ease";
            this.iconList.style.transition = "0s ease";
        }

        // Slide the images along
        this.imageList.style.left = (-100 * n) + "%";

        // Slide the icons along
        this.iconList.style.left = "calc(50% - var(--lightbox-icon-w) * (2 * " + n + " + 1) / 2)";

        // Display the title
        if (isSet(this.images[n].title)) {
            this.titleWrapper.innerText = this.images[n].title;
        } else {
            this.titleWrapper.innerText = "";
        }

        // Display the description
        if (isSet(this.images[n].description)) {
            this.description.innerText = this.images[n].description;
        } else {
            this.description.innerText = "";
        }

        this.imageIndex = n;
    }
}


// Custom gallery component web component
class GalleryComponent extends HTMLElement {
    constructor() {
        super();
    }

    setProperties(images) {
        this.images = images;
    }

    connectedCallback() {
        // This method is called when the element is connected to the document. Don't initialize twice.
        if (this.initialized) {
            return;
        }
        this.initialized = true;

        var thumbnails = [];
        var nonEmptyImages = [];

        var i;
        for (i = 0; i < this.images.length; i++) {
            // If the thumbnail does'nt extist, use the raw image instead.
            this.images[i].thumbnail = isSet(this.images[i].thumbnail) ? this.images[i].thumbnail : this.images[i].src;

            // Only display thumbnails with an image.
            if (isSet(this.images[i].thumbnail)) {
                const thumbnailComponent = document.createElement("thumbnail-component");
                thumbnailComponent.setProperties(this.images[i].thumbnail, isSet(this.images[i].title) ? this.images[i].title : "");
                thumbnails.push(thumbnailComponent);

                nonEmptyImages.push(this.images[i]);
            }
        }

        // Return if there are no images to show
        if (nonEmptyImages.length == 0) {
            return;
        }

        this.thumbnailGrid = document.createElement("thumbnail-grid");
        this.thumbnailGrid.setProperties(thumbnails);

        this.lightboxPane = document.createElement("lightbox-pane");
        this.lightboxPane.setProperties(thumbnails, nonEmptyImages);

        this.appendChild(this.thumbnailGrid);
        this.appendChild(this.lightboxPane);
    }
}


// Create custom web components
window.customElements.define("thumbnail-component", ThumbnailComponent);
window.customElements.define("thumbnail-grid", ThumbnailGrid);
window.customElements.define("lightbox-icon", LightboxIcon);
window.customElements.define("lightbox-image", LightboxImage);
window.customElements.define("lightbox-pane", LightboxPane);
window.customElements.define("gallery-component", GalleryComponent);