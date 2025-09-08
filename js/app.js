// All javascript Home scetion


// Step 1: Mock Backend Setup with localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];


localStorage.removeItem('products');

let products = [

    {
        id: 1,
        name: 'Wireless Headphones',
        category: 'Electronics',
        price: 179,
        description: 'High-quality audio with noise cancellation.',
        image: 'images/Electric/1.avif'
    },
    {
        id: 2,
        name: 'Casual T-Shirt',
        category: 'Electronics',
        price: 29,
        description: 'Comfortable cotton fabric.',
        image: 'images/Electric/earbuds.avif'
    },
    {
        id: 3,
        name: 'LED Desk Lamp',
        category: 'Electronics',
        price: 49,
        description: 'Adjustable brightness settings.',
        image: 'images/Electric/head.avif',
    },
    {
        id: 4,
        name: 'Smartphone Case',
        category: 'Electronics',
        price: 19,
        description: 'Protective and stylish.',
        image: 'images/Electric/eard.avif',
    },
    {
        id: 5,
        name: 'Running Sneakers',
        category: 'Clothing',
        price: 89,
        description: 'Premium comfort for running.',
        image: 'images/cloths/1.avif'
    },
    {
        id: 6,
        name: 'Running Sneakers',
        category: 'Clothing',
        price: 89,
        description: 'Premium comfort for running.',
        image: 'images/cloths/2.avif'
    },
    {
        id: 7,
        name: 'Running Sneakers',
        category: 'Clothing',
        price: 89,
        description: 'Premium comfort for running.',
        image: 'images/cloths/3.avif'
    },
    {
        id: 8,
        name: 'Running Sneakers',
        category: 'Clothing',
        price: 89,
        description: 'Premium comfort for running.',
        image: 'images/cloths/4.avif'
    },
    {
        id: 9,
        name: 'Coffee Maker',
        category: 'Home',
        price: 129,
        description: 'Brew perfect coffee at home.',
        image: 'images/home/1.avif'
    },
    {
        id: 10,
        name: 'Coffee Maker',
        category: 'Home',
        price: 129,
        description: 'Brew perfect coffee at home.',
        image: 'images/home/2.avif'
    },
    {
        id: 11,
        name: 'Coffee Maker',
        category: 'Home',
        price: 129,
        description: 'Brew perfect coffee at home.',
        image: 'images/home/3.avif'
    },
    {
        id: 12,
        name: 'Coffee Maker',
        category: 'Home',
        price: 129,
        description: 'Brew perfect coffee at home.',
        image: 'images/home/4.avif'
    },

];

localStorage.setItem('products', JSON.stringify(products));



let cart = JSON.parse(localStorage.getItem('cart')) || [];
localStorage.setItem('products', JSON.stringify(products));
localStorage.setItem('cart', JSON.stringify(cart));

let currentUser = null;
let jwtToken = localStorage.getItem('jwtToken');

// Step 2: Authentication APIs (Mock JWT)
function generateToken() {
    return 'jwt_' + Math.random().toString(36).substr(2, 9);
}
function signup(email, password) {
    const existing = users.find(u => u.email === email);
    if (existing) return { success: false, message: 'User already exists' };
    const newUser = { id: Date.now(), email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, token: generateToken(), message: 'Signup successful' };
}
function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, message: 'Invalid credentials' };
    jwtToken = generateToken();
    localStorage.setItem('jwtToken', jwtToken);
    currentUser = user;
    return { success: true, token: jwtToken, message: 'Login successful' };
}
function logout() {
    localStorage.removeItem('jwtToken');
    jwtToken = null;
    currentUser = null;
}

// Step 3: Product CRUD APIs (Mock)
function getProducts(filters = {}) {
    let filtered = [...products];
    if (filters.price) filtered = filtered.filter(p => p.price >= filters.price);
    if (filters.category && filters.category !== 'All') filtered = filtered.filter(p => p.category === filters.category);
    return filtered;
}
function getProductById(id) {
    return products.find(p => p.id == id);
}
function updateProduct(id, updates) {
    const index = products.findIndex(p => p.id == id);
    if (index !== -1) {
        Object.assign(products[index], updates);
        localStorage.setItem('products', JSON.stringify(products));
        return { success: true, message: 'Product updated' };
    }
    return { success: false, message: 'Product not found' };
}
function deleteProduct(id) {
    const index = products.findIndex(p => p.id == id);
    if (index !== -1) {
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        return { success: true, message: 'Product deleted' };
    }
    return { success: false, message: 'Product not found' };
}

// Step 4: Cart APIs
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return { success: false, message: 'Product not found' };
    const existing = cart.find(c => c.id == productId);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    return { success: true, message: 'Added to cart' };
}
function removeFromCart(productId) {
    const index = cart.findIndex(c => c.id == productId);
    if (index !== -1) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        return { success: true, message: 'Removed from cart' };
    }
    return { success: false, message: 'Item not in cart' };
}
function updateCartItem(productId, quantity) {
    const item = cart.find(c => c.id == productId);
    if (item) {
        item.quantity = quantity;
        if (quantity <= 0) removeFromCart(productId);
        else localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        return { success: true, message: 'Quantity updated' };
    }
    return { success: false, message: 'Item not in cart' };
}
function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Step 5: UI Helper Functions
function showPage(pageId) {
    document.querySelectorAll('#app > section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    document.getElementById(pageId).classList.add('fade-in');
}
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cartCount');
    cartCountEl.textContent = count;
    cartCountEl.classList.toggle('hidden', count === 0);
}

