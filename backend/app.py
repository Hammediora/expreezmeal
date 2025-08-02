import os
import secrets
from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect, url_for, flash, g, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_session import Session
from flask_cors import CORS
import redis
from functools import wraps
from datetime import datetime

# Load environment variables before using them
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Ensure DATABASE_URL is set
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set. Check your environment variables.")

# Configure Flask App for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database (import after defining db)
from database import db  # Now db is already defined in database.py

db.init_app(app)
migrate = Migrate(app, db)

# Import models after db is initialized
from database import User, Address, Category, MenuItem, Order, OrderItem, Payment, DeliveryServiceOrder

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

# ============= API ROUTES FOR FRONTEND ============= 

@app.route('/api/health')
def health_check():
    """Health check endpoint for frontend"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
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
            'price': float(item.price),
            'sale_price': float(item.sale_price) if item.sale_price else None,
            'image_url': item.image_url,
            'is_featured': item.is_featured,
            'preparation_time': item.preparation_time,
            'calories': item.calories,
            'allergens': item.allergens,
            'dietary_flags': item.dietary_flags
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
            'price': float(item.price),
            'sale_price': float(item.sale_price) if item.sale_price else None,
            'image_url': item.image_url,
            'preparation_time': item.preparation_time,
            'calories': item.calories
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
            'dietary_flags': item.dietary_flags
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new order"""
    try:
        data = request.get_json()
        
        # Create new order
        order = Order(
            user_id=data.get('user_id'),
            delivery_address_id=data.get('delivery_address_id'),
            order_type=data.get('order_type', 'DELIVERY'),
            subtotal=data.get('subtotal'),
            tax=data.get('tax'),
            tip=data.get('tip', 0),
            total=data.get('total'),
            special_instructions=data.get('special_instructions')
        )
        
        db.session.add(order)
        db.session.flush()  # Get the order ID
        
        # Add order items
        for item_data in data.get('items', []):
            order_item = OrderItem(
                order_id=order.id,
                menu_item_id=item_data['menu_item_id'],
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=item_data['total_price'],
                special_instructions=item_data.get('special_instructions')
            )
            db.session.add(order_item)
        
        db.session.commit()
        
        return jsonify({
            'id': order.id,
            'status': order.status,
            'total': float(order.total),
            'created_at': order.created_at.isoformat()
        }), 201
        
    except Exception as e:
        db.session.rollback()
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
                'special_instructions': item.special_instructions
            } for item in order.order_items]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')