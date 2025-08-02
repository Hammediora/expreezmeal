from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    is_superuser = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    addresses = db.relationship('Address', backref='user', lazy=True)
    orders = db.relationship('Order', backref='user', lazy=True)
    # reviews = db.relationship('Review', backref='user', lazy=True)  # Review model not defined

class Address(db.Model):
    __tablename__ = 'addresses'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'))
    address_line1 = db.Column(db.String(255), nullable=False)
    address_line2 = db.Column(db.String(255))
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), default='USA')
    is_default = db.Column(db.Boolean, default=False)
    address_type = db.Column(db.String(20))  # 'BILLING' or 'DELIVERY'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    display_order = db.Column(db.Integer)
    
    # Relationships
    menu_items = db.relationship('MenuItem', backref='category', lazy=True)

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    category_id = db.Column(db.String(36), db.ForeignKey('categories.id'))
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    sale_price = db.Column(db.Numeric(10, 2))
    image_url = db.Column(db.String(255))
    is_available = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    preparation_time = db.Column(db.Integer)  # in minutes
    calories = db.Column(db.Integer)
    allergens = db.Column(db.ARRAY(db.String))
    dietary_flags = db.Column(db.ARRAY(db.String))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    # customization_options = db.relationship('CustomizationOption', backref='menu_item', lazy=True)  # Model not defined

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    delivery_address_id = db.Column(db.String(36), db.ForeignKey('addresses.id'))
    status = db.Column(db.String(50), nullable=False, default='PENDING')
    order_type = db.Column(db.String(20), nullable=False)  # 'DELIVERY', 'PICKUP', 'DINE_IN'
    delivery_service = db.Column(db.String(50))
    delivery_fee = db.Column(db.Numeric(10, 2))
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    tax = db.Column(db.Numeric(10, 2), nullable=False)
    tip = db.Column(db.Numeric(10, 2))
    total = db.Column(db.Numeric(10, 2), nullable=False)
    requested_delivery_time = db.Column(db.DateTime)
    estimated_delivery_time = db.Column(db.DateTime)
    special_instructions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    order_items = db.relationship('OrderItem', backref='order', lazy=True)
    payment = db.relationship('Payment', backref='order', lazy=True)
    delivery_service_order = db.relationship('DeliveryServiceOrder', backref='order', lazy=True)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'))
    menu_item_id = db.Column(db.String(36), db.ForeignKey('menu_items.id'))
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    special_instructions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships  
    # customizations = db.relationship('OrderItemCustomization', backref='order_item', lazy=True)  # Model not defined

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'))
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    payment_status = db.Column(db.String(50), nullable=False)
    transaction_id = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DeliveryServiceOrder(db.Model):
    __tablename__ = 'delivery_service_orders'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'))
    service_name = db.Column(db.String(50), nullable=False)  # 'DOORDASH', 'UBER_EATS'
    service_order_id = db.Column(db.String(255))
    driver_name = db.Column(db.String(255))
    driver_phone = db.Column(db.String(20))
    pickup_time = db.Column(db.DateTime)
    delivery_time = db.Column(db.DateTime)
    tracking_url = db.Column(db.String(255))
    status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()