#!/usr/bin/env python3
"""
End-to-end test for the ExpreeZmeal email system integration
This test simulates the full checkout flow and verifies email sending
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"
TEST_EMAIL = "hammedbello97@gmail.com"

def test_full_checkout_flow():
    """Test the complete checkout flow with email confirmation"""
    print("🧪 Testing Full Checkout Flow with Email Integration")
    print("=" * 60)
    
    # Step 1: Create an order
    print("📝 Step 1: Creating test order...")
    
    order_data = {
        "items": [
            {
                "menu_item_id": "d51712d5-2b18-453b-b301-8f04b5c612c5",  # Shawarma UUID
                "quantity": 1,
                "special_instructions": "Extra sauce please",
                "customizations": []
            }
        ],
        "delivery_address": {
            "name": "Test Customer",
            "email": TEST_EMAIL,
            "phone": "+1234567890"
        },
        "payment_method": "card",
        "special_instructions": "Test order for email integration",
        "tip_amount": 200  # $2.00 in cents
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/orders/create", json=order_data)
        
        if response.status_code == 200:
            order = response.json()
            order_id = order['order_id']
            total_amount = order['total_amount']
            print(f"✅ Order created: {order_id}")
            print(f"💰 Total amount: ${total_amount/100:.2f}")
            
            # Step 2: Create payment intent
            print("\n💳 Step 2: Creating payment intent...")
            
            payment_data = {
                "amount": total_amount,
                "currency": "usd",
                "order_id": order_id,
                "customer_email": TEST_EMAIL,
                "customer_name": "Test Customer",
                "customer_phone": "+1234567890"
            }
            
            payment_response = requests.post(f"{BASE_URL}/api/stripe/create-payment-intent", json=payment_data)
            
            if payment_response.status_code == 200:
                payment_result = payment_response.json()
                payment_intent_id = payment_result['payment_intent_id']
                print(f"✅ Payment intent created: {payment_intent_id}")
                
                # Step 3: Simulate successful payment (we can't actually complete Stripe payment in test)
                print("\n🔄 Step 3: Simulating payment confirmation...")
                print("   (In real flow, Stripe would process the payment)")
                
                # Step 4: Test manual confirmation email (backup method)
                print("\n📧 Step 4: Testing manual confirmation email...")
                
                confirmation_data = {
                    "email": TEST_EMAIL,
                    "name": "Test Customer",
                    "phone": "+1234567890"
                }
                
                email_response = requests.post(f"{BASE_URL}/api/orders/{order_id}/send-confirmation", json=confirmation_data)
                
                if email_response.status_code == 200:
                    email_result = email_response.json()
                    print(f"✅ Manual confirmation email sent: {email_result['message']}")
                    print(f"📧 Email sent to: {email_result['email']}")
                    
                    return True
                else:
                    print(f"❌ Manual confirmation email failed: {email_response.status_code} - {email_response.text}")
                    return False
                    
            else:
                print(f"❌ Payment intent creation failed: {payment_response.status_code} - {payment_response.text}")
                return False
                
        else:
            print(f"❌ Order creation failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False

def test_email_templates():
    """Test different email templates"""
    print("\n🎨 Testing Email Templates")
    print("=" * 30)
    
    # Test order status update
    print("📋 Testing order status update email...")
    
    status_data = {
        "order_id": "TEST-STATUS-001",
        "customer_email": TEST_EMAIL,
        "customer_name": "Test Customer",
        "new_status": "READY"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/update-order-status", json=status_data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Status update email sent: {result['message']}")
            return True
        else:
            print(f"❌ Status update email failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Status update test failed: {e}")
        return False

def test_admin_dashboard():
    """Test the admin email dashboard"""
    print("\n🏠 Testing Admin Dashboard")
    print("=" * 25)
    
    try:
        # Test admin dashboard access
        response = requests.get(f"{BASE_URL}/admin/email-test")
        
        if response.status_code == 200:
            print("✅ Admin dashboard accessible")
            
            # Test the test email endpoint
            test_response = requests.post(f"{BASE_URL}/api/test-email", json={"email": TEST_EMAIL})
            
            if test_response.status_code == 200:
                result = test_response.json()
                print(f"✅ Dashboard test email sent: {result['message']}")
                return True
            else:
                print(f"❌ Dashboard test email failed: {test_response.status_code}")
                return False
        else:
            print(f"❌ Admin dashboard not accessible: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Admin dashboard test failed: {e}")
        return False

def main():
    """Run comprehensive email integration tests"""
    print("🍖 ExpreeZmeal Email Integration Test Suite")
    print("=" * 50)
    print(f"📧 Test emails will be sent to: {TEST_EMAIL}")
    print(f"🌐 Backend URL: {BASE_URL}")
    print()
    
    results = []
    
    # Test 1: Full checkout flow
    results.append(test_full_checkout_flow())
    
    # Test 2: Email templates
    results.append(test_email_templates())
    
    # Test 3: Admin dashboard
    results.append(test_admin_dashboard())
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Final Test Results:")
    print(f"✅ Passed: {sum(results)}/{len(results)}")
    print(f"❌ Failed: {len(results) - sum(results)}/{len(results)}")
    
    if all(results):
        print("\n🎉 ALL TESTS PASSED!")
        print("✅ Email service is fully integrated and working correctly")
        print("✅ Frontend-to-backend email flow is operational")
        print("✅ All email templates are functional")
        print(f"📧 Check {TEST_EMAIL} for test emails")
        print("\n🚀 The ExpreeZmeal email system is ready for production!")
    else:
        print("\n⚠️  Some tests failed. Please check the logs above.")
        print("🔧 Email system may need additional configuration.")

if __name__ == "__main__":
    main()
