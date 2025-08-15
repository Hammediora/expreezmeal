import unittest
from backend import app

class BasicTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.app.test_client()
        self.app.testing = True

    def test_home(self):
        response = self.app.get('/')
        self.assertIn(response.status_code, [200, 404])  # Adjust as needed

if __name__ == '__main__':
    unittest.main()
