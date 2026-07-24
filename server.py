from flask import Flask, request, jsonify

app = Flask(__name__)

menu = {
    "mocha": {"base": 150, "icecream": 20, "topping": 30, "sugar": 10},
    "capchunio": {"base": 120, "icecream": 15, "topping": 25, "sugar": 8},
    "latte": {"base": 100, "icecream": 10, "topping": 20, "sugar": 5},
    "coldcoffe": {"base": 80, "icecream": 5, "topping": 10, "sugar": 5},
    "blackcofee": {"base": 50, "icecream": 0, "topping": 0, "sugar": 0},
}


@app.route('/api/order', methods=['POST'])
def place_order():
    data = request.get_json(silent=True) or {}
    drink = data.get('drink', '').lower()
    quantity = data.get('quantity', 1)

    if drink not in menu:
        return jsonify({'error': 'Invalid drink selected'}), 400

    try:
        quantity = int(quantity)
    except (TypeError, ValueError):
        return jsonify({'error': 'Quantity must be a number'}), 400

    if quantity <= 0:
        return jsonify({'error': 'Quantity must be positive'}), 400

    item = menu[drink]
    subtotal = item['base'] + item['icecream'] + item['topping'] + item['sugar']
    discount = subtotal * 0.10 if subtotal > 200 else 0
    final_price = subtotal - discount
    bill = final_price * quantity
    points = bill // 100

    return jsonify({
        'message': f'Your {drink} order has been placed successfully.',
        'bill': round(bill, 2),
        'points': int(points)
    })


if __name__ == '__main__':
    app.run(debug=True)
