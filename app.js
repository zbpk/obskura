// --- OBSKURA GLOBAL ENGINE ---
let cart = JSON.parse(localStorage.getItem('obskuraCart')) || [];

// 1. PATH RESOLUTION: Detect if we are inside the 'products' folder
const isProductPage = window.location.pathname.includes('/products/');
const rootPath = isProductPage ? '../' : '';
const checkoutPath = isProductPage ? '../checkout.html' : 'checkout.html';

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const countLabels = document.querySelectorAll('.cart-count');
    const subtotalLabel = document.getElementById('cartSubtotal');
    
    // Update all BAG (0) indicators in the top nav
    countLabels.forEach(label => {
        label.innerText = cart.length;
        // Add a little pop animation when number changes
        label.classList.add('cart-bounce');
        setTimeout(() => label.classList.remove('cart-bounce'), 400);
    });

    localStorage.setItem('obskuraCart', JSON.stringify(cart));

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; opacity:0.3; margin-top:80px; font-size:0.7rem; letter-spacing:2px;">YOUR BAG IS EMPTY</p>';
        if (subtotalLabel) subtotalLabel.innerText = '$0.00';
        return;
    }

    // Build the cart items HTML
    container.innerHTML = cart.map((item, index) => {
        // Fix image path: if the item image saved as "images/..." 
        // and we are in /products/, we need to add "../"
        const imgSrc = (isProductPage && !item.image.startsWith('../')) ? `../${item.image}` : item.image;
        
        return `
        <div style="display:flex; gap:15px; margin-bottom:20px; align-items:center; border-bottom:1px solid #27272a; padding-bottom:15px;">
            <img src="${imgSrc}" style="width:60px; height:75px; object-fit:cover; background:#111;">
            <div style="flex-grow:1;">
                <h4 style="font-size:0.65rem; text-transform:uppercase; margin:0; letter-spacing:1px;">${item.name}</h4>
                <p style="color:#8f5aff; font-size:0.8rem; font-weight:600; margin:5px 0 0 0;">$${item.price}</p>
            </div>
            <span style="cursor:pointer; opacity:0.5; font-size:0.8rem;" onclick="removeFromCart(${index})">✕</span>
        </div>
        `;
    }).join('');

    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    if (subtotalLabel) subtotalLabel.innerText = `$${total.toFixed(2)}`;
    
    // Checkout Button Redirection
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => window.location.href = checkoutPath;
    }
}

// 2. SMART ADD TO BAG: Scrapes info from the product page automatically
function addToBag() {
    const productName = document.querySelector('h1')?.innerText || "Unknown Product";
    const productPrice = document.querySelector('.price')?.innerText.replace('$', '') || "0.00";
    
    // Grabs the front image source
    let productImg = document.getElementById('img-front')?.getAttribute('src') || "";
    
    // Clean the image path for storage (remove ../ if present so it stores as "images/...")
    if (productImg.startsWith('../')) {
        productImg = productImg.replace('../', '');
    }

    cart.push({ 
        name: productName, 
        price: productPrice, 
        image: productImg 
    });

    updateCartUI();
    toggleCart(true); // Open sidebar automatically
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// 3. SIDEBAR TOGGLE
function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.querySelector('.cart-overlay');
    
    if (!sidebar || !overlay) return;

    if (forceOpen === true) {
        sidebar.classList.add('open');
        overlay.classList.add('open');
    } else {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

// Auto-run on every page load
window.addEventListener('DOMContentLoaded', updateCartUI);
