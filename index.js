function updatePrices() {
    document.querySelectorAll(".price").forEach((priceElement) => {
        const value = parseFloat(priceElement.dataset.price);
        priceElement.textContent = `$${value.toFixed(2)}`;
    });
}
updatePrices();

document.addEventListener("DOMContentLoaded", function () {
    const products = document.querySelectorAll(".card");

    products.forEach((product) => {
        const addToCartBtn = product.querySelector(".add-to-cart");
        const productName = product.querySelector(".title").dataset.name;
        const productPrice = parseFloat(
            product.querySelector(".price").dataset.price
        );

        const cardImage = product.querySelector(".card-image");
        const increaseBtn = product.querySelector(".increase");
        const decreaseBtn = product.querySelector(".decrease");
        const quantitySelector = product.querySelector(".quantity-selector");
        const quantityDisplay = product.querySelector(".quantity");
        const imgProduct = product.querySelector(".card-image");
        const imageUrl = imgProduct ? imgProduct.src : null;

        let quantity = 1;

        addToCartBtn.addEventListener("click", function () {
            const btnConfirmOrder = document.querySelector(".btn-order");
            const totalOrder = document.querySelector(".order-total");
            const txt = document.querySelector(".txt-checkout");
            const totalValue = document.querySelector(".value-total");
            const msgCart = document.querySelector(".message-cart");

            totalOrder.classList.remove("hidden");
            txt.classList.remove("hidden");
            totalValue.classList.remove("hidden");
            msgCart.classList.remove("hidden");
            cardImage.classList.add("active");
            addToCartBtn.classList.add("hidden");
            quantitySelector.classList.remove("hidden");
            btnConfirmOrder.classList.remove("hidden");

            showOrders(productName, productPrice, quantity, imageUrl);
            hiddenElementsOnCart();
        });

        increaseBtn.addEventListener("click", function () {
            quantity++;
            quantityDisplay.textContent = quantity;
            showOrders(productName, productPrice, quantity);
        });

        decreaseBtn.addEventListener("click", function () {
            if (quantity > 1) {
                quantity--;
                quantityDisplay.textContent = quantity;
                showOrders(productName, productPrice, quantity);
            } else {
                cardImage.classList.remove("active");
                addToCartBtn.classList.remove("hidden");
                quantitySelector.classList.add("hidden");

                showOrders(productName, productPrice, 0);

                quantity = 1;
                quantityDisplay.textContent = quantity;

                checkIfCartIsEmpty();
                updateCartCount();
            }
        });
    });
});

function showOrders(name, price, quantity, img) {
    let cartContent = document.getElementById("cart-items");

    // const productImg = product.querySelector(".card-image img").src;

    const existingOrder = Array.from(cartContent.children).find((order) => {
        const orderName = order.querySelector(".name-product-cart");
        return orderName && orderName.textContent === name;
    });

    if (existingOrder && quantity < 1) {
        cartContent.removeChild(existingOrder);
        return;
    }

    if (existingOrder) {
        cartContent.removeChild(existingOrder);
    }

    let divContainer = document.createElement("div");
    let newOrder = document.createElement("div");
    let orderNameTag = document.createElement("p");
    let orderQuantityTag = document.createElement("span");
    let orderPriceTag = document.createElement("span");
    let orderTotalTag = document.createElement("span");
    let btnRemove = document.createElement("button");

    divContainer.classList.add("div-container");
    newOrder.classList.add("div-style");
    orderQuantityTag.classList.add("quantity-div");
    orderPriceTag.classList.add("price-one");
    orderTotalTag.classList.add("total-price");
    btnRemove.classList.add("btn-remove");
    orderNameTag.classList.add("name-product-cart");

    orderNameTag.textContent = name;
    orderQuantityTag.textContent = `${quantity}x`;
    orderPriceTag.textContent = `$${price.toFixed(2)}`;
    orderTotalTag.textContent = `$${(price * quantity).toFixed(2)}`;

    btnRemove.addEventListener("click", function () {
        btnRemove.parentElement.remove();

        // Encontra o card do produto com base no nome
        const allCards = document.querySelectorAll(".card");
        allCards.forEach((card) => {
            const title = card.querySelector(".title").dataset.name;
            if (title === name) {
                deselect(card);
            }
        });
        updateCartCount();
        requestAnimationFrame(() => {
            sumTotalOrdered();
        });
    });

    divContainer.appendChild(orderNameTag);
    divContainer.appendChild(orderQuantityTag);
    divContainer.appendChild(orderPriceTag);
    divContainer.appendChild(orderTotalTag);

    newOrder.appendChild(divContainer);
    newOrder.appendChild(btnRemove);
    cartContent.appendChild(newOrder);

    checkIfCartIsEmpty();
    updateCartCount();
    sumTotalOrdered();
    modalDisplay(name, price, quantity, img);
}
function showNormalCart() {
    const cartContent = document.querySelector(".cart-content");
    const img = document.querySelector(".empty-cart-image");
    const message = document.querySelector(".empty-message");
    const totalOrder = document.querySelector(".order-total");
    const txt = document.querySelector(".txt-checkout");
    const totalValue = document.querySelector(".value-total");
    const msgCart = document.querySelector(".message-cart");
    const btnConfirmOrder = document.querySelector(".btn-order");

    btnConfirmOrder.classList.add("hidden");
    totalOrder.classList.add("hidden");
    txt.classList.add("hidden");
    totalValue.classList.add("hidden");
    msgCart.classList.add("hidden");
    img.classList.remove("hidden");
    message.classList.remove("hidden");
    cartContent.classList.add("cart-content");
}

