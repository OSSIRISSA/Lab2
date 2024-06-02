const addItemButton = document.querySelector('.add-button');
const productInput = document.querySelector('.header-input-container .product-input');
const mainContent = document.querySelector(".main-content");
const unboughtSection = document.getElementById('unbought');
const boughtSection = document.getElementById('bought');

// Create new item
function createItemElement(name, quantity = 1, bought = false) {
    const item = document.createElement('section');
    item.classList.add('item');
    if (bought) {
        item.classList.add('bought');
    }

    const productNameDiv = document.createElement('div');
    productNameDiv.classList.add('product-name');
    const productInput = document.createElement('input');
    productInput.type = 'text';
    productInput.value = name;
    productInput.classList.add('product-input-inline');
    productInput.setAttribute('data-original-name', name);
    if (bought) {
        productInput.classList.add('strike');
        productInput.disabled = true;
    }
    productInput.addEventListener('blur', () => updateItemName(item, productInput.value));
    productNameDiv.appendChild(productInput);

    const productCountDiv = document.createElement('div');
    productCountDiv.classList.add('product-count');
    const decrementButton = document.createElement('button');
    decrementButton.classList.add('quantity-button', 'decrement');
    decrementButton.setAttribute('data-tooltip', 'Decrease quantity');
    if (quantity === 1) {
        decrementButton.classList.add('unpushable');
    } else {
        decrementButton.classList.add('pushable');
    }
    decrementButton.innerHTML = '<span class="front">-</span>';
    decrementButton.addEventListener('click', () => updateQuantity(item, -1));
    const countSpan = document.createElement('span');
    countSpan.classList.add('product-container', 'modified');
    countSpan.textContent = quantity.toString();
    const incrementButton = document.createElement('button');
    incrementButton.classList.add('quantity-button', 'increment', 'pushable');
    incrementButton.setAttribute('data-tooltip', 'Increase quantity');
    incrementButton.innerHTML = '<span class="front">+</span>';
    incrementButton.addEventListener('click', () => updateQuantity(item, 1));
    productCountDiv.appendChild(decrementButton);
    productCountDiv.appendChild(countSpan);
    productCountDiv.appendChild(incrementButton);
    if (bought) {
        decrementButton.style.visibility = "hidden"
        incrementButton.style.visibility = "hidden"
    } else {
        decrementButton.style.visibility = "visible"
        incrementButton.style.visibility = "visible"
    }

    const boughtButtonCell = document.createElement('div');
    boughtButtonCell.classList.add('bought-button-cell');
    const statusButton = document.createElement('button');
    statusButton.classList.add('status-button', 'pushable');
    statusButton.setAttribute('data-tooltip', bought ? 'Mark as not bought' : 'Mark as bought');
    if (bought) {
        statusButton.innerHTML = '<span class="front">Не куплено</span>';
    } else {
        statusButton.innerHTML = '<span class="front">Куплено</span>';
    }
    statusButton.addEventListener('click', () => toggleBoughtStatus(item));
    boughtButtonCell.appendChild(statusButton);

    if (!bought) {
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button', 'pushable');
        removeButton.setAttribute('data-tooltip', 'Remove item');
        removeButton.innerHTML = '<span class="front">×</span>';
        removeButton.addEventListener('click', () => removeItem(item));
        boughtButtonCell.appendChild(removeButton);
    }

    item.appendChild(productNameDiv);
    item.appendChild(productCountDiv);
    item.appendChild(boughtButtonCell);

    return item;
}

// Add new item to the list
function addItem(name, quantity = 1, status = false) {
    const item = createItemElement(name, quantity, status);
    mainContent.appendChild(item);
    updateStatistics();
}

// Remove item
function removeItem(item) {
    item.remove();
    updateStatistics();
}

// Update item name
function updateItemName(item, newName) {
    const productNameInput = item.querySelector('.product-name .product-input-inline');
    if (newName.trim() === '') {
        productNameInput.value = productNameInput.getAttribute('data-original-name');
    } else {
        productNameInput.value = newName.trim();
        productNameInput.setAttribute('data-original-name', newName);
    }
    updateStatistics();
}


// Update quantity of specific product
function updateQuantity(item, change) {
    const countSpan = item.querySelector('.product-count .product-container');
    let quantity = parseInt(countSpan.textContent, 10) + change;
    if (quantity < 1) {
        quantity = 1;
    }
    countSpan.textContent = quantity;
    const decrementButton = item.querySelector('.quantity-button.decrement');
    if (quantity === 1) {
        decrementButton.classList.remove('pushable');
        decrementButton.classList.add('unpushable');
    } else {
        decrementButton.classList.add('pushable');
        decrementButton.classList.remove('unpushable');
    }
    updateStatistics();
}

// Toggle button bought/unbought status
function toggleBoughtStatus(item) {
    const productNameInput = item.querySelector('.product-name .product-input-inline');
    productNameInput.classList.toggle('strike');
    const bought = item.classList.toggle('bought');
    const statusButton = item.querySelector('.status-button');
    const allQuantityButtons = item.querySelectorAll('.product-count button');
    if (bought) {
        statusButton.innerHTML = '<span class="front">Не куплено</span>';
        item.querySelector('.remove-button').remove();
        allQuantityButtons.forEach(button => {
            button.style.visibility = "hidden";
        });
        productNameInput.disabled = true;
    } else {
        statusButton.innerHTML = '<span class="front">Куплено</span>';
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button', 'pushable');
        removeButton.setAttribute('data-tooltip', 'Remove item');
        removeButton.innerHTML = '<span class="front">×</span>';
        removeButton.addEventListener('click', () => removeItem(item));
        item.querySelector('.bought-button-cell').appendChild(removeButton);
        allQuantityButtons.forEach(button => {
            button.style.visibility = "visible";
        });
        productNameInput.disabled = false;
    }
    statusButton.setAttribute('data-tooltip', bought ? 'Mark as not bought' : 'Mark as bought');
    updateStatistics();
}

// Update right side
function updateStatistics() {
    const allItems = mainContent.querySelectorAll('.item');

    unboughtSection.innerHTML = '';
    boughtSection.innerHTML = '';

    allItems.forEach(item => {
        const productName = item.querySelector('.product-name .product-input-inline').value;
        const quantity = item.querySelector('.product-count .product-container').textContent;
        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');
        if (!item.classList.contains('bought')) {
            productContainer.innerHTML = `<span>${productName}</span><span class="count">${quantity}</span>`;
            unboughtSection.appendChild(productContainer);
        } else {
            productContainer.innerHTML = `<span class="strike">${productName}</span><span class="count strike">${quantity}</span>`;
            boughtSection.appendChild(productContainer);
        }
    });
}

// Add item if button clicked
addItemButton.addEventListener('click', () => {
    const name = productInput.value.trim();
    if (name) {
        addItem(name);
        productInput.value = '';
        productInput.focus();
    }
});

// Add item if enter pressed
productInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addItemButton.click();
    }
});

// Initial items
addItem('Помідори', 2, true);
addItem('Печиво', 2, false);
addItem('Сир', 1, false);