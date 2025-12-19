export function trackEvent(event: string, product: any) {
    if (process.env.NODE_ENV === 'development') {
        console.log("EVENT:", event, {
            productId: product._id || product.id,
            price: product.price,
            name: product.name
        });
    }
    // Integration point for GA/Pixel
    // if (window.gtag) window.gtag("event", event, { ... });
}
