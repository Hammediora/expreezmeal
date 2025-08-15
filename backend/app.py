import os
import secrets
from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect, url_for, flash, g, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_session import Session
from flask_cors import CORS
import redis
import stripe
import jwt
from functools import wraps
from datetime import datetime, timezone
from email_service import email_service

# Load environment variables before using them
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Ensure DATABASE_URL is set
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set. Check your environment variables.")

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")

if not stripe.api_key or not STRIPE_PUBLISHABLE_KEY:
    raise ValueError("Stripe keys are not set. Check your environment variables.")

# Configure Flask App for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database (import after defining db)
from database import db  # Now db is already defined in database.py

db.init_app(app)
migrate = Migrate(app, db)

# Import models after db is initialized
from database import (User, Address, Category, MenuItem, Order, OrderItem,
                     Payment, DeliveryServiceOrder, CustomizationOption,
                     OptionChoice, OrderItemCustomization, ContactInquiry)

# Import admin routes
from admin_routes import admin_bp
from admin_menu_routes import admin_menu

# Flask session & Redis setup
token = secrets.token_hex(64)
app.secret_key = token
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/1'))
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True  # Security improvement
app.config['SESSION_KEY_PREFIX'] = "expreezmeal_"  # Prefix for Redis sessions

server_session = Session(app)
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'])

# Register admin blueprints
app.register_blueprint(admin_bp)
app.register_blueprint(admin_menu)

def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session and session['logged_in']:
            print("User is logged in")
            return f(*args, **kwargs)
        else:
            flash("You need to login for access")
            return redirect(url_for('login'))
    return wrap

def admin_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'is_superuser' in session and session['is_superuser']:
            print("User is admin")
            return f(*args, **kwargs)
        else:
            flash("You need to be an admin to access this page")
            return redirect(url_for('login'))
    return wrap


@app.before_request
def before_request():
    g.user = None
    if 'user' in session:
        g.user = session['user']


