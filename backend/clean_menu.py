#!/usr/bin/env python3
"""
Clean menu script - Remove all items except Shawarma, Zobo, and Meat Pie
and set up proper customizations for each.
"""

from database import db, MenuItem, Category, CustomizationOption, OptionChoice
from app import app

def clean_menu():
    with app.app_context():
        print("Cleaning menu...")

        # Delete all existing menu items and customizations
        CustomizationOption.query.delete()
        OptionChoice.query.delete()
        MenuItem.query.delete()

        # Keep only the categories we need
        all_categories = Category.query.all()
        needed_categories = ['Shawarma', 'Zobo & Drinks', 'Meat Pies']

        for category in all_categories:
            if category.name not in needed_categories:
                db.session.delete(category)

        db.session.commit()

        # Get or create the categories we need
        shawarma_cat = Category.query.filter_by(name='Shawarma').first()
        if not shawarma_cat:
            shawarma_cat = Category(
                name='Shawarma',
                description='Premium Nigerian-style shawarma wraps',
                display_order=1
            )
            db.session.add(shawarma_cat)

        zobo_cat = Category.query.filter_by(name='Zobo & Drinks').first()
        if not zobo_cat:
            zobo_cat = Category(
                name='Zobo & Drinks',
                description='Refreshing traditional Nigerian beverages',
                display_order=2
            )
            db.session.add(zobo_cat)

        meat_pie_cat = Category.query.filter_by(name='Meat Pies').first()
        if not meat_pie_cat:
            meat_pie_cat = Category(
                name='Meat Pies',
                description='Flaky pastries filled with seasoned meat and vegetables',
                display_order=3
            )
            db.session.add(meat_pie_cat)

        db.session.commit()

        # Create Shawarma with customizations
        print("Creating Shawarma...")
        shawarma = MenuItem(
            category_id=shawarma_cat.id,
            name='Nigerian Shawarma',
            description='Premium shawarma wrap with your choice of protein and add-ons',
            price=1299,  # Base price in cents ($12.99)
            image_url='/images/menu/chicken-shawarma.jpg',
            is_available=True,
            is_featured=True,
            preparation_time=10
        )
        db.session.add(shawarma)
        db.session.flush()  # Get the ID

        # Protein options for Shawarma
        protein_option = CustomizationOption(
            menu_item_id=shawarma.id,
            name='Protein Choice',
            type='SINGLE_SELECT',
            is_required=True,
            display_order=1
        )
        db.session.add(protein_option)
        db.session.flush()

        protein_choices = [
            ('Chicken', 0, True),
            ('Beef', 200, False),  # +$2.00
            ('Mixed (Chicken + Beef)', 150, False)  # +$1.50
        ]

        for name, price_modifier, is_default in protein_choices:
            choice = OptionChoice(
                customization_option_id=protein_option.id,
                name=name,
                price_modifier=price_modifier,
                is_default=is_default,
                display_order=len([c for c in protein_choices if protein_choices.index((name, price_modifier, is_default)) >= protein_choices.index(c)])
            )
            db.session.add(choice)

        # Add-ons for Shawarma
        addons_option = CustomizationOption(
            menu_item_id=shawarma.id,
            name='Add-ons',
            type='MULTI_SELECT',
            is_required=False,
            display_order=2
        )
        db.session.add(addons_option)
        db.session.flush()

        addon_choices = [
            ('Extra Sauce', 75, False),  # +$0.75
            ('Add Hotdog', 199, False)   # +$1.99
        ]

        for name, price_modifier, is_default in addon_choices:
            choice = OptionChoice(
                customization_option_id=addons_option.id,
                name=name,
                price_modifier=price_modifier,
                is_default=is_default,
                display_order=len([c for c in addon_choices if addon_choices.index((name, price_modifier, is_default)) >= addon_choices.index(c)])
            )
            db.session.add(choice)

        # Create Zobo with customizations
        print("Creating Zobo...")
        zobo = MenuItem(
            category_id=zobo_cat.id,
            name='Traditional Zobo',
            description='Refreshing hibiscus drink with natural fruits and spices',
            price=399,  # $3.99 in cents
            image_url='/images/menu/zobo.jpg',
            is_available=True,
            is_featured=True,
            preparation_time=3
        )
        db.session.add(zobo)
        db.session.flush()

        # Sweetness options for Zobo
        sweetness_option = CustomizationOption(
            menu_item_id=zobo.id,
            name='Sweetness Level',
            type='SINGLE_SELECT',
            is_required=True,
            display_order=1
        )
        db.session.add(sweetness_option)
        db.session.flush()

        sweetness_choices = [
            ('Sweetened', 0, True),
            ('Unsweetened', 0, False)
        ]

        for name, price_modifier, is_default in sweetness_choices:
            choice = OptionChoice(
                customization_option_id=sweetness_option.id,
                name=name,
                price_modifier=price_modifier,
                is_default=is_default,
                display_order=len([c for c in sweetness_choices if sweetness_choices.index((name, price_modifier, is_default)) >= sweetness_choices.index(c)])
            )
            db.session.add(choice)

        # Create Meat Pie (no customizations)
        print("Creating Meat Pie...")
        meat_pie = MenuItem(
            category_id=meat_pie_cat.id,
            name='Classic Beef Meat Pie',
            description='Flaky pastry filled with seasoned minced beef, potatoes, and carrots',
            price=649,  # $6.49 in cents
            image_url='/images/menu/beef-meat-pie.jpg',
            is_available=True,
            is_featured=True,
            preparation_time=5
        )
        db.session.add(meat_pie)

        # Commit all changes
        db.session.commit()

        print("✅ Menu cleaned successfully!")
        print("\nCurrent menu:")
        print("1. Nigerian Shawarma ($12.99 base)")
        print("   - Protein: Chicken (free), Beef (+$2.00), Mixed (+$1.50)")
        print("   - Add-ons: Extra Sauce (+$0.75), Add Hotdog (+$1.99)")
        print("2. Traditional Zobo ($3.99)")
        print("   - Sweetness: Sweetened or Unsweetened")
        print("3. Classic Beef Meat Pie ($6.49)")
        print("   - No customizations")

if __name__ == '__main__':
    clean_menu()
