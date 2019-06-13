// Test if variable has been set
function isSet(a) {
    return !(a == null || (typeof a === "undefined"));
}

// Checks collision between two rectangles
function aabbCollision(aabb0, aabb1) {
    return aabb0.right >= aabb1.left && aabb0.bottom >= aabb1.top && aabb0.left <= aabb1.right && aabb0.top <= aabb1.bottom;
}

// Loops the index n around the numberline with length m
function loop(n, m) {
    const mod = n % m;
    if (mod >= 0) {
        return mod;
    }
    return mod + m;
}

function getViewportWidth() {
    return window.innerWidth || 0;
}

function getViewportHeight() {
    return window.innerHeight || 0;
}

// Returns a rectangle representation of the viewport
function getViewportRect() {
    const w = getViewportWidth();
    const h = getViewportHeight();
    return {"x" : 0, "y" : 0, "width" : w, "height" : h, "left" : 0, "right" : w, "top" : 0, "bottom" : h};
}

// Returns empty string if input is undefined or null, otherwise it returns the input
function nullToEmpty(a) {
    return isSet(a) ? a : "";
}
