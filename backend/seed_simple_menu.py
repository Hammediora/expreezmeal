#!/usr/bin/env python3
"""
Simplified seed data for ExpreeZmeal - Only Shawarma, Zobo, and Meat Pies
"""

import os
import sys
from datetime import datetime
from app import app
from database import db, Category, MenuItem

def seed_simple_menu():
    """Seed the database with only the three items ExpreeZmeal sells"""

    with app.app_context():
        print("Seeding ExpreeZmeal with simplified menu...")

        # Create tables if they don't exist
        db.create_all()

        # Clear existing data
        MenuItem.query.delete()
        Category.query.delete()
        db.session.commit()

        # Sample Categories (only the ones we need)
        categories_data = [
            {
                'name': 'Shawarma',
                'description': 'Delicious wrapped Middle Eastern-style grilled meats',
                'display_order': 1
            },
            {
                'name': 'Beverages',
                'description': 'Refreshing traditional drinks',
                'display_order': 2
            },
            {
                'name': 'Meat Pies',
                'description': 'Fresh baked pastries with savory fillings',
                'display_order': 3
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

        # Sample Menu Items (prices in USD cents) - Base items with customizations
        menu_items_data = [
            # Shawarma (customizable)
            {
                'category': 'Shawarma',
                'name': 'Shawarma',
                'description': 'Delicious wrapped Middle Eastern-style grilled meat with fresh vegetables and signature sauce. Choose your protein and add-ons.',
                'price': 1200,  # $12.00 base price (chicken)
                'image_url': '/images/menu/chicken-shawarma.jpg',
                'is_featured': True,
                'preparation_time': 15,
                'calories': 450,
                'dietary_flags': ['halal', 'customizable']
            },

            # Zobo (customizable)
            {
                'category': 'Beverages',
                'name': 'Zobo',
                'description': 'Refreshing Nigerian herbal drink made with hibiscus leaves and natural spices. Choose your flavor and sweetness level.',
                'price': 400,  # $4.00 base price
                'image_url': '/images/menu/zobo.jpg',
                'is_featured': True,
                'preparation_time': 5,
                'calories': 25,
                'dietary_flags': ['healthy', 'vegan', 'customizable']
            },

            # Meat Pie (no customizations)
            {
                'category': 'Meat Pies',
                'name': 'Meat Pie',
                'description': 'Fresh baked flaky pastry with seasoned meat filling.',
                'price': 800,  # $8.00 base price
                'image_url': '/images/menu/chicken-meat-pie.jpg',
                'is_featured': True,
                'preparation_time': 10,
                'calories': 320,
                'dietary_flags': ['halal']
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
        print(f"\n✅ Simplified menu seeded successfully!")
        print(f"Created {len(categories_data)} categories and {len(menu_items_data)} menu items")
        print("\n📋 Your ExpreeZmeal Menu:")
        print("   🌯 Shawarma (customizable protein & add-ons)")
        print("   🍹 Zobo (customizable flavor & sweetness)")
        print("   🥧 Meat Pie (customizable filling)")
        print("\nAll prices are in USD! Run customizations script to add options.")

if __name__ == '__main__':
    seed_simple_menu()
