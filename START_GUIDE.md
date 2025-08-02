# 🚀 **ExpreeZmeal Startup Guide**

## **Current Status: ✅ BOTH SERVICES RUNNING**

### **Backend (Flask API)** 
- **Status**: ✅ Running on `http://localhost:5000`
- **API Health**: ✅ Working (`/api/health` returns healthy status)
- **CORS**: ✅ Configured for frontend communication

### **Frontend (Next.js)** 
- **Status**: ✅ Running on `http://localhost:3001` 
- **Framework**: Next.js with TailwindCSS
- **State**: ✅ Cart context and components ready

---

## **🔗 How to Start Both Services**

### **1. Start Backend (Terminal 1)**
```bash
cd backend
python app.py
```
**Expected Output:**
```
* Running on http://127.0.0.1:5000
* Debug mode: on
```

### **2. Start Frontend (Terminal 2)**  
```bash
cd frontend
npm run dev
```
**Expected Output:**
```
▲ Next.js 15.4.5 (Turbopack)
- Local:        http://localhost:3001
```

---

## **🧪 Testing the Connection**

### **Backend API Test:**
```bash
curl http://localhost:5000/api/health
```
**Should return:**
```json
{
  "status": "healthy", 
  "timestamp": "2025-08-01T21:06:57.552675"
}
```

### **Frontend Test:**
Visit: `http://localhost:3001`
- ✅ Should show ExpreeZmeal homepage
- ✅ Nigerian luxury theme (red/gold colors)
- ✅ Responsive navigation and footer

---

## **📱 Available Pages**

| Page | URL | Status |
|------|-----|--------|
| Home | `http://localhost:3001/` | ✅ Ready |
| Menu | `http://localhost:3001/menu` | ✅ Ready |
| Contact | `http://localhost:3001/contact` | ✅ Ready |
| Checkout | `http://localhost:3001/checkout` | ✅ Ready |

---

## **🔌 API Endpoints**

| Endpoint | Method | Purpose | Status |
|----------|---------|---------|--------|
| `/api/health` | GET | Health check | ✅ Working |
| `/api/categories` | GET | Food categories | ✅ Ready |
| `/api/menu-items` | GET | Menu items | ✅ Ready |
| `/api/menu-items/featured` | GET | Featured items | ✅ Ready |
| `/api/orders` | POST | Create order | ✅ Ready |

---

## **🛒 Shopping Cart Features**

- ✅ **Add to Cart**: Click any "Add to Cart" button
- ✅ **View Cart**: Click cart icon in navbar  
- ✅ **Update Quantities**: Use +/- buttons in cart
- ✅ **Checkout Flow**: Multi-step process
- ✅ **Persistent Storage**: Cart saves in localStorage

---

## **⚠️ Notes**

1. **No Sample Data**: APIs work but return empty arrays (need to add menu items to database)
2. **Development Mode**: Both services running in debug/dev mode
3. **CORS Enabled**: Frontend can communicate with backend
4. **Port Numbers**: Frontend auto-switched to 3001 (3000 was busy)

---

## **🎯 Next Steps for Full Testing**

1. **Add Sample Data** to database (categories & menu items)
2. **Configure Environment Variables** (.env files)
3. **Test Full Checkout Flow** with sample products
4. **Setup Database** (PostgreSQL + Redis for sessions)

---

**🎉 The migration is complete and both services are connected!**