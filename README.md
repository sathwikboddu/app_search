# app_search
# App Review System

## 📌 Project Overview
This is a **Full-Stack Django + React** web application that allows users to search for apps, submit reviews, and enables supervisors to approve or reject reviews. The backend is powered by **Django REST Framework (DRF)**, and the frontend is built using **React**.

## 🚀 Features
### ✅ User Features
- Search for apps and view details
- Submit reviews for apps
- View only **approved** reviews

### 🔧 Supervisor Features
- View all pending reviews
- Approve or reject reviews

### 🛠 Tech Stack
- **Backend**: Django, Django REST Framework (DRF), PostgreSQL
- **Frontend**: React, Axios
- **Authentication**: JWT-based authentication

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository
```bash
 git clone <your-repo-url>
 cd app_search
```

### 2️⃣ Backend Setup (Django)
#### Create Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate  # (Linux/macOS)
.venv\Scripts\activate     # (Windows)
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Apply Migrations & Run Server
```bash
python manage.py migrate
python manage.py runserver
```

### 3️⃣ Frontend Setup (React)
#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start React App
```bash
npm start
```

---

## 🖥 API Endpoints
### 🔹 Reviews
- **Get Reviews** (approved only)
  ```bash
  GET /api/reviews/?app_id=<app_id>&is_approved=True
  ```
- **Submit a Review**
  ```bash
  POST /api/review/submit/
  {
    "app": <app_id>,
    "review_text": "This is my review"
  }
  ```
- **Approve/Reject a Review** (Admin Only)
  ```bash
  PATCH /api/review/approve/<review_id>
  {
    "is_approved": true | false
  }
  ```

---

## 🔒 Git Ignore Setup
We have excluded the following directories from Git tracking:
```
.idea/
.venv/
node_modules/
__pycache__/
.DS_Store
```

---

## 🎯 Future Improvements
- Add **pagination** for reviews
- Improve **search experience** with text similarity algorithms
- Implement **user authentication** for role-based access

---

## 🤝 Contributing
1. Fork the repo
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -m "Added new feature"`)
4. Push to branch (`git push origin feature-branch`)
5. Open a **Pull Request**

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 📧 Contact
For any queries, feel free to reach out!
- Email: your-email@example.com
- LinkedIn: [Your Profile](https://www.linkedin.com/in/your-profile)


