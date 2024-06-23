let selectedItems = []; // Array to store selected items

function selectItem(button, size, price) {
    const dishName = button.parentNode.dataset.name;
    const fullName = `${dishName} (${size})`;
    const quantityControls = button.nextElementSibling;

    const existingItemIndex = selectedItems.findIndex(item => item.name === fullName);

    if (existingItemIndex === -1) {
        selectedItems.push({
            name: fullName,
            price: price,
            quantity: 1
        });
        updateButton(button, size, price, 1);
    } else {
        selectedItems[existingItemIndex].quantity += 1;
        updateButton(button, size, price, selectedItems[existingItemIndex].quantity);
    }
}

function updateButton(button, size, price, quantity) {
    const parent = button.parentNode;
    const quantityControls = parent.querySelector(`.quantity-controls.${size}`);

    quantityControls.innerHTML = `
        <button onclick="updateQuantity(this, 'decrement', '${size}', ${price})">-</button>
        ${quantity} ${size.charAt(0).toUpperCase() + size.slice(1)} Selected
        <button onclick="updateQuantity(this, 'increment', '${size}', ${price})">+</button>
    `;
    button.style.display = 'none';
}

function updateQuantity(button, action, size, price) {
    const parent = button.closest('.dish');
    const dishName = parent.dataset.name;
    const fullName = `${dishName} (${size})`;
    const existingItemIndex = selectedItems.findIndex(item => item.name === fullName);

    if (existingItemIndex !== -1) {
        if (action === 'increment') {
            selectedItems[existingItemIndex].quantity += 1;
        } else if (action === 'decrement') {
            selectedItems[existingItemIndex].quantity -= 1;
            if (selectedItems[existingItemIndex].quantity === 0) {
                selectedItems.splice(existingItemIndex, 1);
                resetButton(parent, size);
                return;
            }
        }
        updateButton(parent.querySelector(`button[onclick*="selectItem"][onclick*="${size}"]`), size, price, selectedItems[existingItemIndex].quantity);
    }
}

function resetButton(parent, size) {
    const button = parent.querySelector(`button[onclick*="selectItem"][onclick*="${size}"]`);
    const quantityControls = parent.querySelector(`.quantity-controls.${size}`);
    quantityControls.innerHTML = '';
    button.style.display = 'inline-block';
}

function addToCart(button) {
    const dish = button.parentNode.dataset;
    const index = selectedItems.findIndex(item => item.name === dish.name);
    if (index === -1) {
        selectedItems.push({
            name: dish.name,
            price: parseFloat(dish.price),
            quantity: 1
        });
        button.classList.add('selected');
        button.innerText = 'Unselect';
    } else {
        selectedItems.splice(index, 1);
        button.classList.remove('selected');
        button.innerText = 'Select';
    }
}

function confirmOrder() {
    if (selectedItems.length === 0) {
        alert("Please select at least one item to order.");
        return;
    }

    let total = 0;
    let message = "Your Order:\n";
    selectedItems.forEach(item => {
        message += `${item.name} - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
        total += item.price * item.quantity;
    });
    message += `Total: ₹${total.toFixed(2)}`;

    if (confirm(message + "\n\nDo you want to confirm your order?")) {
        sendToWhatsApp(message);
        // Optionally, you can reset the selected items array and remove the selected class from buttons here
        selectedItems = [];
        document.querySelectorAll('.dish button.selected').forEach(button => {
            button.classList.remove('selected');
            button.innerText = 'Select';
        });
        document.querySelectorAll('.quantity-controls').forEach(control => {
            control.innerHTML = '';
        });
    }
}




function sendToWhatsApp(message) {
    // Use JavaScript to open WhatsApp with the pre-filled message
    // Replace the number with your WhatsApp business number
    // Make sure to add the international dialing code (+91 for India)
    window.open(`https://wa.me/917042429748?text=${encodeURIComponent(message)}`);
}