headers = {
    'Content-Type': 'text/html',
    'charset': 'utf-8',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
    "Authorization": "Bearer " + token
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/index-2')
def index_2():
    return render_template('index-2.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('sign-up.html')

@app.route('/all_food')
def all_food():
    return render_template('all-food.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact-us.html')

# create a route for terms-service, trust-safety, privacy-policy, food-details, blog, blog-details, logout, shopping-cart, shopping-cart-02, shopping-cart-address, shopping-cart-new-address
@app.route('/terms-service')
def terms_service():
    return render_template('terms-service.html')

@app.route('/trust-safety')
def trust_safety():
    return render_template('trust-safety.html')

@app.route('/privacy-policy')
def privacy_policy():
    return render_template('privacy-policy.html')

@app.route('/foods-details')
def foods_details():
    return render_template('foods-details.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/blog-details')
def blog_details():
    return render_template('blog-details.html')

@app.route('/logout')
def logout():
    return render_template('logout.html')

@app.route('/shopping-cart')
def shopping_cart():
    return render_template('shopping-cart.html')

@app.route('/shopping-cart-02')
def shopping_cart_02():
    return render_template('shopping-cart-02.html')

@app.route('/shopping-cart-address')
def shopping_cart_address():
    return render_template('shopping-cart-address.html')

@app.route('/shopping-cart-new-address')
def shopping_cart_new_address():
    return render_template('shopping-cart-new-address.html')

@app.route('/admin/email-test')
def admin_email_test():
    return render_template('admin_email_test.html')

# ============= API ROUTES FOR FRONTEND =============

@app.route('/api/health')
def health_check():
    """Health check endpoint for frontend"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now(timezone.utc).isoformat()
    })

@app.route('/api/categories')
def get_categories():
    """Get all food categories"""
    try:
        categories = Category.query.filter_by(is_active=True).order_by(Category.display_order).all()
        return jsonify([{
            'id': cat.id,
            'name': cat.name,
            'description': cat.description,
            'image_url': cat.image_url,
            'display_order': cat.display_order
        } for cat in categories])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/menu-items')
def get_menu_items():
    """Get all menu items with optional category filter"""
    try:
        category_id = request.args.get('category_id')
        query = MenuItem.query.filter_by(is_available=True)

        if category_id:
            query = query.filter_by(category_id=category_id)

        menu_items = query.all()
        return jsonify([{
            'id': item.id,
            'category_id': item.category_id,
            'name': item.name,
            'description': item.description,
            'price': int(float(item.price) * 100),  # Convert dollars to cents for frontend
            'sale_price': int(float(item.sale_price) * 100) if item.sale_price else None,  # Convert dollars to cents for frontend
            'image_url': item.image_url,
            'is_featured': item.is_featured,
            'preparation_time': item.preparation_time,
            'calories': item.calories,
            'allergens': item.allergens,
            'dietary_flags': item.dietary_flags,
            'customization_options': [{
                'id': opt.id,
                'name': opt.name,
                'type': opt.type,
                'is_required': opt.is_required,
                'display_order': opt.display_order,
                'choices': [{
                    'id': choice.id,
                    'name': choice.name,
                    'price_modifier': int(float(choice.price_modifier) * 100),  # Convert dollars to cents for frontend
                    'is_default': choice.is_default,
                    'display_order': choice.display_order
                } for choice in sorted(opt.option_choices, key=lambda x: x.display_order)]
            } for opt in sorted(item.customization_options, key=lambda x: x.display_order)]
        } for item in menu_items])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/menu-items/featured')
def get_featured_items():
    """Get featured menu items"""
    try:
        featured_items = MenuItem.query.filter_by(is_available=True, is_featured=True).limit(6).all()
        return jsonify([{
            'id': item.id,
            'category_id': item.category_id,
            'name': item.name,
            'description': item.description,
            'price': int(float(item.price) * 100),  # Convert dollars to cents for frontend
            'sale_price': int(float(item.sale_price) * 100) if item.sale_price else None,  # Convert dollars to cents for frontend
            'image_url': item.image_url,
            'is_available': item.is_available,
            'is_featured': item.is_featured,
            'preparation_time': item.preparation_time,
            'calories': item.calories,
            'allergens': item.allergens,
            'dietary_flags': item.dietary_flags,
            'customization_options': [{
                'id': option.id,
                'name': option.name,
                'type': option.type,
                'is_required': option.is_required,
                'display_order': option.display_order,
                'choices': [{
                    'id': choice.id,
                    'name': choice.name,
                    'price_modifier': int(float(choice.price_modifier) * 100),  # Convert dollars to cents for frontend
                    'is_default': choice.is_default,
                    'display_order': choice.display_order
                } for choice in option.option_choices]
            } for option in item.customization_options] if item.customization_options else []
        } for item in featured_items])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/menu-items/<item_id>')
def get_menu_item(item_id):
    """Get single menu item by ID"""
    try:
        item = MenuItem.query.get_or_404(item_id)
        return jsonify({
            'id': item.id,
            'category_id': item.category_id,
            'name': item.name,
            'description': item.description,
            'price': float(item.price),
            'sale_price': float(item.sale_price) if item.sale_price else None,
            'image_url': item.image_url,
            'is_available': item.is_available,
            'is_featured': item.is_featured,
            'preparation_time': item.preparation_time,
            'calories': item.calories,
            'allergens': item.allergens,
            'dietary_flags': item.dietary_flags,
            'customization_options': [{
                'id': opt.id,
                'name': opt.name,
                'type': opt.type,
                'is_required': opt.is_required,
                'display_order': opt.display_order,
                'choices': [{
                    'id': choice.id,
                    'name': choice.name,
                    'price_modifier': float(choice.price_modifier),
                    'is_default': choice.is_default,
                    'display_order': choice.display_order
                } for choice in sorted(opt.option_choices, key=lambda x: x.display_order)]
            } for opt in sorted(item.customization_options, key=lambda x: x.display_order)]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<order_id>')
def get_order(order_id):
    """Get order by ID"""
    try:
        order = Order.query.get_or_404(order_id)
        return jsonify({
            'id': order.id,
            'status': order.status,
            'order_type': order.order_type,
            'subtotal': float(order.subtotal),
            'tax': float(order.tax),
            'tip': float(order.tip) if order.tip else 0,
            'total': float(order.total),
            'created_at': order.created_at.isoformat(),
            'estimated_delivery_time': order.estimated_delivery_time.isoformat() if order.estimated_delivery_time else None,
            'special_instructions': order.special_instructions,
            'items': [{
                'id': item.id,
                'menu_item_id': item.menu_item_id,
                'quantity': item.quantity,
                'unit_price': float(item.unit_price),
                'total_price': float(item.total_price),
                'special_instructions': item.special_instructions,
                'customizations': [{
                    'customization_option_id': custom.customization_option_id,
                    'option_choice_id': custom.option_choice_id,
                    'price_modifier': float(custom.price_modifier),
                    'option_name': custom.customization_option.name,
                    'choice_name': custom.option_choice.name
                } for custom in item.customizations]
            } for item in order.order_items]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Stripe Payment Endpoints
@app.route('/api/stripe/config', methods=['GET'])
def get_stripe_config():
    """Get Stripe publishable key for frontend"""
    return jsonify({
        'publishable_key': STRIPE_PUBLISHABLE_KEY
    })


@app.route('/api/stripe/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """Create a Stripe PaymentIntent for checkout"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['amount', 'currency']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        amount = int(data['amount'])  # Amount in cents
        currency = data.get('currency', 'usd')

        # Create PaymentIntent with automatic payment methods
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            automatic_payment_methods={
                'enabled': True,
            },
            metadata={
                'order_id': data.get('order_id', ''),
                'customer_email': data.get('customer_email', ''),
                'customer_name': data.get('customer_name', ''),
                'customer_phone': data.get('customer_phone', ''),
            }
        )

        return jsonify({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        })

    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders/create', methods=['POST'])
def create_order():
    """Create a new order with payment processing"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['items', 'delivery_address', 'payment_method']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Calculate order totals
        subtotal = 0
        order_items_data = []

        for item_data in data['items']:
            # Get menu item
            menu_item = db.session.get(MenuItem, item_data['menu_item_id'])
            if not menu_item:
                return jsonify({'error': f'Menu item not found: {item_data["menu_item_id"]}'}), 404

            quantity = item_data.get('quantity', 1)
            unit_price = int(float(menu_item.price) * 100)  # Convert dollars to cents

            # Calculate customization costs
            customization_cost = 0
            customizations_data = []

            if 'customizations' in item_data:
                for custom in item_data['customizations']:
                    option_choice = db.session.get(OptionChoice, custom['option_choice_id'])
                    if option_choice:
                        customization_cost += int(float(option_choice.price_modifier) * 100)  # Convert dollars to cents
                        customizations_data.append({
                            'customization_option_id': custom['customization_option_id'],
                            'option_choice_id': custom['option_choice_id'],
                            'price_modifier': int(float(option_choice.price_modifier) * 100)  # Store in cents
                        })

            total_unit_price = unit_price + customization_cost
            total_price = total_unit_price * quantity
            subtotal += total_price

            order_items_data.append({
                'menu_item_id': item_data['menu_item_id'],
                'quantity': quantity,
                'unit_price': total_unit_price,
                'total_price': total_price,
                'special_instructions': item_data.get('special_instructions', ''),
                'customizations': customizations_data
            })

        # Calculate tax and total
        tax_rate = 0.08875  # 8.875% tax rate (adjust as needed)
        tax_amount = int(subtotal * tax_rate)  # Now subtotal is in cents (integer)
        tip_amount = data.get('tip_amount', 0)
        total_amount = subtotal + tax_amount + tip_amount

        # Convert cents back to dollars for database storage (Order model expects Decimal)
        from decimal import Decimal
        subtotal_dollars = Decimal(str(subtotal / 100))
        tax_dollars = Decimal(str(tax_amount / 100))
        tip_dollars = Decimal(str(tip_amount / 100))
        total_dollars = Decimal(str(total_amount / 100))

        # Create order
        new_order = Order(
            user_id=None,  # No user authentication yet
            order_type='PICKUP',  # Since this is pickup only
            subtotal=subtotal_dollars,
            tax=tax_dollars,
            tip=tip_dollars,
            total=total_dollars,
            status='PENDING',
            special_instructions=data.get('special_instructions', '')
        )

        db.session.add(new_order)
        db.session.flush()  # Get the order ID

        # Create order items
        for item_data in order_items_data:
            # Convert cents to dollars for database storage
            unit_price_dollars = Decimal(str(item_data['unit_price'] / 100))
            total_price_dollars = Decimal(str(item_data['total_price'] / 100))

            order_item = OrderItem(
                order_id=new_order.id,
                menu_item_id=item_data['menu_item_id'],
                quantity=item_data['quantity'],
                unit_price=unit_price_dollars,
                total_price=total_price_dollars,
                special_instructions=item_data['special_instructions']
            )
            db.session.add(order_item)
            db.session.flush()

            # Create customizations
            for custom_data in item_data['customizations']:
                # Convert price modifier from cents to dollars
                price_modifier_dollars = Decimal(str(custom_data['price_modifier'] / 100))

                customization = OrderItemCustomization(
                    order_item_id=order_item.id,
                    customization_option_id=custom_data['customization_option_id'],
                    option_choice_id=custom_data['option_choice_id'],
                    price_modifier=price_modifier_dollars
                )
                db.session.add(customization)

        # Create payment record
        payment = Payment(
            order_id=new_order.id,
            amount=total_dollars,  # Use the dollar amount instead of cents
            payment_method=data['payment_method'],
            payment_status='PENDING'
        )
        db.session.add(payment)

        db.session.commit()

        return jsonify({
            'order_id': new_order.id,
            'total_amount': total_amount,
            'subtotal': subtotal,
            'tax_amount': tax_amount,
            'tip_amount': tip_amount,
            'status': 'PENDING'
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders/<order_id>/confirm-payment', methods=['POST'])
def confirm_payment(order_id):
    """Confirm payment for an order"""
    try:
        data = request.get_json()
        payment_intent_id = data.get('payment_intent_id')

        if not payment_intent_id:
            return jsonify({'error': 'Missing payment_intent_id'}), 400

        # Verify payment with Stripe
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)

        if intent.status != 'succeeded':
            return jsonify({'error': 'Payment not successful'}), 400

        # Update order and payment status
        order = db.session.get(Order, order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        payment = Payment.query.filter_by(order_id=order_id).first()
        if payment:
            payment.payment_status = 'COMPLETED'
            payment.transaction_id = payment_intent_id

        order.status = 'CONFIRMED'
        order.updated_at = datetime.now(timezone.utc)

        db.session.commit()

        # Automatically send confirmation email if customer email is in metadata
        customer_email = intent.metadata.get('customer_email')
        customer_name = intent.metadata.get('customer_name', 'Customer')

        if customer_email:
            try:
                # Prepare order data for email
                order_items = []
                for item in order.order_items:
                    menu_item = db.session.get(MenuItem, item.menu_item_id)
                    customizations = []

                    for custom in item.customizations:
                        option = db.session.get(CustomizationOption, custom.customization_option_id)
                        choice = db.session.get(OptionChoice, custom.option_choice_id)
                        if option and choice:
                            customizations.append(f"{option.name}: {choice.name}")

                    order_items.append({
                        'name': menu_item.name if menu_item else 'Item',
                        'quantity': item.quantity,
                        'price': float(item.total_price),
                        'customizations': ', '.join(customizations) if customizations else ''
                    })

                order_data = {
                    'order_id': order_id,
                    'status': order.status,
                    'subtotal': int(float(order.subtotal) * 100),  # Convert to cents
                    'tax_amount': int(float(order.tax) * 100),  # Convert to cents
                    'total_amount': int(float(order.total) * 100),  # Convert to cents
                    'items': order_items
                }

                customer_info = {
                    'name': customer_name,
                    'email': customer_email,
                    'phone': intent.metadata.get('customer_phone', '')
                }

                # Send confirmation email (now has built-in retry logic)
                success = email_service.send_order_confirmation(order_data, customer_info)
                if success:
                    print(f"✅ Confirmation email sent to {customer_email} for order {order_id}")
                else:
                    print(f"❌ Failed to send confirmation email to {customer_email} for order {order_id}")

            except Exception as email_error:
                print(f"❌ Email service error: {email_error}")
                # Don't fail the payment confirmation if email fails

        return jsonify({
            'order_id': order_id,
            'status': 'CONFIRMED',
            'payment_status': 'COMPLETED'
        })

    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders/<order_id>/send-confirmation', methods=['POST'])
def send_order_confirmation(order_id):
    """Send order confirmation email"""
    try:
        # Get order details
        order = db.session.get(Order, order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        data = request.get_json()
        customer_email = data.get('email')
        customer_name = data.get('name', 'Customer')
        customer_phone = data.get('phone', '')

        if not customer_email:
            return jsonify({'error': 'Email address required'}), 400

        # Prepare order data for email
        order_items = []
        for item in order.order_items:
            menu_item = db.session.get(MenuItem, item.menu_item_id)
            customizations = []

            for custom in item.customizations:
                option = db.session.get(CustomizationOption, custom.customization_option_id)
                choice = db.session.get(OptionChoice, custom.option_choice_id)
                if option and choice:
                    customizations.append(f"{option.name}: {choice.name}")

            order_items.append({
                'name': menu_item.name if menu_item else 'Item',
                'quantity': item.quantity,
                'price': float(item.total_price),
                'customizations': ', '.join(customizations) if customizations else ''
            })

        order_data = {
            'order_id': order_id,
            'status': order.status,
            'subtotal': int(float(order.subtotal) * 100),  # Convert to cents
            'tax_amount': int(float(order.tax) * 100),  # Convert to cents
            'total_amount': int(float(order.total) * 100),  # Convert to cents
            'items': order_items
        }

        customer_info = {
            'name': customer_name,
            'email': customer_email,
            'phone': customer_phone
        }

        # Send email using the email service
        success = email_service.send_order_confirmation(order_data, customer_info)

        if success:
            return jsonify({
                'message': 'Confirmation email sent successfully',
                'email': customer_email
            })
        else:
            return jsonify({'error': 'Failed to send email'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/orders/<order_id>/update-status', methods=['POST'])
def update_order_status(order_id):
    """Update order status and send notification email"""
    try:
        data = request.get_json()
        new_status = data.get('status')
        customer_email = data.get('customer_email')
        customer_name = data.get('customer_name', 'Customer')

        if not new_status:
            return jsonify({'error': 'Status is required'}), 400

        # Valid statuses
        valid_statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']
        if new_status not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400

        # Update order status
        order = db.session.get(Order, order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        order.status = new_status
        order.updated_at = datetime.now(timezone.utc)
        db.session.commit()

        # Send email notification if customer email is provided
        if customer_email:
            order_data = {
                'order_id': order_id,
                'status': new_status,
                'total_amount': int(float(order.total) * 100)  # Convert to cents
            }

            customer_info = {
                'name': customer_name,
                'email': customer_email
            }

            email_service.send_order_status_update(order_data, customer_info, new_status)

        return jsonify({
            'order_id': order_id,
            'status': new_status,
            'message': f'Order status updated to {new_status}'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/menu-items/notify-new', methods=['POST'])
def notify_new_menu_item():
    """Notify customers about new menu item"""
    try:
        data = request.get_json()
        item_id = data.get('item_id')
        customer_emails = data.get('customer_emails', [])

        if not item_id:
            return jsonify({'error': 'item_id is required'}), 400

        if not customer_emails:
            return jsonify({'error': 'customer_emails list is required'}), 400

        # Get menu item details
        menu_item = db.session.get(MenuItem, item_id)
        if not menu_item:
            return jsonify({'error': 'Menu item not found'}), 404

        item_data = {
            'name': menu_item.name,
            'description': menu_item.description,
            'price': int(float(menu_item.price) * 100),  # Convert dollars to cents
            'image_url': menu_item.image_url or '/images/menu/default.jpg'
        }

        # Send notifications
        success = email_service.send_new_menu_item_notification(item_data, customer_emails)

        if success:
            return jsonify({
                'message': f'New menu item notifications sent to {len(customer_emails)} customers',
                'item_name': menu_item.name
            })
        else:
            return jsonify({'error': 'Failed to send notifications'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/test-email', methods=['POST'])
def test_email():
    """Test email functionality"""
    try:
        data = request.get_json()
        test_email = data.get('email', 'hammedbello97@gmail.com')

        # Test order data
        order_data = {
            'order_id': 'TEST-123',
            'status': 'CONFIRMED',
            'subtotal': 1200,  # $12.00 in cents
            'tax_amount': 107,  # $1.07 in cents
            'total_amount': 1307,  # $13.07 in cents
            'items': [
                {
                    'name': 'Chicken Shawarma',
                    'quantity': 1,
                    'price': 12.00,
                    'customizations': 'Extra sauce, No onions'
                }
            ]
        }

        customer_info = {
            'name': 'Test Customer',
            'email': test_email,
            'phone': '+1234567890'
        }

        # Send test email
        success = email_service.send_order_confirmation(order_data, customer_info)

        if success:
            return jsonify({
                'message': 'Test email sent successfully!',
                'email': test_email
            })
        else:
            return jsonify({'error': 'Failed to send test email'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/update-order-status', methods=['POST'])
def update_order_status_api():
    """Update order status and send notification email (for admin dashboard)"""
    try:
        data = request.get_json()

        # Extract data
        order_id = data.get('order_id')
        customer_email = data.get('customer_email')
        customer_name = data.get('customer_name', 'Customer')
        new_status = data.get('new_status')

        if not all([order_id, customer_email, new_status]):
            return jsonify({'error': 'Missing required fields'}), 400

        # For testing purposes, create mock order data
        order_data = {
            'order_id': order_id,
            'status': new_status,
            'subtotal': 1299,  # $12.99 in cents
            'tax_amount': 130,  # $1.30 in cents
            'total_amount': 1429,  # $14.29 in cents
            'items': [
                {
                    'name': 'Shawarma',
                    'quantity': 1,
                    'price': 12.99,
                    'customizations': 'Extra sauce'
                }
            ]
        }

        customer_info = {
            'name': customer_name,
            'email': customer_email,
            'phone': data.get('customer_phone', '')
        }

        # Send status update email
        success = email_service.send_order_status_update(order_data, customer_info, new_status)

        if success:
            return jsonify({
                'message': f'Status update email sent to {customer_email}',
                'order_id': order_id,
                'new_status': new_status
            })
        else:
            return jsonify({'error': 'Failed to send status update email'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Contact Form API Endpoints
@app.route('/api/contact/submit', methods=['POST'])
def submit_contact_form():
    """Submit a contact form inquiry"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Create new contact inquiry
        inquiry = ContactInquiry(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone'),
            subject=data.get('subject'),
            message=data.get('message'),
            inquiry_type=data.get('inquiry_type', 'general'),
            event_date=datetime.strptime(data.get('event_date'), '%Y-%m-%d').date() if data.get('event_date') else None,
            guest_count=data.get('guest_count'),
            budget_range=data.get('budget_range'),
            special_requirements=data.get('special_requirements')
        )

        # Save to database
        db.session.add(inquiry)
        db.session.commit()

        # Send notification email to admin
        admin_email_sent = email_service.send_contact_inquiry_notification(
            inquiry_data=inquiry.to_dict(),
            admin_email="admin@expreezmeal.com"
        )

        # Send confirmation email to customer
        customer_email_sent = email_service.send_contact_confirmation(
            inquiry_data=inquiry.to_dict(),
            customer_email=inquiry.email
        )

        return jsonify({
            'message': 'Contact form submitted successfully',
            'inquiry_id': inquiry.id,
            'admin_email_sent': admin_email_sent,
            'customer_email_sent': customer_email_sent
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error submitting contact form: {str(e)}")
        return jsonify({'error': 'Failed to submit contact form'}), 500


@app.route('/api/contact/inquiries', methods=['GET'])
def get_contact_inquiries():
    """Get all contact inquiries (admin only)"""
    try:
        # Get query parameters
        status = request.args.get('status')
        inquiry_type = request.args.get('inquiry_type')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))

        # Build query
        query = ContactInquiry.query

        if status:
            query = query.filter(ContactInquiry.status == status)
        if inquiry_type:
            query = query.filter(ContactInquiry.inquiry_type == inquiry_type)

        # Order by creation date (newest first)
        query = query.order_by(ContactInquiry.created_at.desc())

        # Paginate
        paginated = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        inquiries = [inquiry.to_dict() for inquiry in paginated.items]

        return jsonify({
            'inquiries': inquiries,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages,
                'has_next': paginated.has_next,
                'has_prev': paginated.has_prev
            }
        }), 200

    except Exception as e:
        print(f"Error fetching contact inquiries: {str(e)}")
        return jsonify({'error': 'Failed to fetch contact inquiries'}), 500