// Step 6: Render Functions
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    const filters = {
        price: parseInt(document.getElementById('priceFilter').value) || 0,
        category: document.getElementById('categoryFilter').value
    };
    const filteredProducts = getProducts(filters);
    filteredProducts.forEach(p => {

        productsGrid.innerHTML += `
    <article class="product-card">
        <img src="${p.image}" alt="${p.name}" class="product-image" />
        <div class="product-info">
            <h3 class="product-title">${p.name}</h3>
            <p class="product-desc">${p.description}</p>
            <div class="product-price">$${p.price}</div>
            <button onclick="handleAddToCart(${p.id})" class="add-to-cart-btn">Add to Cart</button>
        </div>
    </article>
`;

    });
}
function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = '';
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="text-center text-gray-500">Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        cartItemsDiv.innerHTML += `
      <div class="cart-item flex items-center space-x-4">
        <img src="${item.image}" alt="${item.name}" class="w-40 h-40 object-cover rounded" />
        <div class="flex-1">
          <h4 class="font-semibold">${item.name}</h4>
          <p>$${item.price} x ${item.quantity}</p>
          <div class="flex mt-2 space-x-2">
            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="bg-gray-300 px-3 py-1 rounded">-</button>
            <span class="px-4">${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="bg-gray-300 px-3 py-1 rounded">+</button>
          </div>
        </div>
        <button onclick="handleRemoveFromCart(${item.id})" class="btn bg-red-500 hover:bg-red-600 px-4 py-2">Remove</button>
      </div> `;
    });


}
function updateTotal() {
    document.getElementById('cartTotal').textContent = `Total: $${getCartTotal().toFixed(2)}`;
}

// Step 7: Event Handlers
function handleAddToCart(productId) {
    const res = addToCart(productId);
    alert(res.message);
    renderCart();
}
function handleRemoveFromCart(productId) {
    const res = removeFromCart(productId);
    alert(res.message);
    renderCart();
    updateTotal();
}
function updateQuantity(productId, newQuantity) {
    updateCartItem(productId, newQuantity);
    renderCart();
    updateTotal();
}

// Initialize cart on load
updateCartCount();
renderProducts();
renderCart();
updateTotal();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('homeBtn').addEventListener('click', () => showPage('homePage'));
    document.getElementById('startShoppingBtn').addEventListener('click', () => showPage('listPage'));
    document.getElementById('listBtn').addEventListener('click', () => {
        showPage('listPage');
        renderProducts();
    });
    document.getElementById('cartBtn').addEventListener('click', () => {
        showPage('cartPage');
        renderCart();
        updateTotal();
    });
    document.getElementById('priceFilter').addEventListener('input', (e) => {
        document.getElementById('priceValue').textContent = `$${e.target.value}`;
        renderProducts();
    });
    document.getElementById('categoryFilter').addEventListener('change', renderProducts);
    document.getElementById('applyFiltersBtn').addEventListener('click', renderProducts);
    document.getElementById('loginBtn').addEventListener('click', () => document.getElementById('authModal').classList.remove('hidden'));
    document.getElementById('logoutBtn').addEventListener('click', () => {
        logout();
        alert('Logged out. Cart remains preserved.');
        location.reload();
    });
    document.getElementById('closeModal').addEventListener('click', () => document.getElementById('authModal').classList.add('hidden'));
    document.getElementById('switchToSignup').addEventListener('click', () => {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('signupForm').classList.remove('hidden');
    });
    document.getElementById('switchToLogin').addEventListener('click', () => {
        document.getElementById('signupForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    });
    document.getElementById('submitSignup').addEventListener('click', () => {
        const res = signup(document.getElementById('signupEmail').value, document.getElementById('signupPassword').value);
        alert(res.message);
        if (res.success) {
            document.getElementById('authModal').classList.add('hidden');
            document.getElementById('logoutBtn').classList.remove('hidden');
            document.getElementById('loginBtn').classList.add('hidden');
        }
    });
    document.getElementById('submitLogin').addEventListener('click', () => {
        const res = login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
        alert(res.message);
        if (res.success) {
            document.getElementById('authModal').classList.add('hidden');
            document.getElementById('logoutBtn').classList.remove('hidden');
            document.getElementById('loginBtn').classList.add('hidden');
        }
    });
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        alert('Checkout functionality would be implemented here (e.g., payment gateway integration).');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') document.getElementById('authModal').classList.add('hidden');
    });
});




// Login/Signup Modal 

// Modal toggle logic
const authModal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const closeModalBtn = document.getElementById('closeModal');

// Show modal function
function showModal() {
    authModal.classList.add('active');
    showLogin();
}
// Hide modal function
function hideModal() {
    authModal.classList.remove('active');
}
// Show login form
function showLogin() {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
}
// Show signup form
function showSignup() {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
}

// Event listeners for switching forms
switchToSignup.addEventListener('click', showSignup);
switchToLogin.addEventListener('click', showLogin);
closeModalBtn.addEventListener('click', hideModal);

// Close modal on outside click
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) hideModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('active')) {
        hideModal();
    }
});

// Example: Open modal on login button click (adjust selector as needed)
document.getElementById('loginBtn').addEventListener('click', showModal);

// Prevent default form submission for demo
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('Login submitted: ' + loginForm.loginEmail.value);
    hideModal();
});
signupForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('Signup submitted: ' + signupForm.signupEmail.value);
    hideModal();
});
