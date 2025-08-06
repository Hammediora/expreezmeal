from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from database import db, MenuItem, Category, CustomizationOption, OptionChoice, Promotion
import os
from datetime import datetime
import uuid

admin_menu = Blueprint('admin_menu', __name__)

def require_admin_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No authorization token provided'}), 401

        try:
            if token.startswith('Bearer '):
                token = token[7:]

            payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
            request.current_user_id = payload['user_id']
            request.current_user_email = payload['email']

        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated_function

# Categories
@admin_menu.route('/api/admin/categories', methods=['GET'])
@require_admin_auth
def get_categories():
    """Get all categories"""
    categories = Category.query.order_by(Category.display_order, Category.name).all()
    return jsonify({
        'categories': [{
            'id': cat.id,
            'name': cat.name,
            'description': cat.description,
            'image_url': cat.image_url,
            'is_active': cat.is_active,
            'display_order': cat.display_order,
            'menu_items_count': len(cat.menu_items)
        } for cat in categories]
    })

@admin_menu.route('/api/admin/categories', methods=['POST'])
@require_admin_auth
def create_category():
    """Create new category"""
    data = request.get_json()

    try:
        category = Category(
            name=data['name'],
            description=data.get('description'),
            image_url=data.get('image_url'),
            is_active=data.get('is_active', True),
            display_order=data.get('display_order', 0)
        )

        db.session.add(category)
        db.session.commit()

        return jsonify({
            'message': 'Category created successfully',
            'category': {
                'id': category.id,
                'name': category.name,
                'description': category.description,
                'image_url': category.image_url,
                'is_active': category.is_active,
                'display_order': category.display_order
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_menu.route('/api/admin/categories/<category_id>', methods=['PUT'])
@require_admin_auth
def update_category(category_id):
    """Update category"""
    category = Category.query.get_or_404(category_id)
    data = request.get_json()

    try:
        category.name = data.get('name', category.name)
        category.description = data.get('description', category.description)
        category.image_url = data.get('image_url', category.image_url)
        category.is_active = data.get('is_active', category.is_active)
        category.display_order = data.get('display_order', category.display_order)

        db.session.commit()

        return jsonify({
            'message': 'Category updated successfully',
            'category': {
                'id': category.id,
                'name': category.name,
                'description': category.description,
                'image_url': category.image_url,
                'is_active': category.is_active,
                'display_order': category.display_order
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_menu.route('/api/admin/categories/<category_id>', methods=['DELETE'])
@require_admin_auth
def delete_category(category_id):
    """Delete category"""
    category = Category.query.get_or_404(category_id)

    try:
        # Check if category has menu items
        if category.menu_items:
            return jsonify({'error': 'Cannot delete category with existing menu items'}), 400

        db.session.delete(category)
        db.session.commit()

        return jsonify({'message': 'Category deleted successfully'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Menu Items
@admin_menu.route('/api/admin/menu-items', methods=['GET'])
@require_admin_auth
def get_menu_items():
    """Get all menu items with optional category filter"""
    category_id = request.args.get('category_id')

    query = MenuItem.query
    if category_id:
        query = query.filter_by(category_id=category_id)

    menu_items = query.order_by(MenuItem.name).all()

    return jsonify({
        'menu_items': [{
            'id': item.id,
            'name': item.name,
            'description': item.description,
            'price': float(item.price),
            'sale_price': float(item.sale_price) if item.sale_price else None,
            'image_url': item.image_url,
            'category_id': item.category_id,
            'category_name': item.category.name if item.category else None,
            'is_available': item.is_available,
            'is_featured': item.is_featured,
            'preparation_time': item.preparation_time,
            'calories': item.calories,
            'allergens': item.allergens,
            'dietary_flags': item.dietary_flags,
            'customization_options_count': len(item.customization_options),
            'created_at': item.created_at.isoformat(),
            'updated_at': item.updated_at.isoformat()
        } for item in menu_items]
    })

@admin_menu.route('/api/admin/menu-items', methods=['POST'])
@require_admin_auth
def create_menu_item():
    """Create new menu item"""
    data = request.get_json()

    try:
        menu_item = MenuItem(
            category_id=data['category_id'],
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            sale_price=data.get('sale_price'),
            image_url=data.get('image_url'),
            is_available=data.get('is_available', True),
            is_featured=data.get('is_featured', False),
            preparation_time=data.get('preparation_time'),
            calories=data.get('calories'),
            allergens=data.get('allergens', []),
            dietary_flags=data.get('dietary_flags', [])
        )

        db.session.add(menu_item)
        db.session.commit()

        return jsonify({
            'message': 'Menu item created successfully',
            'menu_item': {
                'id': menu_item.id,
                'name': menu_item.name,
                'description': menu_item.description,
                'price': float(menu_item.price),
                'category_id': menu_item.category_id
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_menu.route('/api/admin/menu-items/<item_id>', methods=['GET'])
@require_admin_auth
def get_menu_item(item_id):
    """Get single menu item with customization options"""
    menu_item = MenuItem.query.get_or_404(item_id)

    customization_options = []
    for option in menu_item.customization_options:
        choices = [{
            'id': choice.id,
            'name': choice.name,
            'price_modifier': float(choice.price_modifier),
            'is_default': choice.is_default,
            'display_order': choice.display_order
        } for choice in option.option_choices]

        customization_options.append({
            'id': option.id,
            'name': option.name,
            'type': option.type,
            'is_required': option.is_required,
            'display_order': option.display_order,
            'choices': choices
        })

    return jsonify({
        'menu_item': {
            'id': menu_item.id,
            'name': menu_item.name,
            'description': menu_item.description,
            'price': float(menu_item.price),
            'sale_price': float(menu_item.sale_price) if menu_item.sale_price else None,
            'image_url': menu_item.image_url,
            'category_id': menu_item.category_id,
            'category_name': menu_item.category.name if menu_item.category else None,
            'is_available': menu_item.is_available,
            'is_featured': menu_item.is_featured,
            'preparation_time': menu_item.preparation_time,
            'calories': menu_item.calories,
            'allergens': menu_item.allergens,
            'dietary_flags': menu_item.dietary_flags,
            'customization_options': customization_options,
            'created_at': menu_item.created_at.isoformat(),
            'updated_at': menu_item.updated_at.isoformat()
        }
    })

@admin_menu.route('/api/admin/menu-items/<item_id>', methods=['PUT'])
@require_admin_auth
def update_menu_item(item_id):
    """Update menu item"""
    menu_item = MenuItem.query.get_or_404(item_id)
    data = request.get_json()

    try:
        menu_item.category_id = data.get('category_id', menu_item.category_id)
        menu_item.name = data.get('name', menu_item.name)
        menu_item.description = data.get('description', menu_item.description)
        menu_item.price = data.get('price', menu_item.price)
        menu_item.sale_price = data.get('sale_price', menu_item.sale_price)
        menu_item.image_url = data.get('image_url', menu_item.image_url)
        menu_item.is_available = data.get('is_available', menu_item.is_available)
        menu_item.is_featured = data.get('is_featured', menu_item.is_featured)
        menu_item.preparation_time = data.get('preparation_time', menu_item.preparation_time)
        menu_item.calories = data.get('calories', menu_item.calories)
        menu_item.allergens = data.get('allergens', menu_item.allergens)
        menu_item.dietary_flags = data.get('dietary_flags', menu_item.dietary_flags)
        menu_item.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Menu item updated successfully',
            'menu_item': {
                'id': menu_item.id,
                'name': menu_item.name,
                'price': float(menu_item.price)
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_menu.route('/api/admin/menu-items/<item_id>', methods=['DELETE'])
@require_admin_auth
def delete_menu_item(item_id):
    """Delete menu item"""
    menu_item = MenuItem.query.get_or_404(item_id)

    try:
        db.session.delete(menu_item)
        db.session.commit()

        return jsonify({'message': 'Menu item deleted successfully'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Promotions
@admin_menu.route('/api/admin/promotions', methods=['GET'])
@require_admin_auth
def get_promotions():
    """Get all promotions"""
    promotions = Promotion.query.order_by(Promotion.created_at.desc()).all()

    return jsonify({
        'promotions': [{
            'id': promo.id,
            'name': promo.name,
            'description': promo.description,
            'promo_code': promo.promo_code,
            'discount_type': promo.discount_type,
            'discount_value': float(promo.discount_value) if promo.discount_value else None,
            'minimum_order_amount': float(promo.minimum_order_amount) if promo.minimum_order_amount else None,
            'maximum_discount': float(promo.maximum_discount) if promo.maximum_discount else None,
            'applies_to': promo.applies_to,
            'category_id': promo.category_id,
            'category_name': promo.category.name if promo.category else None,
            'menu_item_id': promo.menu_item_id,
            'menu_item_name': promo.menu_item.name if promo.menu_item else None,
            'start_date': promo.start_date.isoformat(),
            'end_date': promo.end_date.isoformat(),
            'usage_limit': promo.usage_limit,
            'usage_count': promo.usage_count,
            'is_active': promo.is_active,
            'is_current': promo.start_date <= datetime.utcnow() <= promo.end_date and promo.is_active,
            'created_at': promo.created_at.isoformat(),
            'updated_at': promo.updated_at.isoformat()
        } for promo in promotions]
    })

@admin_menu.route('/api/admin/promotions', methods=['POST'])
@require_admin_auth
def create_promotion():
    """Create new promotion"""
    data = request.get_json()

    try:
        promotion = Promotion(
            name=data['name'],
            description=data.get('description'),
            promo_code=data.get('promo_code'),
            discount_type=data['discount_type'],
            discount_value=data.get('discount_value'),
            minimum_order_amount=data.get('minimum_order_amount'),
            maximum_discount=data.get('maximum_discount'),
            applies_to=data['applies_to'],
            category_id=data.get('category_id'),
            menu_item_id=data.get('menu_item_id'),
            start_date=datetime.fromisoformat(data['start_date']),
            end_date=datetime.fromisoformat(data['end_date']),
            usage_limit=data.get('usage_limit'),
            is_active=data.get('is_active', True)
        )

        db.session.add(promotion)
        db.session.commit()

        return jsonify({
            'message': 'Promotion created successfully',
            'promotion': {
                'id': promotion.id,
                'name': promotion.name,
                'discount_type': promotion.discount_type,
                'discount_value': float(promotion.discount_value) if promotion.discount_value else None
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_menu.route('/api/admin/promotions/<promotion_id>', methods=['PUT'])
@require_admin_auth
def update_promotion(promotion_id):
    """Update promotion"""
    promotion = Promotion.query.get_or_404(promotion_id)
    data = request.get_json()

    try:
        promotion.name = data.get('name', promotion.name)
        promotion.description = data.get('description', promotion.description)
        promotion.promo_code = data.get('promo_code', promotion.promo_code)
        promotion.discount_type = data.get('discount_type', promotion.discount_type)
        promotion.discount_value = data.get('discount_value', promotion.discount_value)
        promotion.minimum_order_amount = data.get('minimum_order_amount', promotion.minimum_order_amount)
        promotion.maximum_discount = data.get('maximum_discount', promotion.maximum_discount)
        promotion.applies_to = data.get('applies_to', promotion.applies_to)
        promotion.category_id = data.get('category_id', promotion.category_id)
        promotion.menu_item_id = data.get('menu_item_id', promotion.menu_item_id)

        if 'start_date' in data:
            promotion.start_date = datetime.fromisoformat(data['start_date'])
        if 'end_date' in data:
            promotion.end_date = datetime.fromisoformat(data['end_date'])

        promotion.usage_limit = data.get('usage_limit', promotion.usage_limit)
        promotion.is_active = data.get('is_active', promotion.is_active)
        promotion.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Promotion updated successfully',
            'promotion': {
                'id': promotion.id,
                'name': promotion.name
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_menu.route('/api/admin/promotions/<promotion_id>', methods=['DELETE'])
@require_admin_auth
def delete_promotion(promotion_id):
    """Delete promotion"""
    promotion = Promotion.query.get_or_404(promotion_id)

    try:
        db.session.delete(promotion)
        db.session.commit()

        return jsonify({'message': 'Promotion deleted successfully'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
