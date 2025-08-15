import unittest
from unittest.mock import patch, MagicMock
from backend.app import app

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    def test_health_check(self):
        resp = self.client.get('/api/health')
        self.assertEqual(resp.status_code, 200)
        self.assertIn('status', resp.get_json())

    @patch('backend.app.Category')
    def test_get_categories(self, mock_category):
        mock_category.query.filter_by.return_value.order_by.return_value.all.return_value = []
        resp = self.client.get('/api/categories')
        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.get_json(), list)

    @patch('backend.app.MenuItem')
    def test_get_menu_items(self, mock_menu):
        mock_menu.query.filter_by.return_value.all.return_value = []
        resp = self.client.get('/api/menu-items')
        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.get_json(), list)

    @patch('backend.app.ContactInquiry')
    @patch('backend.app.db')
    @patch('backend.app.email_service')
    def test_submit_contact_form(self, mock_email, mock_db, mock_inquiry):
        mock_inquiry.return_value.to_dict.return_value = {}
        mock_email.send_contact_inquiry_notification.return_value = True
        mock_email.send_contact_confirmation.return_value = True
        mock_db.session.add.return_value = None
        mock_db.session.commit.return_value = None
        data = {
            'name': 'Test', 'email': 'test@example.com', 'subject': 'Hi', 'message': 'Hello!'
        }
        resp = self.client.post('/api/contact/submit', json=data)
        self.assertEqual(resp.status_code, 201)
        self.assertIn('message', resp.get_json())

    def test_submit_contact_form_missing_fields(self):
        data = {'name': 'Test'}
        resp = self.client.post('/api/contact/submit', json=data)
        self.assertEqual(resp.status_code, 400)
        self.assertIn('error', resp.get_json())

if __name__ == '__main__':
    unittest.main()
