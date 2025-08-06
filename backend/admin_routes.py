"""
Admin API Routes for ExpreeZmeal Dashboard

This module contains all admin-specific endpoints for the dashboard.
"""

import os
import jwt
import secrets
import uuid
from datetime import datetime, timedelta
from functools import wraps
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash, generate_password_hash
from database import db, User, Order, OrderItem, MenuItem, Category, Payment, AdminSession
from sqlalchemy import func, desc
from sqlalchemy.orm import joinedload
from email_service import EmailService

# Create admin blueprint
admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def cleanup_expired_sessions():
    """Clean up expired sessions"""
    try:
        expired_sessions = AdminSession.query.filter(
            AdminSession.expires_at < datetime.utcnow(),
            AdminSession.is_active == True
        ).all()

        for session in expired_sessions:
            session.is_active = False
            session.revoked_at = datetime.utcnow()

        db.session.commit()
        return len(expired_sessions)
    except Exception as e:
        db.session.rollback()
        print(f"Error cleaning up sessions: {e}")
        return 0

def revoke_all_user_sessions(user_id, except_session_id=None):
    """Revoke all sessions for a user except the current one"""
    try:
        query = AdminSession.query.filter_by(user_id=user_id, is_active=True)

        if except_session_id:
            query = query.filter(AdminSession.id != except_session_id)

        sessions_to_revoke = query.all()

        for session in sessions_to_revoke:
            session.is_active = False
            session.revoked_at = datetime.utcnow()

        db.session.commit()
        return len(sessions_to_revoke)
    except Exception as e:
        db.session.rollback()
        print(f"Error revoking sessions: {e}")
        return 0

def create_admin_session(user, request):
    """Create a new admin session"""
    try:
        # Clean up expired sessions first
        cleanup_expired_sessions()

        # Generate unique identifiers
        session_token = secrets.token_urlsafe(32)
        jwt_token_id = str(uuid.uuid4())

        # Get client info
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        user_agent = request.headers.get('User-Agent', '')

        # Create session expiration (24 hours)
        expires_at = datetime.utcnow() + timedelta(hours=24)

        # Create JWT payload
        payload = {
            'user_id': user.id,
            'email': user.email,
            'jti': jwt_token_id,  # JWT ID for session tracking
            'iat': datetime.utcnow(),
            'exp': expires_at
        }

        # Generate JWT token
        jwt_token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

        # Create session record
        admin_session = AdminSession(
            user_id=user.id,
            session_token=session_token,
            jwt_token_id=jwt_token_id,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=expires_at
        )

        db.session.add(admin_session)

        # Update user last login
        user.last_login = datetime.utcnow()
        user.last_activity = datetime.utcnow()

        db.session.commit()

        return {
            'jwt_token': jwt_token,
            'session': admin_session,
            'expires_at': expires_at
        }

    except Exception as e:
        db.session.rollback()
        raise e

