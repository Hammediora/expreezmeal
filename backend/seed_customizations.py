#!/usr/bin/env python3
"""
Seed script for ExpreeZmeal customizable menu items
"""

import os
import sys
from flask import Flask
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(__file__))

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set. Check your environment variables.")

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
from database import db, init_db, MenuItem, Category, CustomizationOption, OptionChoice

def seed_menu_customizations():
    """Add customization options to existing base menu items"""

    with app.app_context():
        # Initialize database properly
        db.init_app(app)

        # Clear existing customization data only
        OptionChoice.query.delete()
        CustomizationOption.query.delete()
        db.session.commit()

        # Find existing base items from seed_simple_menu.py
        shawarma = MenuItem.query.filter_by(name='Shawarma').first()
        zobo = MenuItem.query.filter_by(name='Zobo').first()
        meat_pie = MenuItem.query.filter_by(name='Meat Pie').first()

        if not shawarma or not zobo or not meat_pie:
            print("❌ Base menu items not found! Run seed_simple_menu.py first.")
            return

        # Shawarma customization options
        protein_option = CustomizationOption(
            menu_item_id=shawarma.id,
            name='Protein',
            type='SINGLE_SELECT',
            is_required=True,
            display_order=1
        )
        db.session.add(protein_option)
        db.session.flush()

        # Protein choices
        protein_choices = [
            ('Chicken', 0.00, True),
            ('Beef', 3.00, False),
            ('Mixed (Chicken & Beef)', 3.00, False)
        ]

        for i, (name, price, is_default) in enumerate(protein_choices):
            choice = OptionChoice(
                customization_option_id=protein_option.id,
                name=name,
                price_modifier=price,
                is_default=is_default,
                display_order=i + 1
            )
            db.session.add(choice)

        # Add-ons option
        addons_option = CustomizationOption(
            menu_item_id=shawarma.id,
            name='Add-ons',
            type='MULTI_SELECT',
            is_required=False,
            display_order=2
        )
        db.session.add(addons_option)
        db.session.flush()

        # Add-on choices
        addon_choices = [
            ('Extra Sauce', 0.75, False),
            ('Add Hotdog', 2.00, False)
        ]

        for i, (name, price, is_default) in enumerate(addon_choices):
            choice = OptionChoice(
                customization_option_id=addons_option.id,
                name=name,
                price_modifier=price,
                is_default=is_default,
                display_order=i + 1
            )
            db.session.add(choice)

        # Zobo sweetness customization option
        sweetness_option = CustomizationOption(
            menu_item_id=zobo.id,
            name='Sweetness Level',
            type='SINGLE_SELECT',
            is_required=True,
            display_order=1
        )
        db.session.add(sweetness_option)
        db.session.flush()

        # Sweetness choices (no price difference)
        sweetness_choices = [
            ('Sweetened', 0.00, True),
            ('Unsweetened', 0.00, False)
        ]

        for i, (name, price, is_default) in enumerate(sweetness_choices):
            choice = OptionChoice(
                customization_option_id=sweetness_option.id,
                name=name,
                price_modifier=price,
                is_default=is_default,
                display_order=i + 1
            )
            db.session.add(choice)

        # Zobo flavor customization option
        flavor_option = CustomizationOption(
            menu_item_id=zobo.id,
            name='Flavor',
            type='SINGLE_SELECT',
            is_required=False,
            display_order=2
        )
        db.session.add(flavor_option)
        db.session.flush()

        # Flavor choices
        flavor_choices = [
            ('Classic', 0.00, True),
            ('Ginger', 3.00, False),
            ('Pineapple', 3.00, False),
            ('Mixed Fruits', 3.00, False)
        ]

        for i, (name, price, is_default) in enumerate(flavor_choices):
            choice = OptionChoice(
                customization_option_id=flavor_option.id,
                name=name,
                price_modifier=price,
                is_default=is_default,
                display_order=i + 1
            )
            db.session.add(choice)

        # Update Meat Pie price to $8.00 (no customizations needed)
        meat_pie.price = 8.00

        # Commit all changes
        db.session.commit()
        print("✅ Menu customizations seeded successfully!")
        print(f"   - Shawarma: Beef +$3, Mixed +$3, Extra Sauce +$0.75, Hotdog +$2")
        print(f"   - Zobo: Ginger/Pineapple/Mixed Fruits +$3 each, sweetness free")
        print(f"   - Meat Pie: Updated to $8.00 (no customizations - just meat)")

if __name__ == '__main__':
    seed_menu_customizations()
