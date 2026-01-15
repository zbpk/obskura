// OBSKURA Global Engine
let cart = JSON.parse(localStorage.getItem('obskuraCart')) || [];

// Path Detection: Ensures images/links work from root OR /products folder
const isProductPage = window.location.pathname.includes('/products/');
const pathPrefix = isProductPage ? '../' : '';

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const countLabels = document.querySelectorAll('.cart-count');
    const subtotalLabel = document.getElementById('cartSubtotal');
    
    countLabels.forEach(label => label.innerText = cart.length);
    localStorage.setItem('obskuraCart', JSON.stringify(cart));

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; opacity:0.5; margin-top:50px;">YOUR BAG IS EMPTY</p>';
        if (subtotalLabel) subtotalLabel.innerText = '$0.00';
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item-row" style="display:flex; gap:15px; margin-bottom:20px; align-items:center; border-bottom:1px solid #27272a; padding-bottom:15px;">
            <img src="${pathPrefix}${item.image}" style="width:60px; height:75px; object-fit:cover;">
            <div style="flex-grow:1;">
                <h4 style="font-size:0.7rem; text-transform:uppercase; margin:0;">${item.name}</h4>
                <p style="color:#8f5aff; font-weight:600; margin:5px 0 0 0;">$${item.price}</p>
            </div>
            <span style="cursor:pointer; opacity:0.5;" onclick="removeFromCart(${index})">✕</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    if (subtotalLabel) subtotalLabel.innerText = `$${total.toFixed(2)}`;
}

function addToBag(name, price, image) {
    // Trigger Bounce Animation
    const trigger = document.querySelector('.cart-trigger');
    trigger.classList.add('bounce-active');
    setTimeout(() => trigger.classList.remove('bounce-active'), 400);

    cart.push({ name, price, image });
    updateCartUI();
    toggleCart(true); // Open sidebar
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.querySelector('.cart-overlay');
    if (forceOpen) {
        sidebar.classList.add('open');
        overlay.classList.add('open');
    } else {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

window.onload = updateCartUI;
