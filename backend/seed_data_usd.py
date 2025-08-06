#!/usr/bin/env python3
"""
Sample data seeder for ExpreeZmeal - USD Prices
Run this script to populate the database with sample Nigerian food items with USD pricing
"""

import os
import sys
from datetime import datetime
from app import app
from database import db, Category, MenuItem

def seed_database():
    """Seed the database with sample Nigerian food data in USD"""

    with app.app_context():
        print("Seeding ExpreeZmeal database with USD prices...")

        # Create tables if they don't exist
        db.create_all()

        # Clear existing data
        MenuItem.query.delete()
        Category.query.delete()
        db.session.commit()

        # Sample Categories
        categories_data = [
            {
                'name': 'Shawarma',
                'description': 'Delicious wrapped Middle Eastern-style grilled meats',
                'display_order': 1
            },
            {
                'name': 'Rice Dishes',
                'description': 'Authentic Nigerian rice preparations',
                'display_order': 2
            },
            {
                'name': 'Snacks',
                'description': 'Traditional Nigerian snacks and finger foods',
                'display_order': 3
            },
            {
                'name': 'Beverages',
                'description': 'Refreshing drinks and traditional beverages',
                'display_order': 4
            },
            {
                'name': 'Meat Pies',
                'description': 'Fresh baked pastries with savory fillings',
                'display_order': 5
            }
        ]

        # Create categories
        categories = {}
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.session.add(category)
            db.session.flush()  # Get the ID
            categories[cat_data['name']] = category.id
            print(f"Created category: {cat_data['name']}")

        # Sample Menu Items (prices in USD cents)
        menu_items_data = [
            # Shawarma
            {
                'category': 'Shawarma',
                'name': 'Classic Chicken Shawarma',
                'description': 'Tender grilled chicken wrapped in fresh pita with vegetables and our signature sauce',
                'price': 1200,  # $12.00
                'image_url': '/images/menu/chicken-shawarma.jpg',
                'is_featured': True,
                'preparation_time': 15,
                'calories': 450,
                'dietary_flags': ['halal']
            },
            {
                'category': 'Shawarma',
                'name': 'Beef Shawarma',
                'description': 'Succulent beef strips with fresh vegetables and tangy garlic sauce',
                'price': 1500,  # $15.00
                'sale_price': 1400,  # $14.00
                'image_url': '/images/menu/beef-shawarma.jpg',
                'is_featured': True,
                'preparation_time': 18,
                'calories': 520,
                'dietary_flags': ['halal']
            },
            {
                'category': 'Shawarma',
                'name': 'Turkey Shawarma',
                'description': 'Lean turkey meat with crisp vegetables and special herbs',
                'price': 1600,  # $16.00
                'image_url': '/images/menu/turkey-shawarma.jpg',
                'preparation_time': 16,
                'calories': 420,
                'dietary_flags': ['halal', 'lean']
            },

            # Rice Dishes
            {
                'category': 'Rice Dishes',
                'name': 'Jollof Rice',
                'description': 'Nigeria\'s beloved spiced rice cooked in rich tomato sauce',
                'price': 800,  # $8.00
                'image_url': '/images/menu/jollof-rice.jpg',
                'is_featured': True,
                'preparation_time': 25,
                'calories': 380,
                'dietary_flags': ['vegetarian']
            },
            {
                'category': 'Rice Dishes',
                'name': 'Fried Rice',
                'description': 'Colorful mixed vegetables stir-fried with seasoned rice',
                'price': 900,  # $9.00
                'image_url': '/images/menu/fried-rice.jpg',
                'preparation_time': 20,
                'calories': 420,
                'dietary_flags': ['vegetarian']
            },

            # Snacks
            {
                'category': 'Snacks',
                'name': 'Akara (Bean Fritters)',
                'description': 'Deep-fried bean cakes spiced with onions and peppers',
                'price': 600,  # $6.00
                'image_url': '/images/menu/akara.jpg',
                'preparation_time': 12,
                'calories': 250,
                'dietary_flags': ['vegetarian', 'protein-rich']
            },
            {
                'category': 'Snacks',
                'name': 'Puff Puff',
                'description': 'Sweet, fluffy deep-fried dough balls - Nigeria\'s favorite treat',
                'price': 400,  # $4.00
                'image_url': '/images/menu/puff-puff.jpg',
                'preparation_time': 15,
                'calories': 180,
                'dietary_flags': ['sweet', 'vegetarian']
            },

            # Meat Pies
            {
                'category': 'Meat Pies',
                'name': 'Chicken Meat Pie',
                'description': 'Flaky pastry filled with seasoned chicken and vegetables',
                'price': 500,  # $5.00
                'image_url': '/images/menu/chicken-meat-pie.jpg',
                'preparation_time': 10,
                'calories': 320,
                'dietary_flags': ['halal']
            },
            {
                'category': 'Meat Pies',
                'name': 'Beef Meat Pie',
                'description': 'Golden pastry with spiced ground beef filling',
                'price': 550,  # $5.50
                'image_url': '/images/menu/beef-meat-pie.jpg',
                'preparation_time': 10,
                'calories': 350,
                'dietary_flags': ['halal']
            },

            # Beverages
            {
                'category': 'Beverages',
                'name': 'Zobo (Hibiscus Tea)',
                'description': 'Refreshing herbal drink made with hibiscus and natural spices',
                'price': 300,  # $3.00
                'image_url': '/images/menu/zobo.jpg',
                'preparation_time': 5,
                'calories': 25,
                'dietary_flags': ['healthy', 'low-calorie', 'vegan']
            },
            {
                'category': 'Beverages',
                'name': 'Chapman',
                'description': 'Nigeria\'s signature non-alcoholic cocktail with fruits and spices',
                'price': 400,  # $4.00
                'image_url': '/images/menu/chapman.jpg',
                'preparation_time': 8,
                'calories': 120,
                'dietary_flags': ['refreshing', 'fruity']
            }
        ]

        # Create menu items
        for item_data in menu_items_data:
            category_name = item_data.pop('category')
            item_data['category_id'] = categories[category_name]

            menu_item = MenuItem(**item_data)
            db.session.add(menu_item)
            print(f"Created menu item: {item_data['name']} - ${item_data['price']/100:.2f}")

        # Commit all changes
        db.session.commit()
        print(f"\nDatabase seeded successfully!")
        print(f"Created {len(categories_data)} categories and {len(menu_items_data)} menu items")
        print("All prices are now in USD!")

if __name__ == '__main__':
    seed_database()
