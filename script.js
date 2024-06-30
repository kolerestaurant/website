document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('#floatingmenu a');
    const menu = document.getElementById('floatingmenu');
    const label = document.querySelector('#floatingmenu .label');

    // Function to show the menu
    const showMenu = () => {
        menu.classList.add('active'); // Add active class to show links
    };

    // Function to hide the menu
    const hideMenu = () => {
        menu.classList.remove('active'); // Remove active class to hide links
    };

    // Add 'active' class to the selected menu item
    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Toggle menu visibility on label click
    label.addEventListener('click', (e) => {
        if (menu.classList.contains('active')) {
            hideMenu();
        } else {
            showMenu();
        }
        e.stopPropagation();
    });

    // Hide menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== label) {
            hideMenu();
        }
    });

    // Ensure menu hides when tapping outside on mobile
    document.addEventListener('touchstart', (e) => {
        if (!menu.contains(e.target) && e.target !== label) {
            hideMenu();
        }
    });
});


let selectedItems = []; // Array to store selected items

function selectItem(button, size, price) {
    const parent = button.closest('.dish');
    const dishName = parent.dataset.name;
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
        // Ensure that we don't increase the quantity when selecting for the first time
        selectedItems[existingItemIndex].quantity = 1;
        updateButton(button, size, price, 1);
    }
}

function updateButton(button, size, price, quantity) {
    const parent = button.closest('.dish');
    const quantityControls = parent.querySelector(`.quantity-controls.${size}`);

    quantityControls.innerHTML = `
        <button onclick="updateQuantity(this, 'decrement', '${size}', ${price})">-</button>
        ${quantity} ${size.charAt(0).toUpperCase() + size.slice(1)} Added
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
    button.style.display = 'inline-block';
    const quantityControls = parent.querySelector(`.quantity-controls.${size}`);
    quantityControls.innerHTML = '';
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
    let message = "Please note down my order.\n";

    selectedItems.forEach(item => {
        message += `${item.name} X ${item.quantity} = ₹${item.price * item.quantity}\n`;
        total += item.price * item.quantity;
    });

    message += `Total: ₹${total.toFixed(2)}`;

    if (total > 500) {
        let discount = total * 0.2;
        message += `\nDiscount: ₹${discount.toFixed(2)}`;
        total -= discount;
    }

    message += `\n------------------------------------`;
    message += `\nNet Payment: ₹${total.toFixed(2)}`;

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
