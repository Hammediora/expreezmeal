#!/usr/bin/env python3
"""
Seed admin user for ExpreeZmeal
Run this script to create the default admin user.
"""

import os
import sys
from datetime import datetime
from werkzeug.security import generate_password_hash

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from database import db, User

def create_admin_user():
    """Create default admin user"""
    with app.app_context():
        # Check if admin already exists
        existing_admin = User.query.filter_by(email='admin@expreezmeal.com').first()

        if existing_admin:
            print("✅ Admin user already exists!")
            print(f"   Email: {existing_admin.email}")
            print(f"   Name: {existing_admin.full_name}")
            return

        # Create admin user
        admin_user = User(
            full_name='Admin User',
            email='admin@expreezmeal.com',
            password=generate_password_hash('admin123'),  # Hash the password
            is_superuser=True,
            created_at=datetime.utcnow()
        )

        try:
            db.session.add(admin_user)
            db.session.commit()

            print("🎉 Admin user created successfully!")
            print(f"   Email: {admin_user.email}")
            print(f"   Password: admin123")
            print(f"   Name: {admin_user.full_name}")
            print(f"   ID: {admin_user.id}")

        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating admin user: {str(e)}")

if __name__ == '__main__':
    print("🚀 Creating ExpreeZmeal admin user...")
    create_admin_user()