function hiddenElementsOnCart() {
    const cartContent = document.querySelector(".cart-content");
    const img = document.querySelector(".empty-cart-image");
    const message = document.querySelector(".empty-message");
    img.classList.add("hidden");
    message.classList.add("hidden");
    cartContent.classList.add("cart-content-2");
}
function checkIfCartIsEmpty() {
    const cartItems = document.querySelectorAll("#cart-items .div-style");
    const img = document.querySelector(".empty-cart-image");
    const message = document.querySelector(".empty-message");
    const cartWrapper = document.querySelector(".cart-content");

    if (cartItems.length === 0) {
        img.classList.remove("hidden");
        message.classList.remove("hidden");
        cartWrapper.classList.remove("cart-content-2");

        const totalValue = document.querySelector(".value-total");
        totalValue.textContent = "$0.00";
    } else {
        img.classList.add("hidden");
        message.classList.add("hidden");
        cartWrapper.classList.add("cart-content-2");
    }
}
function updateCartCount() {
    const count = document.querySelectorAll("#cart-items .div-style").length;
    const cartCount = document.querySelector("#cart-count");
    cartCount.textContent = count;

    if (count === 0) {
        showNormalCart();
    }
    sumTotalOrdered();
}
function deselect(card) {
    const cardImage = card.querySelector(".card-image");
    const addToCartBtn = card.querySelector(".add-to-cart");
    const quantitySelector = card.querySelector(".quantity-selector");
    cardImage.classList.remove("active");
    addToCartBtn.classList.remove("hidden");
    quantitySelector.classList.add("hidden");
}
function sumTotalOrdered() {
    const totalValue = document.querySelector(".value-total");
    const allTotals = document.querySelectorAll(".total-price");
    const priceFinal = document.querySelector("#modal-total");

    let sum = 0;
    allTotals.forEach((el) => {
        const value = parseFloat(el.textContent.replace("$", ""));
        if (!isNaN(value)) {
            sum += value;
        }
    });

    totalValue.textContent = `$${sum.toFixed(2)}`;

    if (priceFinal) {
        priceFinal.textContent = `$${sum.toFixed(2)}`;
    }
    return sum;
}

function modalDisplay(name, price, quantity, imgUrl) {
    const productsConfirmed = document.querySelector(".products-confirmed");
    const priceFinal = document.querySelector("#modal-total");
    // Verifica se já existe esse produto no modal
    const existing = Array.from(
        productsConfirmed.querySelectorAll(".info-products")
    ).find((product) => {
        const title = product.querySelector(".title-product");
        return title && title.textContent === name;
    });

    if (existing) {
        // Atualiza a quantidade e o total
        existing.querySelector(".quantity-modal").textContent = `${quantity}x`;
        existing.querySelector(".price").textContent = `@$${price.toFixed(2)}`;
        existing.querySelector(".price-modal").textContent = `$${(
            price * quantity
        ).toFixed(2)}`;
        return;
    }

    const infoProducts = document.createElement("div");
    infoProducts.classList.add("info-products");
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const descriptionMod = document.createElement("div");
    const titleMod = document.createElement("p");
    const values = document.createElement("div");
    const quantityMod = document.createElement("span");
    const priceIndiv = document.createElement("span");
    const priceTotal = document.createElement("span");
    const imgMod = document.createElement("img");

    // Classes
    imgMod.classList.add("img-modal");
    priceIndiv.classList.add("price");
    quantityMod.classList.add("quantity-modal");
    values.classList.add("values-modal");
    descriptionMod.classList.add("description-modal");
    titleMod.classList.add("title-product");
    priceTotal.classList.add("price-modal");

    // Conteúdo
    imgMod.src = imgUrl;
    imgMod.alt = name;
    titleMod.textContent = name;
    quantityMod.textContent = `${quantity}x`;
    priceIndiv.textContent = `@$${price.toFixed(2)}`;
    priceTotal.textContent = `$${(price * quantity).toFixed(2)}`;
    priceFinal.textContent = `$${sumTotalOrdered().toFixed(2)}`;
    // Montagem dos elementos
    imgContainer.appendChild(imgMod);
    values.appendChild(quantityMod);
    values.appendChild(priceIndiv);
    descriptionMod.appendChild(titleMod);
    descriptionMod.appendChild(values);
    infoProducts.appendChild(imgContainer);
    infoProducts.appendChild(descriptionMod);
    infoProducts.appendChild(priceTotal);

    // Adiciona o bloco completo ao modal
    productsConfirmed.insertBefore(
        infoProducts,
        productsConfirmed.querySelector(".order-final")
    );
}
document.querySelector(".btn-order").addEventListener("click", function () {
    const modal = document.querySelector(".modal-overlay");
    modal.classList.remove("hidden");
});
document.querySelector("#btn-reload").addEventListener("click", function () {
    location.reload();
});