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
    last_activity = db.Column(db.DateTime)

    # Relationships
    addresses = db.relationship('Address', backref='user', lazy=True)
    orders = db.relationship('Order', backref='user', lazy=True)
    admin_sessions = db.relationship('AdminSession', backref='user', lazy=True, cascade='all, delete-orphan')
    # reviews = db.relationship('Review', backref='user', lazy=True)  # Review model not defined

class ContactInquiry(db.Model):
    __tablename__ = 'contact_inquiries'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20))
    subject = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    inquiry_type = db.Column(db.String(50), default='general')  # general, order, catering, feedback, partnership
    event_date = db.Column(db.Date)  # For catering inquiries
    guest_count = db.Column(db.Integer)  # For catering inquiries
    budget_range = db.Column(db.String(50))  # For catering inquiries
    special_requirements = db.Column(db.Text)  # For catering inquiries
    status = db.Column(db.String(20), default='new')  # new, in_progress, resolved, closed
    is_read = db.Column(db.Boolean, default=False)
    admin_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'subject': self.subject,
            'message': self.message,
            'inquiry_type': self.inquiry_type,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'guest_count': self.guest_count,
            'budget_range': self.budget_range,
            'special_requirements': self.special_requirements,
            'status': self.status,
            'is_read': self.is_read,
            'admin_notes': self.admin_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class AdminSession(db.Model):
    __tablename__ = 'admin_sessions'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    session_token = db.Column(db.String(255), unique=True, nullable=False)
    jwt_token_id = db.Column(db.String(36), unique=True, nullable=False)  # jti claim from JWT
    ip_address = db.Column(db.String(45))  # Support IPv6
    user_agent = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    revoked_at = db.Column(db.DateTime)

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
    customization_options = db.relationship('CustomizationOption', backref='menu_item', lazy=True)

class CustomizationOption(db.Model):
    __tablename__ = 'customization_options'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    menu_item_id = db.Column(db.String(36), db.ForeignKey('menu_items.id', ondelete='CASCADE'))
    name = db.Column(db.String(255), nullable=False)  # e.g., "Protein", "Add-ons", "Sweetness"
    type = db.Column(db.String(50), nullable=False)  # 'SINGLE_SELECT', 'MULTI_SELECT'
    is_required = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    option_choices = db.relationship('OptionChoice', backref='customization_option', lazy=True, cascade='all, delete-orphan')

class OptionChoice(db.Model):
    __tablename__ = 'option_choices'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    customization_option_id = db.Column(db.String(36), db.ForeignKey('customization_options.id', ondelete='CASCADE'))
    name = db.Column(db.String(255), nullable=False)  # e.g., "Chicken", "Beef", "Extra Sauce"
    price_modifier = db.Column(db.Numeric(10, 2), default=0.00)  # Additional cost
    is_default = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
    customizations = db.relationship('OrderItemCustomization', backref='order_item', lazy=True, cascade='all, delete-orphan')
    menu_item = db.relationship('MenuItem', backref='order_items', lazy=True)

class OrderItemCustomization(db.Model):
    __tablename__ = 'order_item_customizations'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    order_item_id = db.Column(db.String(36), db.ForeignKey('order_items.id', ondelete='CASCADE'))
    customization_option_id = db.Column(db.String(36), db.ForeignKey('customization_options.id'))
    option_choice_id = db.Column(db.String(36), db.ForeignKey('option_choices.id'))
    price_modifier = db.Column(db.Numeric(10, 2), default=0.00)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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

class Promotion(db.Model):
    __tablename__ = 'promotions'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    promo_code = db.Column(db.String(50), unique=True)  # Optional promo code
    discount_type = db.Column(db.String(20), nullable=False)  # 'PERCENTAGE', 'FIXED_AMOUNT', 'BUY_ONE_GET_ONE'
    discount_value = db.Column(db.Numeric(10, 2))  # Percentage (0-100) or fixed amount
    minimum_order_amount = db.Column(db.Numeric(10, 2))
    maximum_discount = db.Column(db.Numeric(10, 2))  # For percentage discounts
    applies_to = db.Column(db.String(20), nullable=False)  # 'ALL', 'CATEGORY', 'ITEM'
    category_id = db.Column(db.String(36), db.ForeignKey('categories.id'))  # If applies to specific category
    menu_item_id = db.Column(db.String(36), db.ForeignKey('menu_items.id'))  # If applies to specific item
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    usage_limit = db.Column(db.Integer)  # Maximum number of uses
    usage_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    category = db.relationship('Category', backref='promotions', lazy=True)
    menu_item = db.relationship('MenuItem', backref='promotions', lazy=True)

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()