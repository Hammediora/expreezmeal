# 📧 ExpreeZmeal Email Template System

## 🎯 Overview

The email system has been refactored to use **Jinja2 templates** instead of hardcoded HTML strings in Python. This provides better separation of concerns, easier maintenance, and more flexibility.

## 📁 Structure

```
backend/
├── email_service.py           # Main email service logic
├── email_templates/           # Email template directory
│   ├── base.html             # Base template with common layout
│   ├── order_confirmation.html  # Order confirmation emails
│   ├── order_status_update.html # Status update emails
│   ├── new_menu_item.html    # New menu item notifications
│   ├── welcome.html          # Welcome emails for new customers
│   └── order_ready.html      # Order ready for pickup
└── .env                      # Environment variables (Resend API key)
```

## 🛠 How It Works

### 1. **Email Service Class**
```python
from email_service import email_service

# Send order confirmation
email_service.send_order_confirmation(order_data, customer_info)

# Send status update
email_service.send_order_status_update(order_data, customer_info, "READY")

# Send new menu item notification
email_service.send_new_menu_item_notification(item_data, customer_emails)
```

### 2. **Template System**
- **Base Template**: `base.html` contains common layout, styles, header, footer
- **Child Templates**: Extend base template and fill in content blocks
- **Variables**: Dynamic content passed from Python to templates

### 3. **Template Variables**
Common variables available in all templates:
- `support_email`: support@bellocraft.com
- `pickup_address`: Restaurant location details
- `current_year`: Current year for copyright

## 📋 Available Templates

### 🧾 Order Confirmation (`order_confirmation.html`)
**Used for**: New order confirmations
**Variables**:
- `customer_name`: Customer's name
- `order_id`: Order ID
- `order_status`: Order status
- `order_items`: List of ordered items
- `subtotal`, `tax_amount`, `total_amount`: Pricing (in cents)

### 🔄 Order Status Update (`order_status_update.html`)
**Used for**: Order status changes (PREPARING, READY, etc.)
**Variables**:
- `customer_name`: Customer's name
- `order_id`: Order ID
- `new_status`: Updated status
- `status_message`: Human-readable status message
- `status_color`: Color for status display
- `total_amount`: Order total (in cents)

### 🆕 New Menu Item (`new_menu_item.html`)
**Used for**: Marketing new menu items
**Variables**:
- `item_name`: Menu item name
- `item_description`: Item description
- `item_price`: Item price (in cents)
- `item_image_url`: Image URL
- `menu_url`: Link to menu page

### 👋 Welcome Email (`welcome.html`)
**Used for**: Welcome new customers
**Variables**:
- `customer_name`: Customer's name
- `menu_url`: Link to menu page

### 🔔 Order Ready (`order_ready.html`)
**Used for**: When order is ready for pickup
**Variables**:
- `customer_name`: Customer's name
- `order_id`: Order ID
- `ready_time`: When order was ready
- `total_amount`: Order total (in cents)

## 🎨 Adding New Templates

### 1. Create Template File
```html
<!-- email_templates/new_template.html -->
{% extends "base.html" %}

{% block content %}
<h2>Your Custom Content</h2>
<p>Hello {{ customer_name }}!</p>
<!-- Your template content -->
{% endblock %}
```

### 2. Add Method to EmailService
```python
def send_custom_email(self, data: Dict, customer_info: Dict) -> bool:
    try:
        context = {
            'email_title': 'Custom Email',
            'header_subtitle': 'Custom Subtitle',
            'customer_name': customer_info.get('name', 'Customer'),
            # Add your variables
        }

        html_content = self._render_template('new_template.html', **context)

        response = resend.Emails.send({
            "from": self.from_email,
            "to": customer_info.get('email'),
            "subject": "Your Subject",
            "html": html_content
        })

        return True
    except Exception as e:
        print(f"❌ Failed to send custom email: {str(e)}")
        return False
```

## 🔧 Configuration

### Environment Variables (.env)
```
RESEND_API_KEY=re_your_resend_api_key_here
```

### Email Settings
```python
# In EmailService.__init__()
self.from_email = "orders@bellocraft.com"
self.support_email = "support@bellocraft.com"
```

## 🚀 API Endpoints

### Test Email
```bash
POST /api/test-email
Content-Type: application/json
{
  "email": "customer@example.com"
}
```

### Send Order Confirmation
```bash
POST /api/orders/{order_id}/send-confirmation
Content-Type: application/json
{
  "email": "customer@example.com",
  "name": "Customer Name",
  "phone": "+1234567890"
}
```

### Update Order Status
```bash
POST /api/orders/{order_id}/update-status
Content-Type: application/json
{
  "status": "READY",
  "customer_email": "customer@example.com",
  "customer_name": "Customer Name"
}
```

### New Menu Item Notification
```bash
POST /api/menu-items/notify-new
Content-Type: application/json
{
  "item_id": "menu_item_uuid",
  "customer_emails": ["customer1@example.com", "customer2@example.com"]
}
```

## 🧪 Testing

### Admin Dashboard
Visit `http://localhost:5000/admin/email-test` for a web interface to test all email functionality.

### Command Line Testing
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/test-email" -Method POST -ContentType "application/json" -Body '{"email": "test@example.com"}'
```

## 🎨 Styling Guidelines

### Email-Safe CSS
- Use inline styles for email compatibility
- Avoid complex CSS features
- Test with multiple email clients
- Use table-based layouts for maximum compatibility

### Brand Colors
- Primary: `#667eea` (purple-blue gradient start)
- Secondary: `#764ba2` (purple gradient end)
- Success: `#28a745` (green)
- Warning: `#ffc107` (yellow)
- Error: `#dc3545` (red)

## 📈 Future Enhancements

1. **Email Analytics**: Track open rates, click rates
2. **A/B Testing**: Test different email designs
3. **Personalization**: Dynamic content based on customer preferences
4. **Email Scheduling**: Queue emails for optimal send times
5. **Rich Templates**: More interactive email components
6. **Multi-language**: Support for multiple languages

## 🔍 Troubleshooting

### Common Issues

1. **Template Not Found**
   - Check file path in `email_templates/`
   - Verify template name in `_render_template()` call

2. **Variable Errors**
   - Check template variables match context data
   - Use `{{ variable|default('fallback') }}` for optional vars

3. **Email Not Sending**
   - Verify `RESEND_API_KEY` in `.env`
   - Check server logs for error messages
   - Confirm "from" email domain is verified in Resend

4. **Styling Issues**
   - Use inline styles for email compatibility
   - Test with different email clients
   - Avoid complex CSS features
