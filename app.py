
from flask import Flask, request, jsonify

# Create the application instance
app = Flask(__name__)


# In-memory data store for demonstration
items = {}

# GET all items
@app.route('/items', methods=['GET'])
def get_items():
    return jsonify(items)

# GET a single item by id
@app.route('/items/<item_id>', methods=['GET'])
def get_item(item_id):
    item = items.get(item_id)
    if item is None:
        return jsonify({'error': 'Item not found'}), 404
    return jsonify({item_id: item})

# CREATE a new item
@app.route('/items', methods=['POST'])
def create_item():
    data = request.get_json()
    if not data or 'id' not in data or 'value' not in data:
        return jsonify({'error': 'Invalid input'}), 400
    item_id = str(data['id'])
    if item_id in items:
        return jsonify({'error': 'Item already exists'}), 400
    items[item_id] = data['value']
    return jsonify({'message': 'Item created', item_id: items[item_id]}), 201

# UPDATE an existing item
@app.route('/items/<item_id>', methods=['PUT'])
def update_item(item_id):
    if item_id not in items:
        return jsonify({'error': 'Item not found'}), 404
    data = request.get_json()
    if not data or 'value' not in data:
        return jsonify({'error': 'Invalid input'}), 400
    items[item_id] = data['value']
    return jsonify({'message': 'Item updated', item_id: items[item_id]})

# DELETE an item
@app.route('/items/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    if item_id not in items:
        return jsonify({'error': 'Item not found'}), 404
    deleted = items.pop(item_id)
    return jsonify({'message': 'Item deleted', item_id: deleted})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)