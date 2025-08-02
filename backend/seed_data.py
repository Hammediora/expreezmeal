#!/usr/bin/env python3
"""
Sample data seeder for ExpreeZmeal
Run this script to populate the database with sample Nigerian food items
"""

import os
import sys
from datetime import datetime
from app import app
from database import db, Category, MenuItem

def seed_database():
    """Seed the database with sample Nigerian food data"""
    
    with app.app_context():
        print("Seeding ExpreeZmeal database...")
        
        # Create tables if they don't exist
        db.create_all()
        
        # Clear existing data (optional - comment out if you want to keep existing data)
        print("Clearing existing data...")
        MenuItem.query.delete()
        Category.query.delete()
        db.session.commit()
        
        # Sample Categories
        categories_data = [
            {
                'name': 'Shawarma',
                'description': 'Our signature shawarma wraps with authentic Nigerian flavors',
                'image_url': '/images/categories/shawarma.jpg',
                'display_order': 1
            },
            {
                'name': 'Zobo & Drinks',
                'description': 'Refreshing Nigerian beverages and traditional zobo',
                'image_url': '/images/categories/drinks.jpg',
                'display_order': 2
            },
            {
                'name': 'Meat Pies',
                'description': 'Crispy, flaky pastries filled with seasoned meat',
                'image_url': '/images/categories/meat-pies.jpg',
                'display_order': 3
            },
            {
                'name': 'Local Snacks',
                'description': 'Traditional Nigerian snacks and finger foods',
                'image_url': '/images/categories/snacks.jpg',
                'display_order': 4
            },
            {
                'name': 'Rice & Pasta',
                'description': 'Nigerian-style rice dishes and pasta',
                'image_url': '/images/categories/rice.jpg',
                'display_order': 5
            }
        ]
        
        print("Creating categories...")
        categories = {}
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.session.add(category)
            db.session.flush()  # Get the ID
            categories[cat_data['name']] = category.id
            print(f"   + {cat_data['name']}")
        
        # Sample Menu Items
        menu_items_data = [
            # Shawarma
            {
                'category': 'Shawarma',
                'name': 'Classic Chicken Shawarma',
                'description': 'Tender grilled chicken wrapped in fresh pita with vegetables and our signature sauce',
                'price': 2500.00,
                'image_url': '/images/menu/chicken-shawarma.jpg',
                'is_featured': True,
                'preparation_time': 15,
                'calories': 450,
                'dietary_flags': ['halal']
            },
            {
                'category': 'Shawarma',
                'name': 'Beef Suya Shawarma',
                'description': 'Spicy suya-seasoned beef with onions, tomatoes, and cucumber in pita bread',
                'price': 3000.00,
                'sale_price': 2800.00,
                'image_url': '/images/menu/beef-shawarma.jpg',
                'preparation_time': 18,
                'calories': 520,
                'dietary_flags': ['halal', 'spicy']
            },
            {
                'category': 'Shawarma',
                'name': 'Turkey Shawarma Deluxe',
                'description': 'Premium turkey breast with avocado, lettuce, and special herb sauce',
                'price': 3500.00,
                'image_url': '/images/menu/turkey-shawarma.jpg',
                'is_featured': True,
                'preparation_time': 20,
                'calories': 380,
                'dietary_flags': ['halal', 'premium']
            },
            
            # Zobo & Drinks
            {
                'category': 'Zobo & Drinks',
                'name': 'Traditional Zobo',
                'description': 'Refreshing hibiscus drink with ginger, pineapple, and cucumber',
                'price': 800.00,
                'image_url': '/images/menu/zobo.jpg',
                'is_featured': True,
                'preparation_time': 5,
                'calories': 120,
                'dietary_flags': ['vegan', 'refreshing']
            },
            {
                'category': 'Zobo & Drinks',
                'name': 'Chapman Cocktail',
                'description': 'Nigerian-style fruit cocktail with grenadine, Sprite, and fresh fruits',
                'price': 1200.00,
                'image_url': '/images/menu/chapman.jpg',
                'preparation_time': 8,
                'calories': 180,
                'dietary_flags': ['non-alcoholic', 'fruity']
            },
            {
                'category': 'Zobo & Drinks',
                'name': 'Palm Wine (Fresh)',
                'description': 'Fresh, naturally fermented palm wine - authentic Nigerian experience',
                'price': 1500.00,
                'image_url': '/images/menu/palm-wine.jpg',
                'preparation_time': 3,
                'calories': 200,
                'dietary_flags': ['traditional', 'alcoholic']
            },
            
            # Meat Pies
            {
                'category': 'Meat Pies',
                'name': 'Classic Beef Meat Pie',
                'description': 'Flaky pastry filled with seasoned minced beef, potatoes, and carrots',
                'price': 600.00,
                'image_url': '/images/menu/beef-meat-pie.jpg',
                'is_featured': True,
                'preparation_time': 12,
                'calories': 320,
                'dietary_flags': ['classic']
            },
            {
                'category': 'Meat Pies',
                'name': 'Chicken Meat Pie',
                'description': 'Golden pastry with tender chicken chunks and mixed vegetables',
                'price': 650.00,
                'image_url': '/images/menu/chicken-meat-pie.jpg',
                'preparation_time': 12,
                'calories': 310,
                'dietary_flags': ['halal']
            },
            {
                'category': 'Meat Pies',
                'name': 'Fish Meat Pie',
                'description': 'Crispy crust filled with flaked fish, onions, and Nigerian spices',
                'price': 700.00,
                'image_url': '/images/menu/fish-meat-pie.jpg',
                'preparation_time': 15,
                'calories': 290,
                'dietary_flags': ['pescatarian']
            },
            
            # Local Snacks
            {
                'category': 'Local Snacks',
                'name': 'Puff Puff (6 pieces)',
                'description': 'Sweet, fluffy Nigerian doughnuts, perfect with any drink',
                'price': 500.00,
                'image_url': '/images/menu/puff-puff.jpg',
                'preparation_time': 10,
                'calories': 240,
                'dietary_flags': ['sweet', 'vegetarian']
            },
            {
                'category': 'Local Snacks',
                'name': 'Chin Chin',
                'description': 'Crunchy, sweet fried dough cubes - perfect snack',
                'price': 800.00,
                'image_url': '/images/menu/chin-chin.jpg',
                'preparation_time': 5,
                'calories': 350,
                'dietary_flags': ['crunchy', 'sweet']
            },
            {
                'category': 'Local Snacks',
                'name': 'Akara (Bean Cakes)',
                'description': 'Deep-fried bean fritters with onions and peppers',
                'price': 400.00,
                'image_url': '/images/menu/akara.jpg',
                'is_featured': True,
                'preparation_time': 8,
                'calories': 180,
                'dietary_flags': ['vegan', 'protein-rich']
            },
            
            # Rice & Pasta
            {
                'category': 'Rice & Pasta',
                'name': 'Jollof Rice',
                'description': 'The king of Nigerian rice dishes with tomatoes, peppers, and spices',
                'price': 1800.00,
                'image_url': '/images/menu/jollof-rice.jpg',
                'is_featured': True,
                'preparation_time': 25,
                'calories': 420,
                'dietary_flags': ['vegan', 'classic']
            },
            {
                'category': 'Rice & Pasta',
                'name': 'Fried Rice',
                'description': 'Nigerian-style fried rice with mixed vegetables and liver',
                'price': 2000.00,
                'image_url': '/images/menu/fried-rice.jpg',
                'preparation_time': 20,
                'calories': 450,
                'dietary_flags': ['colorful']
            },
            {
                'category': 'Rice & Pasta',
                'name': 'Spaghetti Jollof',
                'description': 'Nigerian twist on pasta - spaghetti cooked in Jollof sauce',
                'price': 1600.00,
                'image_url': '/images/menu/spaghetti-jollof.jpg',
                'preparation_time': 18,
                'calories': 380,
                'dietary_flags': ['fusion']
            }
        ]
        
        print("Creating menu items...")
        for item_data in menu_items_data:
            category_name = item_data.pop('category')
            item_data['category_id'] = categories[category_name]
            
            menu_item = MenuItem(**item_data)
            db.session.add(menu_item)
            print(f"   + {item_data['name']}")
        
        # Commit all changes
        db.session.commit()
        
        # Print summary
        total_categories = Category.query.count()
        total_items = MenuItem.query.count()
        featured_items = MenuItem.query.filter_by(is_featured=True).count()
        
        print("\n" + "="*50)
        print("Database seeded successfully!")
        print("="*50)
        print(f"Categories created: {total_categories}")
        print(f"Menu items created: {total_items}")
        print(f"Featured items: {featured_items}")
        print("="*50)
        print("\nYou can now:")
        print("   • Visit http://localhost:3001 to see the frontend")
        print("   • Test http://localhost:5000/api/categories")
        print("   • Test http://localhost:5000/api/menu-items")
        print("   • Test http://localhost:5000/api/menu-items/featured")
        print("\nTry adding items to cart and testing checkout flow!")

if __name__ == '__main__':
    try:
        seed_database()
    except Exception as e:
        print(f"ERROR: Failed to seed database: {e}")
        sys.exit(1)