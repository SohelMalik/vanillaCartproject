// Load cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");

const checkoutBtn = document.getElementById('checkout-btn');
const checkoutPopup = document.getElementById('checkout-popup');
const checkoutTotal = document.getElementById('checkout-total');
const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
const cancelPaymentBtn = document.getElementById('cancel-payment-btn');

// Render cart items
function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalEl.textContent = "0.00";
    return;
  }

  cart.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");

    itemEl.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-info">
        <h3>${item.title}</h3>
        <p>Price: $${item.price}</p>
        <label>
          Quantity:
          <input type="number" min="1" value="${item.quantity || 1}" data-index="${index}" class="quantity-input" />
        </label>
      </div>
      <button class="btn btn-danger remove-btn" data-index="${index}">Remove</button>
    `;

    cartItemsEl.appendChild(itemEl);
  });

  updateTotal();
  addQuantityListeners();
  addRemoveListeners();
}

// Calculate and update total price
function updateTotal() {
  let total = 0;
  cart.forEach(item => {
    total += item.price * (item.quantity || 1);
  });
  cartTotalEl.textContent = total.toFixed(2);
}

// Update quantity on input change
function addQuantityListeners() {
  const qtyInputs = document.querySelectorAll(".quantity-input");
  qtyInputs.forEach(input => {
    input.addEventListener("change", e => {
      let index = e.target.dataset.index;
      let val = parseInt(e.target.value);
      if (val < 1) val = 1;
      cart[index].quantity = val;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateTotal();
    });
  });
}

// Remove item from cart
function addRemoveListeners() {
  const removeBtns = document.querySelectorAll(".remove-btn");
  removeBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}

// Clear entire cart
clearCartBtn.addEventListener("click", () => {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
});

// Calculate total for checkout modal
function calculateTotal() {
  let total = 0;
  cart.forEach(item => {
    total += item.price * (item.quantity || 1);
  });
  return total.toFixed(2);
}

// Checkout button click event
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  checkoutTotal.textContent = calculateTotal();
  checkoutPopup.style.display = 'flex'; // Show modal
});

// Confirm payment button
confirmPaymentBtn.addEventListener('click', () => {
  alert("✅ Payment Successful!");
  cart = [];
  localStorage.removeItem('cart');
  checkoutPopup.style.display = 'none';
  renderCart();
});

// Cancel payment button
cancelPaymentBtn.addEventListener('click', () => {
  checkoutPopup.style.display = 'none';
});

// Initial render
renderCart();

const darkToggle = document.getElementById('dark-mode-toggle');

darkToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

