const productForm = document.getElementById("productForm");
const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");

let products = [];
let currentDirection = "Forward";


productForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const product = {
        code: document.getElementById("code").value.trim(),
        name: document.getElementById("name").value.trim(),
        category: document.getElementById("category").value.trim(),
        quantity: Number(document.getElementById("quantity").value),
        price: Number(document.getElementById("price").value)
    };


    try {

        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });


        const data = await response.json();


        if (!response.ok) {
            showMessage(data.error, "error");
            return;
        }


        productForm.reset();

        showMessage(
            "Product added successfully",
            "success"
        );

        loadProducts();

    } catch (error) {

        showMessage(
            "Unable to connect to the server",
            "error"
        );

    }

});


async function loadProducts() {

    try {

        const response =
            await fetch("/api/products");

        const data =
            await response.json();

        products = data.products;

        currentDirection = "Forward";

        document.getElementById(
            "currentDirection"
        ).textContent = "Forward";

        renderProducts(products);

        updateStats(products.length);

    } catch (error) {

        console.error(error);

    }

}


async function loadReverse() {

    try {

        const response =
            await fetch("/api/products/reverse");

        const data =
            await response.json();

        products = data.products;

        currentDirection = "Reverse";

        document.getElementById(
            "currentDirection"
        ).textContent = "Reverse";

        renderProducts(products);

        updateStats(products.length);

    } catch (error) {

        console.error(error);

    }

}


function renderProducts(list) {

    productTable.innerHTML = "";


    if (list.length === 0) {

        productTable.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty">
                        📦<br><br>
                        No products found
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    list.forEach((product) => {

        const row =
            document.createElement("tr");

        const initial =
            product.name.charAt(0).toUpperCase();

        const stockClass =
            Number(product.quantity) > 5
                ? "good"
                : "low";

        const stockText =
            Number(product.quantity) > 5
                ? "Available"
                : "Low stock";

        const formattedPrice =
            Number(product.price).toLocaleString(
                "es-CO",
                {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0
                }
            );


        row.innerHTML = `

            <td>

                <div class="product">

                    <div class="product-avatar">
                        ${initial}
                    </div>

                    <div>

                        <strong>
                            ${escapeHtml(product.name)}
                        </strong>

                        <small>
                            Inventory product
                        </small>

                    </div>

                </div>

            </td>


            <td>
                <strong>
                    ${escapeHtml(product.code)}
                </strong>
            </td>


            <td>

                <span class="category">
                    ${escapeHtml(product.category)}
                </span>

            </td>


            <td>
                ${product.quantity}
            </td>


            <td>

                <span class="price">
                    ${formattedPrice}
                </span>

            </td>


            <td>

                <span class="stock ${stockClass}">

                    <span class="stock-dot"></span>

                    ${stockText}

                </span>

            </td>


            <td>

                <button
                    class="delete-button"
                    onclick="deleteProduct('${escapeAttribute(product.code)}')"
                    title="Delete product"
                >
                    ×
                </button>

            </td>

        `;


        productTable.appendChild(row);

    });

}


async function deleteProduct(code) {

    const confirmed =
        confirm(
            `Delete product ${code}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/products/${encodeURIComponent(code)}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.error,
                "error"
            );

            return;
        }


        showMessage(
            "Product deleted successfully",
            "success"
        );


        if (currentDirection === "Reverse") {
            loadReverse();
        } else {
            loadProducts();
        }


    } catch (error) {

        showMessage(
            "Unable to delete product",
            "error"
        );

    }

}


searchInput.addEventListener(
    "input",
    () => {

        const text =
            searchInput.value
                .toLowerCase()
                .trim();


        const filtered =
            products.filter((product) => {

                return (

                    product.code
                        .toLowerCase()
                        .includes(text)

                    ||

                    product.name
                        .toLowerCase()
                        .includes(text)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(text)

                );

            });


        renderProducts(filtered);

    }
);


function updateStats(total) {

    document.getElementById(
        "totalProducts"
    ).textContent = total;


    document.getElementById(
        "activeNodes"
    ).textContent = total;

}


function showMessage(message, type) {

    const existing =
        document.querySelector(".message");

    if (existing) {
        existing.remove();
    }


    const messageBox =
        document.createElement("div");

    messageBox.className =
        `message ${type}`;


    messageBox.textContent =
        message;


    Object.assign(
        messageBox.style,
        {
            position: "fixed",
            top: "25px",
            right: "25px",
            zIndex: "9999",
            padding: "14px 20px",
            background: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 15px 40px rgba(0,0,0,.15)",
            borderLeft:
                type === "success"
                    ? "4px solid #10b981"
                    : "4px solid #ef4444",
            fontSize: "12px",
            fontWeight: "600"
        }
    );


    document.body.appendChild(messageBox);


    setTimeout(() => {

        messageBox.remove();

    }, 3000);

}


function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


loadProducts();
