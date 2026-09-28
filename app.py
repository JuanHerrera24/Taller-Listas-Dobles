from flask import Flask, render_template, request, jsonify

from lista_doble import DoublyLinkedList


app = Flask(__name__)

inventory = DoublyLinkedList()


inventory.add({
    "code": "P001",
    "name": "Laptop Lenovo",
    "category": "Technology",
    "quantity": 12,
    "price": 2500000
})

inventory.add({
    "code": "P002",
    "name": "Wireless Mouse",
    "category": "Accessories",
    "quantity": 25,
    "price": 85000
})

inventory.add({
    "code": "P003",
    "name": "Mechanical Keyboard",
    "category": "Accessories",
    "quantity": 8,
    "price": 320000
})


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/products", methods=["GET"])
def get_products():

    products = inventory.get_all()

    return jsonify({
        "products": products,
        "total": inventory.count()
    })


@app.route("/api/products/reverse", methods=["GET"])
def get_reverse_products():

    products = inventory.get_reverse()

    return jsonify({
        "products": products,
        "total": inventory.count()
    })


@app.route("/api/products", methods=["POST"])
def add_product():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Invalid data"
        }), 400

    code = str(data.get("code", "")).strip()
    name = str(data.get("name", "")).strip()
    category = str(data.get("category", "")).strip()

    try:
        quantity = int(data.get("quantity", 0))
        price = float(data.get("price", 0))
    except (ValueError, TypeError):
        return jsonify({
            "error": "Quantity and price must be numeric"
        }), 400

    if not code or not name or not category:
        return jsonify({
            "error": "All fields are required"
        }), 400

    if quantity < 0 or price < 0:
        return jsonify({
            "error": "Quantity and price cannot be negative"
        }), 400

    if inventory.search(code):
        return jsonify({
            "error": "A product with this code already exists"
        }), 409

    product = {
        "code": code,
        "name": name,
        "category": category,
        "quantity": quantity,
        "price": price
    }

    inventory.add(product)

    return jsonify({
        "message": "Product added successfully",
        "product": product
    }), 201


@app.route("/api/products/<code>", methods=["GET"])
def search_product(code):

    product = inventory.search(code)

    if product is None:
        return jsonify({
            "error": "Product not found"
        }), 404

    return jsonify({
        "product": product
    })


@app.route("/api/products/<code>", methods=["DELETE"])
def delete_product(code):

    deleted = inventory.delete(code)

    if not deleted:
        return jsonify({
            "error": "Product not found"
        }), 404

    return jsonify({
        "message": "Product deleted successfully"
    })


if __name__ == "__main__":
    app.run(debug=True)
