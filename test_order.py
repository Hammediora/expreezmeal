import requests

# Test order creation with valid UUID
order_data = {
    'items': [
        {
            'menu_item_id': 'd51712d5-2b18-453b-b301-8f04b5c612c5',
            'quantity': 1,
            'special_instructions': 'Extra sauce please',
            'customizations': []
        }
    ],
    'delivery_address': {
        'name': 'Test Customer',
        'email': 'hammedbello97@gmail.com',
        'phone': '+1234567890'
    },
    'payment_method': 'card',
    'special_instructions': 'Test order for email integration',
    'tip_amount': 200
}

response = requests.post('http://localhost:5000/api/orders/create', json=order_data)
print(f'Order creation: {response.status_code}')
if response.status_code == 200:
    result = response.json()
    print(f'Order ID: {result["order_id"]}')
    print(f'Total: ${result["total_amount"]/100:.2f}')
else:
    print(f'Error: {response.text}')
