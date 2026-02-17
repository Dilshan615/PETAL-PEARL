// Main JavaScript for Petal & Pearl

// Product Data (Mock Database)
const products = [
    {
        id: 1,
        name: "Velvet Rose Noir",
        category: "Signature",
        price: 125,
        image: "assets/images/product-1.png",
        filterStyle: ""
    },
    {
        id: 2,
        name: "Lumière Orchid",
        category: "Exotic",
        price: 185,
        image: "assets/images/product-2.png",
        filterStyle: ""
    },
    {
        id: 3,
        name: "Imperial Peony",
        category: "Limited",
        price: 145,
        image: "assets/images/product-3.png",
        filterStyle: ""
    },
    {
        id: 4,
        name: "Crimson Essence",
        category: "Signature",
        price: 95,
        image: "assets/images/product-1.png",
        filterStyle: "filter: hue-rotate(10deg);"
    },
    {
        id: 5,
        name: "Ethereal White",
        category: "Signature",
        price: 110,
        image: "assets/images/product-3.png",
        filterStyle: "filter: grayscale(100%);"
    },
    {
        id: 6,
        name: "Golden Hour Orchid",
        category: "Exotic",
        price: 210,
        image: "assets/images/product-2.png",
        filterStyle: "filter: sepia(40%);"
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // AOS Animation Init
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic',
        });
    }

    // Initialize Components
    updateCartUI();
    renderFavorites(products);
    setupFilters();
});

// Render Favorites Grid
function renderFavorites(items) {
    const grid = document.getElementById('favorites-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center text-muted py-5"><i class="bi bi-search display-6 mb-3 d-block"></i><p>No products found matching your criteria.</p></div>';
        return;
    }

    items.forEach((product, index) => {
        const delay = index * 50; // Staggered animation
        const html = `
            <div class="col-md-4" data-aos="fade-up" data-aos-delay="${delay}">
                <div class="product-card h-100">
                    <div class="product-img-wrapper">
                        <img src="${product.image}" alt="${product.name}" class="product-img" style="${product.filterStyle}">
                        <div class="product-actions">
                            <button class="btn-icon" title="Add to Cart" onclick="addToCart('${product.name}', ${product.price})"><i class="bi bi-bag-plus"></i></button>
                            <button class="btn-icon" title="Quick View"><i class="bi bi-eye"></i></button>
                        </div>
                    </div>
                    <div class="product-info">
                        <span class="product-cat">${product.category}</span>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">$${product.price}.00</p>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += html;
    });

    // Re-trigger AOS for new elements if possible, or just let CSS handle it
    // AOS.refresh(); // valid call if AOS is loaded
}

// Filter Logic
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');

    if (!searchInput || !categoryFilter || !priceRange) return;

    // Real-time price updates
    priceRange.addEventListener('input', (e) => {
        priceValue.innerText = `$${e.target.value}`;
        filterProducts();
    });

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
}

window.filterProducts = function () {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceRange = document.getElementById('price-range');

    const term = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const maxPrice = parseInt(priceRange.value);

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(term);
        const matchesCategory = category === 'all' || product.category === category;
        const matchesPrice = product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    renderFavorites(filtered);
};


// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.classList.remove('shadow-sm');
            navbar.style.background = 'rgba(249, 248, 246, 0.8)';
        }
    });
}

// Shopping Cart State
let cart = JSON.parse(localStorage.getItem('petalCart')) || [];

// Add to Cart Function
// Add to Cart Function
window.addToCart = function (name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            qty: 1
        });
    }

    saveCart();
    updateCartUI();

    // Feedback
    // For now simple alert, or we could just update badge silently.
    alert(`${name} has been added to your bag.`);
};

// Remove from Cart Function
window.removeFromCart = function (name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartUI();
};

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('petalCart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartFinalTotal = document.getElementById('cart-final-total');

    if (cartCount) {
        // Update Badge
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.innerText = totalQty;

        if (totalQty === 0) {
            cartCount.style.display = 'none';
        } else {
            cartCount.style.display = 'flex';
        }
    }

    // If we are on the cart page (container exists), render the full list
    if (cartItemsContainer) {
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-bag display-1 mb-3 text-muted opacity-25"></i>
                    <p class="lead">Your bag is currently empty.</p>
                    <a href="favorites.html" class="btn btn-outline-pearl mt-3">Continue Shopping</a>
                </div>
            `;
            // Hide footer if empty is optional
        } else {
            let html = '';
            cart.forEach(item => {
                const itemTotal = item.price * item.qty;
                total += itemTotal;
                html += `
                    <div class="d-flex align-items-center justify-content-between border-bottom py-4">
                        <div class="d-flex align-items-center">
                            <div class="bg-light rounded d-flex align-items-center justify-content-center me-3" style="width: 80px; height: 80px;">
                                <i class="bi bi-flower1 fs-3 text-muted"></i>
                            </div>
                            <div>
                                <h5 class="mb-1 font-serif">${item.name}</h5>
                                <p class="text-muted small mb-0">$${item.price}.00 each</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-4">
                            <div class="d-flex align-items-center border rounded-pill px-2">
                                <span class="px-2 text-muted fw-bold">${item.qty}</span>
                            </div>
                            <span class="fw-bold fs-5">$${itemTotal}.00</span>
                            <button class="btn btn-icon text-danger" onclick="removeFromCart('${item.name}')" style="background: transparent;">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            cartItemsContainer.innerHTML = html;
        }

        const formattedTotal = '$' + total.toFixed(2);
        if (cartTotal) cartTotal.innerText = formattedTotal;
        if (cartFinalTotal) cartFinalTotal.innerText = formattedTotal;
    }
}
