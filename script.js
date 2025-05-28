// script.js

const productList = document.getElementById('product-list');
const cartCount = document.getElementById('cart-count');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// for toast message 
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}



function updateCartCount() {
  cartCount.textContent = cart.length;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  cart.push(product);             // Adds the product to the cart array
  saveCart();                     // Saves the updated cart to localStorage
  updateCartCount();             // Updates the cart icon with the new count
  showToast(`${product.title} added to cart!`);  // 👈 Shows the toast message
}


function renderProducts(items) {
  productList.innerHTML = '';
  items.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <button class="add-to-cart-btn" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>

    `;
    productList.appendChild(productCard);
  });
}

function filterByCategory(category) {
  if (category === 'all') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
  }
}

function searchProducts(term) {
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(term.toLowerCase())
  );
  renderProducts(filtered);
}

// Event Listeners
searchInput?.addEventListener('input', (e) => {
  searchProducts(e.target.value);
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterByCategory(btn.dataset.category);
  });
});

// userfedback

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all buttons
    filterButtons.forEach(b => b.classList.remove('active'));
    // Add active to clicked button
    btn.classList.add('active');

    filterByCategory(btn.dataset.category);
  });
});


// Initial load
fetch('https://dummyjson.com/products?limit=300')
  .then(res => res.json())
  .then(data => {
    products = data.products;
    renderProducts(products);
    updateCartCount();
  })
  .catch(err => console.error('Error loading products:', err));

  // for payment
  // Checkout modal functionality
const checkoutModal = document.getElementById('checkout-modal');
const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
const totalAmountDisplay = document.getElementById('total-amount');

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
}

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }

  totalAmountDisplay.textContent = `$${getCartTotal()}`;
  checkoutModal.classList.remove('hidden');
}

function closeCheckoutModal() {
  checkoutModal.classList.add('hidden');
}

confirmPaymentBtn?.addEventListener('click', () => {
  closeCheckoutModal();
  showToast('✅ Payment successful! Thank you for your purchase.');
  cart = [];
  saveCart();
  updateCartCount();
  if (typeof renderCartItems === 'function') renderCartItems(); // only if defined
});

cancelPaymentBtn?.addEventListener('click', () => {
  closeCheckoutModal();
});

// Dark Mode Toggle
const darkModeCheckbox = document.getElementById('dark-mode-checkbox');

// Load saved mode from localStorage
if (localStorage.getItem('dark-mode') === 'enabled') {
  document.body.classList.add('dark-mode');
  if (darkModeCheckbox) darkModeCheckbox.checked = true;
}

darkModeCheckbox?.addEventListener('change', () => {
  if (darkModeCheckbox.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('dark-mode', 'enabled');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('dark-mode', 'disabled');
  }
});

const darkToggle = document.getElementById('dark-mode-toggle');

darkToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});


