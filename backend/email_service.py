import os
import resend
from datetime import datetime
from typing import Optional, Dict, List
from dotenv import load_dotenv
from flask import render_template_string
from jinja2 import Environment, FileSystemLoader
import json
import time

# Load environment variables
load_dotenv()

# Initialize Resend with API key from environment
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY
    print(f"SUCCESS: Resend API key loaded successfully")
else:
    print("WARNING: RESEND_API_KEY not found in environment variables")
    print("   Please set RESEND_API_KEY in your .env file")
    print("   Email functionality will not work properly")

# Setup Jinja2 template environment
template_dir = os.path.join(os.path.dirname(__file__), 'email_templates')
template_env = Environment(loader=FileSystemLoader(template_dir))

class EmailService:
    """Service for sending emails using Resend with Jinja2 templates"""

    def __init__(self):
        # Use the verified bellocraft.com domain
        self.from_email = "orders@bellocraft.com"
        self.support_email = "info@bellocraft.com"
        self.pickup_address = {
            "street": "123 N Michigan Avenue, Downtown",
            "city": "Chicago",
            "state": "IL",
            "zip": "60601",
            "phone": "(312) 555-0123"
        }

    def _render_template(self, template_name: str, **context) -> str:
        """Render email template with context"""
        try:
            template = template_env.get_template(template_name)

            # Add common context variables
            context.update({
                'support_email': self.support_email,
                'pickup_address': self.pickup_address,
                'current_year': datetime.now().year
            })

            return template.render(**context)
        except Exception as e:
            print(f" Template rendering error: {str(e)}")
            return ""

    def _send_email_with_retry(self, email_data: dict, max_retries: int = 3, delay: float = 2.0) -> tuple[bool, str]:
        """Send email with retry logic for better reliability"""
        for attempt in range(max_retries):
            try:
                response = resend.Emails.send(email_data)
                return True, response.get('id', 'N/A')
            except Exception as e:
                error_msg = str(e) if str(e) else type(e).__name__

                # Check for rate limiting
                if "Too many requests" in error_msg or "rate limit" in error_msg.lower():
                    if attempt < max_retries - 1:
                        # For rate limiting, wait longer
                        rate_limit_delay = delay * 2  # Double the delay for rate limits
                        print(f"⚠️ Rate limit hit on attempt {attempt + 1}, waiting {rate_limit_delay}s...")
                        time.sleep(rate_limit_delay)
                        continue

                # Try to get more detailed error info
                if hasattr(e, 'response') and e.response:
                    try:
                        status_code = getattr(e.response, 'status_code', 'N/A')
                        response_text = getattr(e.response, 'text', 'N/A')
                        error_msg = f"{error_msg} (HTTP {status_code}: {response_text})"
                    except:
                        pass

                if attempt < max_retries - 1:
                    print(f"⚠️ Email attempt {attempt + 1} failed: {error_msg} (retrying in {delay}s...)")
                    time.sleep(delay)
                    delay *= 1.5  # Gentler exponential backoff
                else:
                    print(f"❌ Email failed after {max_retries} attempts: {error_msg}")
                    print(f"   Exception type: {type(e).__name__}")
                    return False, error_msg
        return False, "Max retries exceeded"

    def send_order_confirmation(self, order_data: Dict, customer_info: Dict) -> bool:
        """Send order confirmation email to customer"""
        try:
            # Prepare template context
            context = {
                'email_title': 'Order Confirmation',
                'header_subtitle': 'Order Confirmation',
                'customer_name': customer_info.get('name', 'Customer'),
                'order_id': order_data.get('order_id', 'N/A'),
                'order_status': order_data.get('status', 'Confirmed'),
                'estimated_time': '10-15 minutes',
                'order_items': order_data.get('items', []),
                'subtotal': order_data.get('subtotal', 0),
                'tax_amount': order_data.get('tax_amount', 0),
                'total_amount': order_data.get('total_amount', 0)
            }

            # Render email template
            html_content = self._render_template('order_confirmation.html', **context)

            if not html_content:
                return False

            # Prepare email data
            email_data = {
                "from": self.from_email,
                "to": customer_info.get('email'),
                "subject": f"🍽️ Your ExpreeZmeal Order #{order_data.get('order_id')} is Confirmed!",
                "html": html_content
            }

            # Send email with retry logic
            success, result = self._send_email_with_retry(email_data)

            if success:
                print(f"✅ Order confirmation email sent to {customer_info.get('email')}")
                print(f"   Email ID: {result}")
                return True
            else:
                return False

        except Exception as e:
            error_msg = str(e) if str(e) else type(e).__name__
            print(f"❌ Failed to send order confirmation email: {error_msg}")
            print(f"   Exception type: {type(e).__name__}")
            return False

    def send_order_status_update(self, order_data: Dict, customer_info: Dict, new_status: str) -> bool:
        """Send order status update email"""
        try:
            status_messages = {
                "CONFIRMED": "Your order has been confirmed and is being prepared! ",
                "PREPARING": "Your order is now being prepared with care! ",
                "READY": " Your order is ready for pickup! Come get your delicious meal!",
                "COMPLETED": "Thank you! Your order has been completed. Enjoy your meal! ",
                "CANCELLED": "Your order has been cancelled. If you have questions, please contact us."
            }

            status_colors = {
                "CONFIRMED": "#17a2b8",
                "PREPARING": "#fd7e14",
                "READY": "#28a745",
                "COMPLETED": "#6f42c1",
                "CANCELLED": "#dc3545"
            }

            # Prepare template context
            context = {
                'email_title': 'Order Update',
                'header_subtitle': 'Order Update',
                'customer_name': customer_info.get('name', 'Customer'),
                'order_id': order_data.get('order_id', 'N/A'),
                'new_status': new_status,
                'status_message': status_messages.get(new_status, "Your order status has been updated."),
                'status_color': status_colors.get(new_status, "#667eea"),
                'total_amount': order_data.get('total_amount', 0)
            }

            # Render email template
            html_content = self._render_template('order_status_update.html', **context)

            if not html_content:
                return False

            # Prepare email data
            email_data = {
                "from": self.from_email,
                "to": customer_info.get('email'),
                "subject": f"🍽️ Order #{order_data.get('order_id')} Update: {new_status}",
                "html": html_content
            }

            # Send email with retry logic
            success, result = self._send_email_with_retry(email_data)

            if success:
                print(f"✅ Status update email sent to {customer_info.get('email')}")
                print(f"   Email ID: {result}")
                return True
            else:
                return False

        except Exception as e:
            error_msg = str(e) if str(e) else type(e).__name__
            print(f"❌ Failed to send status update email: {error_msg}")
            print(f"   Exception type: {type(e).__name__}")
            return False

    def send_new_menu_item_notification(self, item_data: Dict, customer_emails: List[str]) -> bool:
        """Send new menu item notification to customers"""
        try:
            # Prepare template context
            context = {
                'email_title': 'New Item Added',
                'header_subtitle': 'New Menu Item Alert!',
                'item_name': item_data.get('name', 'New Item'),
                'item_description': item_data.get('description', 'A delicious new addition to our menu!'),
                'item_price': item_data.get('price', 0),
                'item_image_url': item_data.get('image_url', '/images/menu/default.jpg'),
                'menu_url': 'http://localhost:3000/menu'
            }

            # Render email template
            html_content = self._render_template('new_menu_item.html', **context)

            if not html_content:
                return False

            # Send to multiple customers
            success_count = 0
            for email in customer_emails:
                try:
                    response = resend.Emails.send({
                        "from": self.from_email,
                        "to": email,
                        "subject": f" New at ExpreeZmeal: {item_data.get('name', 'Delicious Item')}!",
                        "html": html_content
                    })
                    success_count += 1
                except Exception as e:
                    print(f"❌ Failed to send to {email}: {str(e)}")

            print(f"✅ New menu item notification sent to {success_count}/{len(customer_emails)} customers")
            return success_count > 0

        except Exception as e:
            print(f"❌ Failed to send new menu item notifications: {str(e)}")
            return False

    def send_contact_inquiry_notification(self, inquiry_data: Dict, admin_email: str) -> bool:
        """Send contact inquiry notification to admin"""
        try:
            # Prepare template context
            context = {
                'email_title': 'New Contact Inquiry',
                'header_subtitle': 'New Contact Inquiry Received',
                'inquiry_id': inquiry_data.get('id', 'N/A'),
                'customer_name': inquiry_data.get('name', 'N/A'),
                'customer_email': inquiry_data.get('email', 'N/A'),
                'customer_phone': inquiry_data.get('phone', 'N/A'),
                'subject': inquiry_data.get('subject', 'N/A'),
                'message': inquiry_data.get('message', 'N/A'),
                'inquiry_type': inquiry_data.get('inquiry_type', 'general'),
                'event_date': inquiry_data.get('event_date', 'N/A'),
                'guest_count': inquiry_data.get('guest_count', 'N/A'),
                'budget_range': inquiry_data.get('budget_range', 'N/A'),
                'special_requirements': inquiry_data.get('special_requirements', 'N/A'),
                'created_at': inquiry_data.get('created_at', 'N/A')
            }

            # Render email template
            html_content = self._render_template('contact_inquiry_admin.html', **context)

            if not html_content:
                return False

            # Send email
            response = resend.Emails.send({
                "from": self.from_email,
                "to": admin_email,
                "subject": f"🔔 New Contact Inquiry: {inquiry_data.get('subject', 'No Subject')}",
                "html": html_content
            })

            print(f"✅ Contact inquiry notification sent to admin: {admin_email}")
            print(f"📧 Email ID: {response.get('id', 'N/A')}")
            return True

        except Exception as e:
            print(f"❌ Failed to send contact inquiry notification: {str(e)}")
            return False

    def send_contact_confirmation(self, inquiry_data: Dict, customer_email: str) -> bool:
        """Send contact confirmation email to customer"""
        try:
            # Prepare template context
            context = {
                'email_title': 'Thank You for Contacting Us',
                'header_subtitle': 'We Received Your Message',
                'customer_name': inquiry_data.get('name', 'Customer'),
                'inquiry_id': inquiry_data.get('id', 'N/A'),
                'subject': inquiry_data.get('subject', 'N/A'),
                'message': inquiry_data.get('message', 'N/A'),
                'inquiry_type': inquiry_data.get('inquiry_type', 'general'),
                'created_at': inquiry_data.get('created_at', 'N/A')
            }

            # Render email template
            html_content = self._render_template('contact_confirmation.html', **context)

            if not html_content:
                return False

            # Send email
            response = resend.Emails.send({
                "from": self.from_email,
                "to": customer_email,
                "subject": "✅ Thank You for Contacting ExpreeZmeal",
                "html": html_content
            })

            print(f"✅ Contact confirmation sent to: {customer_email}")
            print(f"📧 Email ID: {response.get('id', 'N/A')}")
            return True

        except Exception as e:
            print(f"❌ Failed to send contact confirmation: {str(e)}")
            return False

# Create global email service instance
email_service = EmailService()
