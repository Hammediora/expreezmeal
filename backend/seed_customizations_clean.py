#!/usr/bin/env python3
"""
Clean seed script for ExpreeZmeal customizations - only adds options to existing base items
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
from database import db, MenuItem, CustomizationOption, OptionChoice

def seed_customizations():
    """Add customization options to existing base menu items only"""

    with app.app_context():
        # Initialize database properly
        db.init_app(app)

        # Clear existing customization data only
        print("🧹 Clearing existing customizations...")
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

        # 1. Add Shawarma customizations
        print("🌯 Adding Shawarma customizations...")

        # Protein option for Shawarma
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
        chicken_choice = OptionChoice(
            customization_option_id=protein_option.id,
            name='Chicken',
            price_modifier=0.0,
            is_default=True,
            display_order=1
        )
        beef_choice = OptionChoice(
            customization_option_id=protein_option.id,
            name='Beef',
            price_modifier=2.0,
            is_default=False,
            display_order=2
        )
        mixed_choice = OptionChoice(
            customization_option_id=protein_option.id,
            name='Mixed (Chicken & Beef)',
            price_modifier=3.0,
            is_default=False,
            display_order=3
        )

        db.session.add_all([chicken_choice, beef_choice, mixed_choice])

        # Add-ons option for Shawarma
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
        extra_sauce = OptionChoice(
            customization_option_id=addons_option.id,
            name='Extra Sauce',
            price_modifier=0.5,
            is_default=False,
            display_order=1
        )
        add_hotdog = OptionChoice(
            customization_option_id=addons_option.id,
            name='Add Hotdog',
            price_modifier=1.5,
            is_default=False,
            display_order=2
        )

        db.session.add_all([extra_sauce, add_hotdog])

        # 2. Add Zobo customizations
        print("🍹 Adding Zobo customizations...")

        # Sweetness option for Zobo
        sweetness_option = CustomizationOption(
            menu_item_id=zobo.id,
            name='Sweetness Level',
            type='SINGLE_SELECT',
            is_required=True,
            display_order=1
        )
        db.session.add(sweetness_option)
        db.session.flush()

        # Sweetness choices
        sweetened = OptionChoice(
            customization_option_id=sweetness_option.id,
            name='Sweetened',
            price_modifier=0.0,
            is_default=True,
            display_order=1
        )
        unsweetened = OptionChoice(
            customization_option_id=sweetness_option.id,
            name='Unsweetened',
            price_modifier=0.0,
            is_default=False,
            display_order=2
        )

        db.session.add_all([sweetened, unsweetened])

        # Flavor option for Zobo
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
        classic = OptionChoice(
            customization_option_id=flavor_option.id,
            name='Classic',
            price_modifier=0.0,
            is_default=True,
            display_order=1
        )
        ginger = OptionChoice(
            customization_option_id=flavor_option.id,
            name='Ginger Infused',
            price_modifier=0.5,
            is_default=False,
            display_order=2
        )
        pineapple = OptionChoice(
            customization_option_id=flavor_option.id,
            name='Pineapple',
            price_modifier=0.5,
            is_default=False,
            display_order=3
        )

        db.session.add_all([classic, ginger, pineapple])

        # 3. Add Meat Pie customizations
        print("🥧 Adding Meat Pie customizations...")

        # Filling option for Meat Pie
        filling_option = CustomizationOption(
            menu_item_id=meat_pie.id,
            name='Filling',
            type='SINGLE_SELECT',
            is_required=True,
            display_order=1
        )
        db.session.add(filling_option)
        db.session.flush()

        # Filling choices
        chicken_filling = OptionChoice(
            customization_option_id=filling_option.id,
            name='Chicken',
            price_modifier=0.0,
            is_default=True,
            display_order=1
        )
        beef_filling = OptionChoice(
            customization_option_id=filling_option.id,
            name='Beef',
            price_modifier=1.0,
            is_default=False,
            display_order=2
        )

        db.session.add_all([chicken_filling, beef_filling])

        # Commit all changes
        db.session.commit()

        print("\n✅ Clean customizations seeded successfully!")
        print("   🌯 Shawarma: Protein options (Chicken, Beef, Mixed) + Add-ons")
        print("   🍹 Zobo: Sweetness level + Flavor options")
        print("   🥧 Meat Pie: Filling options (Chicken, Beef)")
        print("\n✨ All customizations are now available for the 3 base menu items!")

if __name__ == '__main__':
    seed_customizations()
