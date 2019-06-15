export function getViewportWidth() {
    return window.innerWidth || 0;
}

export function getViewportHeight() {
    return window.innerHeight || 0;
}

export function elementInViewport(elem, margin) {
    const aabb = elem.getBoundingClientRect();
    const vw = getViewportWidth();
    const vh = getViewportHeight();

    return aabb.right >= -margin && aabb.left <= vw + margin && aabb.bottom >= -margin && aabb.top <= vh + margin;
}

export function mod(n, m) {
    const mod = n % m;
    if (mod >= 0) {
        return mod;
    }
    return mod + m;
}