#!/usr/bin/env python3
"""
Test email service integration with order confirmation
"""

import sys
import os
import requests
import json

# Add the backend directory to the path so we can import modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Test data
test_email = "hammedbello97@gmail.com"
test_order = {
    "order_id": "TEST-EMAIL-001",
    "status": "CONFIRMED",
    "subtotal": 1299,  # $12.99 in cents
    "tax_amount": 130,  # $1.30 in cents
    "total_amount": 1429,  # $14.29 in cents
    "items": [
        {
            "name": "Chicken Shawarma",
            "quantity": 1,
            "price": 12.99,
            "customizations": "Extra sauce, Extra veggies"
        }
    ]
}

def test_email_service_direct():
    """Test the email service directly"""
    print("🧪 Testing email service directly...")
    
    try:
        from email_service import email_service
        
        customer_info = {
            "name": "Test Customer",
            "email": test_email,
            "phone": "+1234567890"
        }
        
        success = email_service.send_order_confirmation(test_order, customer_info)
        
        if success:
            print("✅ Direct email service test PASSED")
            return True
        else:
            print("❌ Direct email service test FAILED")
            return False
            
    except Exception as e:
        print(f"❌ Direct email service test ERROR: {e}")
        return False

def test_email_endpoint():
    """Test the email confirmation endpoint"""
    print("\n🌐 Testing email confirmation endpoint...")
    
    try:
        url = "http://localhost:5000/api/test-email"
        payload = {
            "email": test_email
        }
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Email endpoint test PASSED: {result.get('message', '')}")
            return True
        else:
            print(f"❌ Email endpoint test FAILED: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Email endpoint test FAILED: Cannot connect to backend (is it running?)")
        return False
    except Exception as e:
        print(f"❌ Email endpoint test ERROR: {e}")
        return False

def test_order_confirmation_endpoint():
    """Test the order confirmation endpoint"""
    print("\n📧 Testing order confirmation endpoint...")
    
    try:
        # First create a test order (simplified)
        url = "http://localhost:5000/api/orders/TEST-EMAIL-001/send-confirmation"
        payload = {
            "email": test_email,
            "name": "Test Customer",
            "phone": "+1234567890"
        }
        
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Order confirmation endpoint test PASSED: {result.get('message', '')}")
            return True
        else:
            print(f"❌ Order confirmation endpoint test FAILED: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Order confirmation endpoint test FAILED: Cannot connect to backend")
        return False
    except Exception as e:
        print(f"❌ Order confirmation endpoint test ERROR: {e}")
        return False

def main():
    """Run all email tests"""
    print("🍖 ExpreeZmeal Email Service Test Suite")
    print("=" * 50)
    
    results = []
    
    # Test 1: Direct email service
    results.append(test_email_service_direct())
    
    # Test 2: Email endpoint
    results.append(test_email_endpoint())
    
    # Test 3: Order confirmation endpoint
    results.append(test_order_confirmation_endpoint())
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"✅ Passed: {sum(results)}/{len(results)}")
    print(f"❌ Failed: {len(results) - sum(results)}/{len(results)}")
    
    if all(results):
        print("\n🎉 All email tests PASSED! Email service is working correctly.")
        print(f"📧 Check {test_email} for test emails.")
    else:
        print("\n⚠️  Some email tests FAILED. Check the logs above for details.")

if __name__ == "__main__":
    main()
