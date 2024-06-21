document.addEventListener('DOMContentLoaded', function () {
  class Product {
    constructor(id, name, price) {
      this.id = id;
      this.name = name;
      this.price = price;
    }
  }

  class ShoppingCartItem {
    constructor(product, quantity = 0) {
      this.product = product;
      this.quantity = quantity;
    }

    getTotalPrice() {
      return this.product.price * this.quantity;
    }
  }

  class ShoppingCart {
    constructor() {
      this.items = [];
    }

    addItem(product) {
      const existingItem = this.items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push(new ShoppingCartItem(product, 1));
      }
      this.render();
    }

    removeItem(productId) {
      this.items = this.items.filter(item => item.product.id !== productId);
      this.render();
    }

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          this.removeItem(productId);
        }
        this.render();
      }
    }

    getTotalPrice() {
      return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    render() {
      const totalPriceElement = document.querySelector('.total');
      totalPriceElement.textContent = this.getTotalPrice().toFixed(2) + ' $';

      this.items.forEach(item => {
        const quantityElement = document.querySelector(`.card-body[data-id="${item.product.id}"] .quantity`);
        if (quantityElement) {
          quantityElement.textContent = item.quantity;
        }
      });
    }
  }

  const products = [
    new Product(1, 'Baskets', 100),
    new Product(2, 'Socks', 20),
    new Product(3, 'Bag', 50)
  ];

  const shoppingCart = new ShoppingCart();

  document.querySelectorAll('.fa-plus-circle').forEach(button => {
    button.addEventListener('click', function (event) {
      const cardBody = event.target.closest('.card-body');
      const productId = parseInt(cardBody.dataset.id);
      shoppingCart.addItem(products.find(product => product.id === productId));
    });
  });

  document.querySelectorAll('.fa-minus-circle').forEach(button => {
    button.addEventListener('click', function (event) {
      const cardBody = event.target.closest('.card-body');
      const productId = parseInt(cardBody.dataset.id);
      const quantityElement = cardBody.querySelector('.quantity');
      let quantity = parseInt(quantityElement.textContent);
      shoppingCart.updateQuantity(productId, quantity - 1);
    });
  });

  document.querySelectorAll('.fa-trash-alt').forEach(button => {
    button.addEventListener('click', function (event) {
      const cardBody = event.target.closest('.card-body');
      const productId = parseInt(cardBody.dataset.id);
      shoppingCart.removeItem(productId);
      cardBody.parentElement.remove();
    });
  });

  document.querySelectorAll('.fa-heart').forEach(button => {
    button.addEventListener('click', function (event) {
      event.target.classList.toggle('liked');
    });
  });

  shoppingCart.render();
});

document.addEventListener('DOMContentLoaded', function () {
  const quantityButtons = document.querySelectorAll('.fa-plus-circle, .fa-minus-circle');
  const deleteButtons = document.querySelectorAll('.fa-trash-alt');
  const likeButtons = document.querySelectorAll('.fa-heart');

  quantityButtons.forEach(button => {
    button.addEventListener('click', adjustQuantity);
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', deleteItem);
  });

 
});

function adjustQuantity(event) {
  const clickedButton = event.target;
  const quantityElement = clickedButton.parentElement.querySelector('.quantity');
  let quantity = parseInt(quantityElement.textContent);

  if (clickedButton.classList.contains('fa-plus-circle')) {
    quantity++;
  } else if (clickedButton.classList.contains('fa-minus-circle')) {
    if (quantity > 0) {
      quantity--;
    }
  }

  quantityElement.textContent = quantity;

  updateTotalPrice();
}

function deleteItem(event) {
  const clickedButton = event.target;
  const cardBody = clickedButton.closest('.card-body');
  cardBody.parentElement.remove();

  updateTotalPrice();
}
function updateTotalPrice() {
  let totalPrice = 0;
  const unitPrices = document.querySelectorAll('.unit-price');
  const quantities = document.querySelectorAll('.quantity');

  unitPrices.forEach((unitPrice, index) => {
    const price = parseFloat(unitPrice.textContent.replace('$', ''));
    const quantity = parseInt(quantities[index].textContent);
    totalPrice += price * quantity;
  });

  const totalPriceElement = document.querySelector('.total');
  totalPriceElement.textContent = totalPrice.toFixed(2) + ' $';
}
