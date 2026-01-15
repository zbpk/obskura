// NEW: Hands-Off Add to Bag
function addToBag() {
    // 1. Automatically grab data from the page elements
    const productName = document.querySelector('h1')?.innerText || "Unknown Product";
    const productPrice = document.querySelector('.price')?.innerText.replace('$', '') || "0.00";
    
    // 2. Automatically grab the "Front" image
    const productImg = document.getElementById('img-front')?.getAttribute('src') || "";

    // 3. Add to cart
    cart.push({ 
        name: productName, 
        price: productPrice, 
        image: productImg 
    });

    // 4. Update UI and Open Cart
    updateCartUI();
    toggleCart(true); 

    // Optional: Visual feedback on the button
    const btn = document.querySelector('.add-to-cart-btn');
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "ADDED TO BAG";
        setTimeout(() => btn.innerText = originalText, 2000);
    }
}
