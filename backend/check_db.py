from app import app, db
from database import MenuItem, OptionChoice, CustomizationOption

def check_pricing():
    with app.app_context():
        print('=== MENU ITEMS PRICING ===')
        items = MenuItem.query.all()
        for item in items:
            print(f'{item.name}: ${item.price} (type: {type(item.price)})')

        print('\n=== CUSTOMIZATION PRICING ===')
        choices = db.session.query(CustomizationOption, OptionChoice).join(OptionChoice).all()
        for option, choice in choices:
            print(f'{option.name} - {choice.name}: +${choice.price_modifier} (type: {type(choice.price_modifier)})')

if __name__ == '__main__':
    check_pricing()
