import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'Welcome to Expreez-Meal' in response.data

def test_index_2(client):
    response = client.get('/index-2')
    assert response.status_code == 200
    assert b'Welcome to Expreez-Meal' in response.data

def test_login(client):
    response = client.get('/login')
    assert response.status_code == 200
    assert b'Welcome back' in response.data

def test_menu(client):
    response = client.get('/all_food')
    assert response.status_code == 200
    assert b'All Food Menu' in response.data

# def test_wishlist(client):
#     response = client.get('/wishlist')
#     assert response.status_code == 200
#     assert b'Wishlist' in response.data

def login_required(client):
    response = client.get('/dashboard')
    assert response.status_code == 200
    assert b'Login' in response.data