@app.route('/api/contact/inquiries/<inquiry_id>', methods=['GET'])
def get_contact_inquiry(inquiry_id):
    """Get a specific contact inquiry (admin only)"""
    try:
        inquiry = db.session.get(ContactInquiry, inquiry_id)
        if not inquiry:
            return jsonify({'error': 'Inquiry not found'}), 404

        # Mark as read
        if not inquiry.is_read:
            inquiry.is_read = True
            db.session.commit()

        return jsonify(inquiry.to_dict()), 200

    except Exception as e:
        print(f"Error fetching contact inquiry: {str(e)}")
        return jsonify({'error': 'Failed to fetch contact inquiry'}), 500


@app.route('/api/contact/inquiries/<inquiry_id>/update-status', methods=['POST'])
def update_inquiry_status(inquiry_id):
    """Update contact inquiry status (admin only)"""
    try:
        data = request.get_json()
        new_status = data.get('status')
        admin_notes = data.get('admin_notes')

        if new_status not in ['new', 'in_progress', 'resolved', 'closed']:
            return jsonify({'error': 'Invalid status'}), 400

        inquiry = db.session.get(ContactInquiry, inquiry_id)
        if not inquiry:
            return jsonify({'error': 'Inquiry not found'}), 404

        inquiry.status = new_status
        if admin_notes:
            inquiry.admin_notes = admin_notes
        inquiry.updated_at = datetime.now(timezone.utc)

        db.session.commit()

        return jsonify({
            'message': 'Inquiry status updated successfully',
            'inquiry': inquiry.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating inquiry status: {str(e)}")
        return jsonify({'error': 'Failed to update inquiry status'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')