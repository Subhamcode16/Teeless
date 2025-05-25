let iconCart = document.querySelector('.cart-icon');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML= document.querySelector('.listProduct');

const cart = JSON.parse(localStorage.getItem("cart")) || [];

let listProduct = {};

iconCart.addEventListener('click', ()=> {
    body.classList.toggle('showCart');
})

closeCart.addEventListener('click', ()=>{
    body.classList.toggle('showCart');
})

// document.addEventListener("DOMContentLoaded", () => {
//   const cart = JSON.parse(localStorage.getItem("cartTab")) || [];
//   const container = document.getElementById("cart-item");

//   if (cart.length === 0) {
//     container.innerHTML = "<p>Your cart is empty.</p>";
//     return;
//   }

//   container.innerHTML = cart.map((product, index) => `
//     <div class="cart-item">
//       <div class="image">
//         <img src="${product.imgDefault}" alt="${product.title}">
//       </div>
//       <div class="item-name">
//         ${product.title} <br><small>Size: ${product.selectedSize}</small>
//       </div>
//       <div class="totalPrice">
//         ₹${product.price * product.quantity}
//       </div>
//       <div class="item-quantity">
//         <span class="minus" data-index="${index}">-</span>
//         <span>${product.quantity}</span>
//         <span class="plus" data-index="${index}">+</span>
//       </div>
//     </div>
//   `).join('');

  




//---- ProductList -----//


document.addEventListener("DOMContentLoaded", () => {
  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('product-container');
      container.innerHTML = products.map(product => createProductCard(product)).join('');
    })
    .catch(err => console.error("Failed to load products:", err));
});

function createProductCard(product, index) {
  const stars = [...Array(5)].map((_, i) =>
    `<span class="fa fa-star${i < product.rating ? ' checked' : '-o checked'}"></span>`).join('');

  return `
    <a href="product-page.html?id=${product.id}" style="text-decoration: none;">
    <div class="col-4 product-card">
      <div class="image-wrapper shine">
        <img src="${product.imgDefault}" alt="" class="img-default">
        <img src="${product.imgHover}" alt="" class="img-hover">
      </div>
        <div class="product-discount">${product.discount}</div>
        <div class="product-title">${product.title}</div>
        <div class="rating">${stars}</div>
        <div class="product-price">₹${product.price} <del>₹${product.originalPrice}</del></div>
    </div>
    </a>
  `;
}


//   -----Indivisual product page------   //


document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  let selectedSize = null;

  // Function to highlight selected size
  window.selectSize = function (button) {
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedSize = button.textContent;
  };

  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      const index = parseInt(productId, 10)-1;
      const product = data[index];
      if (!product) return;

      // Populate product page UI
      document.getElementById("ProductImg").src = product.imgHover || product.image || product.img;
      document.getElementById("product-title").textContent = product.title;
      document.getElementById("product-price").textContent = `₹${product.price}`;
      document.getElementById("product-description").textContent = product.description || "Product details unavailable.";

      // Add to Cart handler
      document.getElementById("add-to-cart-btn").addEventListener("click", (e) => {
        e.preventDefault();

        if (!selectedSize) {
          alert("Please select a size.");
          return;
        }

        const quantity = parseInt(document.querySelector('input[type="number"]').value) || 1;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push({
          ...product,
          selectedSize,
          quantity
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart!");

        // Show cart in the same page
        renderCart();
      });
    });


  //------Update the cart quantity------//  

  function updateCartQuantity() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const quantityElem = document.querySelector('.totalquantity');
  if (quantityElem) {
    quantityElem.textContent = totalQuantity;
  }
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const listCart = document.querySelector('.ListCart');
  if (!listCart) return;

  listCart.innerHTML = ''; // Clear existing

  cart.forEach((item, index) => {
    listCart.innerHTML += `
      <div class="cart-item" data-index="${index}">
        <div class="image">
          <img src="${item.imgDefault || item.image}" alt="${item.title}">
        </div>
        <div class="item-name">
          ${item.title} <br><small>Size: ${item.selectedSize}</small>
        </div>
        <div class="totalPrice">
          ₹${item.price}
        </div>
        <div class="item-quantity">
          <span class="minus">-</span>
          <span class="qty">${item.quantity}</span>
          <span class="plus">+</span>
        </div>
      </div>
    `;
  });

  updateCartQuantity(); // Sync cart icon quantity
  document.querySelector('.cartTab')?.scrollIntoView({ behavior: 'smooth' });
}

// Delegated event handler for plus & minus buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("plus") || e.target.classList.contains("minus")) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = e.target.closest('.cart-item');
    const index = parseInt(cartItem.dataset.index);

    if (e.target.classList.contains("plus")) {
      cart[index].quantity++;
    } else if (e.target.classList.contains("minus")) {
      cart[index].quantity--;
      if (cart[index].quantity < 1) {
        cart.splice(index, 1); // Remove item
      }
    }

    // Update localStorage and re-render
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
});