def jwt_required(f):
    """Decorator to require JWT authentication with session validation"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header:
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()

            if not current_user or not current_user.is_superuser:
                return jsonify({'error': 'Invalid token or insufficient permissions'}), 401

            # Check if session exists and is active
            jwt_token_id = data.get('jti')
            if jwt_token_id:
                session = AdminSession.query.filter_by(
                    jwt_token_id=jwt_token_id,
                    user_id=current_user.id,
                    is_active=True
                ).first()

                if not session:
                    return jsonify({'error': 'Session has been revoked'}), 401

                # Check if session has expired
                if session.expires_at < datetime.utcnow():
                    session.is_active = False
                    session.revoked_at = datetime.utcnow()
                    db.session.commit()
                    return jsonify({'error': 'Session has expired'}), 401

                # Update last activity
                session.last_activity = datetime.utcnow()
                current_user.last_activity = datetime.utcnow()
                db.session.commit()

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

def admin_required(minimum_role='staff'):
    """Decorator to require specific admin role"""
    def decorator(f):
        @wraps(f)
        def decorated(current_user, *args, **kwargs):
            # For now, just check if user is superuser
            # Later can implement role hierarchy
            if not current_user.is_superuser:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return f(current_user, *args, **kwargs)
        return decorated
    return decorator

@admin_bp.route('/auth/login', methods=['POST'])
def admin_login():
    """Admin login endpoint with enhanced session management"""
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400

        email = data['email'].lower().strip()
        password = data['password']

        # Find admin user
        user = User.query.filter_by(email=email).first()

        if not user or not user.is_superuser:
            return jsonify({'error': 'Invalid credentials or insufficient permissions'}), 401

        # For development, allow simple password check
        # In production, use proper password hashing
        if password == 'admin123' or check_password_hash(user.password, password):
            # Create new session
            session_data = create_admin_session(user, request)

            return jsonify({
                'access_token': session_data['jwt_token'],
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.full_name,
                    'role': 'admin',
                    'created_at': user.created_at.isoformat() if user.created_at else None,
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                    'session_id': session_data['session'].id
                },
                'expires_in': 86400,  # 24 hours in seconds
                'expires_at': session_data['expires_at'].isoformat()
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/auth/verify', methods=['GET'])
@jwt_required
def verify_token(current_user):
    """Verify JWT token and return user info"""
    return jsonify({
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'full_name': current_user.full_name,
            'role': 'admin',
            'created_at': current_user.created_at.isoformat() if current_user.created_at else None,
            'last_login': current_user.last_login.isoformat() if current_user.last_login else None,
            'last_activity': current_user.last_activity.isoformat() if current_user.last_activity else None
        }
    })

@admin_bp.route('/auth/logout', methods=['POST'])
@jwt_required
def admin_logout(current_user):
    """Logout and revoke current session"""
    try:
        # Get JWT token ID from the request
        auth_header = request.headers.get('Authorization')
        if auth_header:
            token = auth_header.split(" ")[1]
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            jwt_token_id = data.get('jti')

            if jwt_token_id:
                # Revoke the current session
                session = AdminSession.query.filter_by(
                    jwt_token_id=jwt_token_id,
                    user_id=current_user.id
                ).first()

                if session:
                    session.is_active = False
                    session.revoked_at = datetime.utcnow()
                    db.session.commit()

        return jsonify({'message': 'Logged out successfully'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/auth/logout-all', methods=['POST'])
@jwt_required
def admin_logout_all(current_user):
    """Logout from all sessions"""
    try:
        revoked_count = revoke_all_user_sessions(current_user.id)

        return jsonify({
            'message': f'Logged out from {revoked_count} sessions successfully'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/auth/sessions', methods=['GET'])
@jwt_required
def get_admin_sessions(current_user):
    """Get all active sessions for the current admin user"""
    try:
        sessions = AdminSession.query.filter_by(
            user_id=current_user.id,
            is_active=True
        ).order_by(desc(AdminSession.last_activity)).all()

        # Get current session JWT ID for comparison
        current_jwt_id = None
        auth_header = request.headers.get('Authorization')
        if auth_header:
            token = auth_header.split(" ")[1]
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_jwt_id = data.get('jti')

        session_list = []
        for session in sessions:
            session_info = {
                'id': session.id,
                'ip_address': session.ip_address,
                'user_agent': session.user_agent,
                'created_at': session.created_at.isoformat(),
                'last_activity': session.last_activity.isoformat(),
                'expires_at': session.expires_at.isoformat(),
                'is_current': session.jwt_token_id == current_jwt_id
            }
            session_list.append(session_info)

        return jsonify({
            'sessions': session_list,
            'total_sessions': len(session_list)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/auth/sessions/<session_id>/revoke', methods=['POST'])
@jwt_required
def revoke_admin_session(current_user, session_id):
    """Revoke a specific session"""
    try:
        session = AdminSession.query.filter_by(
            id=session_id,
            user_id=current_user.id,
            is_active=True
        ).first()

        if not session:
            return jsonify({'error': 'Session not found'}), 404

        session.is_active = False
        session.revoked_at = datetime.utcnow()
        db.session.commit()

        return jsonify({'message': 'Session revoked successfully'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/auth/refresh', methods=['POST'])
@jwt_required
def refresh_admin_session(current_user):
    """Refresh the current session (extend expiration)"""
    try:
        # Get current JWT token ID
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401

        token = auth_header.split(" ")[1]
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        jwt_token_id = data.get('jti')

        if not jwt_token_id:
            return jsonify({'error': 'Invalid token'}), 401

        # Find and update the session
        session = AdminSession.query.filter_by(
            jwt_token_id=jwt_token_id,
            user_id=current_user.id,
            is_active=True
        ).first()

        if not session:
            return jsonify({'error': 'Session not found'}), 404

        # Create new session with extended expiration
        new_session_data = create_admin_session(current_user, request)

        # Revoke the old session
        session.is_active = False
        session.revoked_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'access_token': new_session_data['jwt_token'],
            'expires_in': 86400,
            'expires_at': new_session_data['expires_at'].isoformat(),
            'message': 'Session refreshed successfully'
        })

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/stats', methods=['GET'])
@jwt_required
@admin_required()
def get_admin_stats(current_user):
    """Get dashboard statistics"""
    try:
        # Get current date for today's stats
        today = datetime.utcnow().date()

        # Total orders
        total_orders = Order.query.count()

        # Total revenue (sum of all completed orders)
        total_revenue_result = db.session.query(func.sum(Order.total)).filter(
            Order.status.in_(['COMPLETED', 'DELIVERED'])
        ).scalar()
        total_revenue = float(total_revenue_result or 0) / 100  # Convert cents to dollars

        # Today's orders
        orders_today = Order.query.filter(
            func.date(Order.created_at) == today
        ).count()

        # Today's revenue
        revenue_today_result = db.session.query(func.sum(Order.total)).filter(
            func.date(Order.created_at) == today,
            Order.status.in_(['COMPLETED', 'DELIVERED'])
        ).scalar()
        revenue_today = float(revenue_today_result or 0) / 100  # Convert cents to dollars

        # Most popular items (top 5)
        popular_items = db.session.query(
            MenuItem.name,
            func.sum(OrderItem.quantity).label('order_count'),
            func.sum(OrderItem.total_price).label('revenue')
        ).join(OrderItem).join(Order).filter(
            Order.status.in_(['COMPLETED', 'DELIVERED'])
        ).group_by(MenuItem.id, MenuItem.name).order_by(
            desc(func.sum(OrderItem.quantity))
        ).limit(5).all()

        # Recent orders (last 10)
        recent_orders = Order.query.options(
            joinedload(Order.order_items).joinedload(OrderItem.menu_item)
        ).order_by(desc(Order.created_at)).limit(10).all()

        return jsonify({
            'total_orders': total_orders,
            'total_revenue': total_revenue,
            'orders_today': orders_today,
            'revenue_today': revenue_today,
            'most_popular_items': [
                {
                    'item_name': item.name,
                    'order_count': int(item.order_count),
                    'revenue': float(item.revenue) / 100  # Convert cents to dollars
                }
                for item in popular_items
            ],
            'recent_orders': [
                {
                    'id': order.id,
                    'customer_name': f"Order #{order.id[:8]}",  # Simplified for now
                    'status': order.status,
                    'total_amount': float(order.total) / 100,  # Convert cents to dollars
                    'created_at': order.created_at.isoformat() if order.created_at else None,
                    'items': [
                        {
                            'name': item.menu_item.name if item.menu_item else 'Unknown Item',
                            'quantity': item.quantity,
                            'price': float(item.total_price) / 100  # Convert cents to dollars
                        }
                        for item in order.order_items
                    ]
                }
                for order in recent_orders
            ]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/orders', methods=['GET'])
@jwt_required
@admin_required()
def get_admin_orders(current_user):
    """Get all orders with filtering and pagination"""
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        status_filter = request.args.get('status')
        search = request.args.get('search')

        # Build query
        query = Order.query.options(
            joinedload(Order.order_items).joinedload(OrderItem.menu_item)
        )

        # Apply filters
        if status_filter:
            query = query.filter(Order.status == status_filter)

        if search:
            query = query.filter(Order.id.contains(search))

        # Order by most recent first
        query = query.order_by(desc(Order.created_at))

        # Paginate
        pagination = query.paginate(
            page=page, per_page=per_page, error_out=False
        )

        orders = [
            {
                'id': order.id,
                'customer_name': f"Customer #{order.id[:8]}",  # Simplified
                'customer_email': f"customer{order.id[:8]}@example.com",  # Mock
                'customer_phone': "(555) 123-4567",  # Mock
                'status': order.status,
                'order_type': order.order_type,
                'total_amount': float(order.total) / 100,
                'created_at': order.created_at.isoformat() if order.created_at else None,
                'updated_at': order.updated_at.isoformat() if order.updated_at else None,
                'items': [
                    {
                        'id': item.id,
                        'name': item.menu_item.name if item.menu_item else 'Unknown Item',
                        'quantity': item.quantity,
                        'unit_price': float(item.unit_price) / 100,
                        'total_price': float(item.total_price) / 100,
                        'special_instructions': item.special_instructions
                    }
                    for item in order.order_items
                ]
            }
            for order in pagination.items
        ]

        return jsonify({
            'orders': orders,
            'pagination': {
                'page': pagination.page,
                'pages': pagination.pages,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/orders/<order_id>', methods=['GET'])
@jwt_required
@admin_required()
def get_admin_order_details(current_user, order_id):
    """Get detailed order information"""
    try:
        order = Order.query.options(
            joinedload(Order.order_items).joinedload(OrderItem.menu_item)
        ).filter_by(id=order_id).first()

        if not order:
            return jsonify({'error': 'Order not found'}), 404

        return jsonify({
            'id': order.id,
            'customer_name': f"Customer #{order.id[:8]}",
            'customer_email': f"customer{order.id[:8]}@example.com",
            'customer_phone': "(555) 123-4567",
            'status': order.status,
            'order_type': order.order_type,
            'subtotal_amount': float(order.subtotal) / 100,
            'tax_amount': float(order.tax) / 100,
            'tip_amount': float(order.tip or 0) / 100,
            'total_amount': float(order.total) / 100,
            'special_instructions': order.special_instructions,
            'created_at': order.created_at.isoformat() if order.created_at else None,
            'updated_at': order.updated_at.isoformat() if order.updated_at else None,
            'items': [
                {
                    'id': item.id,
                    'menu_item_id': item.menu_item_id,
                    'name': item.menu_item.name if item.menu_item else 'Unknown Item',
                    'quantity': item.quantity,
                    'unit_price': float(item.unit_price) / 100,
                    'total_price': float(item.total_price) / 100,
                    'special_instructions': item.special_instructions
                }
                for item in order.order_items
            ]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/orders/<order_id>/status', methods=['PATCH'])
@jwt_required
@admin_required()
def update_order_status(current_user, order_id):
    """Update order status and send email notification"""
    try:
        data = request.get_json()

        if not data or 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400

        new_status = data['status']
        valid_statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

        if new_status not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400

        order = Order.query.options(joinedload(Order.user)).filter_by(id=order_id).first()

        if not order:
            return jsonify({'error': 'Order not found'}), 404

        old_status = order.status
        order.status = new_status
        order.updated_at = datetime.utcnow()

        db.session.commit()

        # Send email notification to customer
        email_sent = False
        try:
            email_service = EmailService()

            # Prepare order data for email
            order_data = {
                'order_id': order.id,
                'status': new_status,
                'order_type': order.order_type,
                'total': float(order.total),
                'created_at': order.created_at.isoformat() if order.created_at else None,
                'estimated_delivery_time': order.estimated_delivery_time.isoformat() if order.estimated_delivery_time else None
            }

            # Prepare customer info
            if order.user:
                customer_info = {
                    'name': order.user.full_name or f"Customer #{order.id[:8]}",
                    'email': order.user.email,
                    'phone': order.user.phone or "(555) 123-4567"
                }
            else:
                # Use mock data for orders without user association
                customer_info = {
                    'name': f"Customer #{order.id[:8]}",
                    'email': f"customer{order.id[:8]}@example.com",
                    'phone': "(555) 123-4567"
                }

            # Send status update email
            email_sent = email_service.send_order_status_update(order_data, customer_info, new_status)

        except Exception as email_error:
            print(f"Failed to send email notification: {email_error}")
            # Don't fail the status update if email fails

        return jsonify({
            'message': f'Order status updated from {old_status} to {new_status}',
            'order_id': order_id,
            'old_status': old_status,
            'new_status': new_status,
            'updated_at': order.updated_at.isoformat(),
            'email_sent': email_sent
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/menu', methods=['GET'])
@jwt_required
@admin_required()
def get_admin_menu_items(current_user):
    """Get all menu items for admin management"""
    try:
        category_id = request.args.get('category_id')
        query = MenuItem.query.options(joinedload(MenuItem.category))

        if category_id:
            query = query.filter_by(category_id=category_id)

        menu_items = query.order_by(MenuItem.name).all()

        return jsonify([
            {
                'id': item.id,
                'name': item.name,
                'description': item.description,
                'price': float(item.price) / 100,  # Convert cents to dollars
                'sale_price': float(item.sale_price) / 100 if item.sale_price else None,
                'category_id': item.category_id,
                'category_name': item.category.name if item.category else None,
                'image_url': item.image_url,
                'is_available': item.is_available,
                'is_featured': item.is_featured,
                'preparation_time': item.preparation_time,
                'calories': item.calories,
                'allergens': item.allergens,
                'dietary_flags': item.dietary_flags,
                'created_at': item.created_at.isoformat() if item.created_at else None
            }
            for item in menu_items
        ])

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/menu', methods=['POST'])
@jwt_required
@admin_required()
def create_menu_item(current_user):
    """Create new menu item"""
    try:
        data = request.get_json()

        if not data or not data.get('name') or not data.get('price'):
            return jsonify({'error': 'Name and price are required'}), 400

        # Convert price from dollars to cents
        price_cents = int(float(data['price']) * 100)
        sale_price_cents = int(float(data.get('sale_price', 0)) * 100) if data.get('sale_price') else None

        menu_item = MenuItem(
            name=data['name'],
            description=data.get('description', ''),
            price=price_cents,
            sale_price=sale_price_cents,
            category_id=data.get('category_id'),
            image_url=data.get('image_url'),
            is_available=data.get('is_available', True),
            is_featured=data.get('is_featured', False),
            preparation_time=data.get('preparation_time'),
            calories=data.get('calories'),
            allergens=data.get('allergens'),
            dietary_flags=data.get('dietary_flags'),
            created_at=datetime.utcnow()
        )

        db.session.add(menu_item)
        db.session.commit()

        return jsonify({
            'message': 'Menu item created successfully',
            'id': menu_item.id,
            'name': menu_item.name
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/menu/<item_id>', methods=['PUT'])
@jwt_required
@admin_required()
def update_menu_item(current_user, item_id):
    """Update menu item"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        menu_item = MenuItem.query.filter_by(id=item_id).first()

        if not menu_item:
            return jsonify({'error': 'Menu item not found'}), 404

        # Update fields if provided
        if 'name' in data:
            menu_item.name = data['name']
        if 'description' in data:
            menu_item.description = data['description']
        if 'price' in data:
            menu_item.price = int(float(data['price']) * 100)  # Convert to cents
        if 'sale_price' in data:
            menu_item.sale_price = int(float(data['sale_price']) * 100) if data['sale_price'] else None
        if 'category_id' in data:
            menu_item.category_id = data['category_id']
        if 'image_url' in data:
            menu_item.image_url = data['image_url']
        if 'is_available' in data:
            menu_item.is_available = data['is_available']
        if 'is_featured' in data:
            menu_item.is_featured = data['is_featured']
        if 'preparation_time' in data:
            menu_item.preparation_time = data['preparation_time']
        if 'calories' in data:
            menu_item.calories = data['calories']
        if 'allergens' in data:
            menu_item.allergens = data['allergens']
        if 'dietary_flags' in data:
            menu_item.dietary_flags = data['dietary_flags']

        menu_item.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Menu item updated successfully',
            'id': menu_item.id,
            'name': menu_item.name
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/menu/<item_id>', methods=['DELETE'])
@jwt_required
@admin_required()
def delete_menu_item(current_user, item_id):
    """Delete menu item"""
    try:
        menu_item = MenuItem.query.filter_by(id=item_id).first()

        if not menu_item:
            return jsonify({'error': 'Menu item not found'}), 404

        item_name = menu_item.name

        # Instead of deleting, mark as unavailable for data integrity
        menu_item.is_available = False
        menu_item.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': f'Menu item "{item_name}" has been disabled',
            'id': item_id
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/receipts', methods=['GET'])
@jwt_required
@admin_required()
def get_admin_receipts(current_user):
    """Get receipts/orders for receipt management"""
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        date_from = request.args.get('date_from')
        date_to = request.args.get('date_to')

        # Build query
        query = Order.query.options(
            joinedload(Order.order_items).joinedload(OrderItem.menu_item)
        ).filter(Order.status.in_(['COMPLETED', 'DELIVERED']))

        # Apply date filters
        if date_from:
            query = query.filter(Order.created_at >= datetime.fromisoformat(date_from))
        if date_to:
            query = query.filter(Order.created_at <= datetime.fromisoformat(date_to))

        # Order by most recent first
        query = query.order_by(desc(Order.created_at))

        # Paginate
        pagination = query.paginate(
            page=page, per_page=per_page, error_out=False
        )

        receipts = [
            {
                'id': order.id,
                'order_number': f"#{order.id[:8].upper()}",
                'customer_name': f"Customer #{order.id[:8]}",
                'total_amount': float(order.total_amount) / 100,
                'subtotal_amount': float(order.subtotal_amount) / 100,
                'tax_amount': float(order.tax_amount) / 100,
                'tip_amount': float(order.tip_amount) / 100,
                'payment_method': 'Card',  # Simplified
                'created_at': order.created_at.isoformat() if order.created_at else None,
                'items': [
                    {
                        'name': item.menu_item.name if item.menu_item else 'Unknown Item',
                        'quantity': item.quantity,
                        'unit_price': float(item.unit_price) / 100,
                        'total_price': float(item.total_price) / 100
                    }
                    for item in order.order_items
                ]
            }
            for order in pagination.items
        ]

        return jsonify({
            'receipts': receipts,
            'pagination': {
                'page': pagination.page,
                'pages': pagination.pages,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/reports', methods=['GET'])
@jwt_required
@admin_required()
def get_reports(current_user):
    """Get comprehensive business reports and analytics"""
    try:
        # Time period filter (default to last 30 days)
        period = request.args.get('period', '30')

        # Calculate date range
        end_date = datetime.utcnow()
        if period == '7':
            start_date = end_date - timedelta(days=7)
        elif period == '30':
            start_date = end_date - timedelta(days=30)
        elif period == '90':
            start_date = end_date - timedelta(days=90)
        elif period == '365':
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)

        # Revenue Analytics
        revenue_query = db.session.query(
            func.date(Order.created_at).label('date'),
            func.sum(Order.total).label('daily_revenue'),
            func.count(Order.id).label('daily_orders')
        ).filter(
            Order.created_at >= start_date,
            Order.status.in_(['DELIVERED', 'READY', 'PREPARING', 'CONFIRMED'])
        ).group_by(func.date(Order.created_at)).order_by(func.date(Order.created_at))

        revenue_data = revenue_query.all()

        # Order Status Distribution
        status_query = db.session.query(
            Order.status,
            func.count(Order.id).label('count')
        ).filter(Order.created_at >= start_date).group_by(Order.status)

        status_data = status_query.all()

        # Top Menu Items
        top_items_query = db.session.query(
            MenuItem.name,
            func.sum(OrderItem.quantity).label('total_sold'),
            func.sum(OrderItem.total_price).label('total_revenue')
        ).join(OrderItem).join(Order).filter(
            Order.created_at >= start_date,
            Order.status.in_(['DELIVERED', 'READY', 'PREPARING', 'CONFIRMED'])
        ).group_by(MenuItem.id, MenuItem.name).order_by(
            func.sum(OrderItem.quantity).desc()
        ).limit(10)

        top_items_data = top_items_query.all()

        # Order Type Distribution
        order_type_query = db.session.query(
            Order.order_type,
            func.count(Order.id).label('count')
        ).filter(Order.created_at >= start_date).group_by(Order.order_type)

        order_type_data = order_type_query.all()

        # Summary Statistics
        total_revenue = db.session.query(func.sum(Order.total)).filter(
            Order.created_at >= start_date,
            Order.status.in_(['DELIVERED', 'READY', 'PREPARING', 'CONFIRMED'])
        ).scalar() or 0

        total_orders = db.session.query(func.count(Order.id)).filter(
            Order.created_at >= start_date
        ).scalar() or 0

        avg_order_value = (total_revenue / total_orders) if total_orders > 0 else 0

        # Customer Analytics
        total_customers = db.session.query(func.count(func.distinct(Order.user_id))).filter(
            Order.created_at >= start_date,
            Order.user_id.isnot(None)
        ).scalar() or 0

        # Format response data
        reports_data = {
            'period': period,
            'date_range': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            },
            'summary': {
                'total_revenue': float(total_revenue) / 100,
                'total_orders': total_orders,
                'avg_order_value': float(avg_order_value) / 100,
                'total_customers': total_customers
            },
            'revenue_chart': [
                {
                    'date': item.date.isoformat(),
                    'revenue': float(item.daily_revenue) / 100,
                    'orders': item.daily_orders
                }
                for item in revenue_data
            ],
            'order_status': [
                {
                    'status': item.status,
                    'count': item.count
                }
                for item in status_data
            ],
            'top_menu_items': [
                {
                    'name': item.name,
                    'quantity_sold': item.total_sold,
                    'revenue': float(item.total_revenue) / 100
                }
                for item in top_items_data
            ],
            'order_types': [
                {
                    'type': item.order_type,
                    'count': item.count
                }
                for item in order_type_data
            ]
        }

        return jsonify(reports_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/receipts/<order_id>/download', methods=['GET'])
@jwt_required
@admin_required()
def download_receipt(current_user, order_id):
    """Generate downloadable receipt"""
    try:
        order = Order.query.options(
            joinedload(Order.order_items).joinedload(OrderItem.menu_item)
        ).filter_by(id=order_id).first()

        if not order:
            return jsonify({'error': 'Order not found'}), 404

        # For now, return receipt data for frontend to generate PDF
        # Later can implement server-side PDF generation
        receipt_data = {
            'order_number': f"#{order.id[:8].upper()}",
            'date': order.created_at.strftime('%Y-%m-%d %H:%M:%S') if order.created_at else '',
            'customer_name': f"Customer #{order.id[:8]}",
            'restaurant_info': {
                'name': 'ExpreeZmeal',
                'address': '123 Main Street, New York, NY 10001',
                'phone': '(555) 123-4567',
                'email': 'orders@expreezmeal.com'
            },
            'items': [
                {
                    'name': item.menu_item.name if item.menu_item else 'Unknown Item',
                    'quantity': item.quantity,
                    'unit_price': float(item.unit_price) / 100,
                    'total_price': float(item.total_price) / 100
                }
                for item in order.order_items
            ],
            'subtotal': float(order.subtotal) / 100,
            'tax': float(order.tax) / 100,
            'tip': float(order.tip or 0) / 100,
            'total': float(order.total) / 100,
            'payment_method': 'Card'
        }

        return jsonify(receipt_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@jwt_required
@admin_required()
def get_admin_users(current_user):
    """Get all admin users"""
    try:
        users = User.query.filter_by(is_superuser=True).order_by(User.created_at.desc()).all()

        return jsonify({
            'admins': [
                {
                    'id': user.id,
                    'full_name': user.full_name,
                    'email': user.email,
                    'phone': user.phone,
                    'is_superuser': user.is_superuser,
                    'created_at': user.created_at.isoformat() if user.created_at else None,
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                    'last_activity': user.last_activity.isoformat() if user.last_activity else None
                }
                for user in users
            ]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users', methods=['POST'])
@jwt_required
@admin_required()
def create_admin_user(current_user):
    """Create new admin user"""
    try:
        data = request.get_json()

        if not data or not data.get('full_name') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Full name, email and password are required'}), 400

        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email'].lower().strip()).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 400

        # Create new admin user
        new_user = User(
            full_name=data['full_name'],
            email=data['email'].lower().strip(),
            phone=data.get('phone'),
            password=generate_password_hash(data['password']),
            is_superuser=True,  # All users created through admin are superusers
            created_at=datetime.utcnow()
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'message': 'Admin user created successfully',
            'id': new_user.id,
            'name': new_user.full_name,
            'email': new_user.email
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['PUT'])
@jwt_required
@admin_required()
def update_admin_user(current_user, user_id):
    """Update admin user"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        user = User.query.filter_by(id=user_id, is_superuser=True).first()

        if not user:
            return jsonify({'error': 'Admin user not found'}), 404

        # Update fields if provided
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            # Check if email is already taken by another user
            existing_user = User.query.filter(
                User.email == data['email'].lower().strip(),
                User.id != user_id
            ).first()
            if existing_user:
                return jsonify({'error': 'Email already taken by another user'}), 400
            user.email = data['email'].lower().strip()
        if 'phone' in data:
            user.phone = data['phone']

        db.session.commit()

        return jsonify({
            'message': 'Admin user updated successfully',
            'id': user.id,
            'name': user.full_name,
            'email': user.email
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@jwt_required
@admin_required()
def delete_admin_user(current_user, user_id):
    """Delete admin user"""
    try:
        # Prevent self-deletion
        if current_user.id == user_id:
            return jsonify({'error': 'Cannot delete your own account'}), 400

        user = User.query.filter_by(id=user_id, is_superuser=True).first()

        if not user:
            return jsonify({'error': 'Admin user not found'}), 404

        user_name = user.full_name

        # Revoke all sessions for the user before deletion
        revoke_all_user_sessions(user_id)

        # Delete the user
        db.session.delete(user)
        db.session.commit()

        return jsonify({
            'message': f'Admin user "{user_name}" has been deleted',
            'id': user_id
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/upload', methods=['POST'])
@jwt_required
@admin_required()
def upload_image(current_user):
    """Upload image for menu items"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Check file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        if not file.filename or '.' not in file.filename:
            return jsonify({'error': 'Invalid file type'}), 400

        extension = file.filename.rsplit('.', 1)[1].lower()
        if extension not in allowed_extensions:
            return jsonify({'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif, webp'}), 400

        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', 'menu')
        os.makedirs(upload_dir, exist_ok=True)

        # Generate unique filename
        import uuid
        filename = f"{uuid.uuid4()}.{extension}"
        file_path = os.path.join(upload_dir, filename)

        # Save file
        file.save(file_path)

        # Return the URL path
        file_url = f"/static/uploads/menu/{filename}"

        return jsonify({
            'message': 'Image uploaded successfully',
            'url': file_url,
            'filename': filename
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
