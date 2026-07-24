const menuData = {
  mocha: { base: 150, icecream: 20, topping: 30, sugar: 10, label: 'Mocha' },
  capchunio: { base: 120, icecream: 15, topping: 25, sugar: 8, label: 'Capchunio' },
  latte: { base: 100, icecream: 10, topping: 20, sugar: 5, label: 'Latte' },
  coldcoffe: { base: 80, icecream: 5, topping: 10, sugar: 5, label: 'Cold Coffee' },
  blackcofee: { base: 50, icecream: 0, topping: 0, sugar: 0, label: 'Black Coffee' }
};

const drinkSelect = document.getElementById('drink');
const quantityInput = document.getElementById('quantity');
const resultBox = document.getElementById('result-box');
const liveSummary = document.getElementById('live-summary');
const orderForm = document.getElementById('order-form');
const statusMessage = document.getElementById('status-message');

function calculateLocalSummary(drink, quantity) {
  const item = menuData[drink];
  const subtotal = item.base + item.icecream + item.topping + item.sugar;
  const discount = subtotal > 200 ? subtotal * 0.1 : 0;
  const finalPrice = subtotal - discount;
  const bill = finalPrice * quantity;
  const points = Math.floor(bill / 100);

  return { drink, quantity, subtotal, discount, finalPrice, bill, points, item };
}

function renderSummary(drink, quantity) {
  const summary = calculateLocalSummary(drink, quantity);
  liveSummary.innerHTML = `
    <div class="summary-row"><span>Drink</span><strong>${summary.item.label}</strong></div>
    <div class="summary-row"><span>Base</span><strong>₹${summary.item.base}</strong></div>
    <div class="summary-row"><span>Extras</span><strong>₹${summary.item.icecream + summary.item.topping + summary.item.sugar}</strong></div>
    <div class="summary-row"><span>Subtotal</span><strong>₹${summary.subtotal}</strong></div>
    <div class="summary-row"><span>Discount</span><strong>₹${summary.discount.toFixed(0)}</strong></div>
    <div class="summary-row"><span>Final</span><strong>₹${summary.finalPrice}</strong></div>
    <div class="summary-row total"><span>Total bill</span><strong>₹${summary.bill}</strong></div>
    <div class="summary-row"><span>Loyalty points</span><strong>${summary.points}</strong></div>
  `;
}

function showStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`;
}

async function submitOrder(event) {
  event.preventDefault();
  const drink = drinkSelect.value;
  const quantity = Number(quantityInput.value);

  if (!drink || quantity < 1) {
    showStatus('Please choose a drink and a valid quantity.', 'error');
    return;
  }

  showStatus('Placing your order...', 'info');

  try {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drink, quantity })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to place order');
    }

    resultBox.innerHTML = `
      <h3>Order placed successfully</h3>
      <p>${data.message}</p>
      <p><strong>Total bill:</strong> ₹${data.bill}</p>
      <p><strong>Loyalty points:</strong> ${data.points}</p>
    `;
    showStatus(`Your ${menuData[drink].label} order is ready.`, 'success');
  } catch (error) {
    const fallback = calculateLocalSummary(drink, quantity);
    resultBox.innerHTML = `
      <h3>Preview order</h3>
      <p>Your order is ready to place once the server is running.</p>
      <p><strong>Total bill:</strong> ₹${fallback.bill}</p>
      <p><strong>Loyalty points:</strong> ${fallback.points}</p>
    `;
    showStatus(error.message, 'error');
  }
}

[drinkSelect, quantityInput].forEach((element) => {
  element.addEventListener('input', () => renderSummary(drinkSelect.value, Number(quantityInput.value)));
  element.addEventListener('change', () => renderSummary(drinkSelect.value, Number(quantityInput.value)));
});

orderForm.addEventListener('submit', submitOrder);
renderSummary(drinkSelect.value, Number(quantityInput.value));

const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.18 });

revealElements.forEach((element) => observer.observe(element));
