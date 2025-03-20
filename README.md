# 🚗 Inspecto – Centralized Vehicle Inspection Platform  

## 📌 Overview  
**Inspecto** is a full-stack web application designed to streamline vehicle inspections by connecting users with verified inspectors. It provides a secure and transparent system for managing inspection requests, reports, and user-inspector communication.  

---

## 🚀 Features  

### 👤 User Features  
- Register/Login securely  
- Add and manage vehicle details  
- Request inspections from verified inspectors  
- View and download inspection reports  
- Communicate with inspectors via messaging  

### 🔍 Inspector Features  
- Register/Login & get verified  
- View and accept inspection requests  
- Conduct inspections and upload reports  
- Communicate with users  

### 🛠️ Admin Features  
- Manage users and inspectors  
- Approve and verify inspectors  
- Oversee inspection reports  

---

## 🏗️ Tech Stack  
- **Frontend**: React.js (Vite) + Tailwind CSS + Styled Components  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB  
- **State Management**: Redux Toolkit  
- **Authentication**: JWT (Access & Refresh Tokens)  
- **API Calls**: Axios  
- **Messaging**: Internal user-inspector communication  
- **Code Structure**: Class-based approach with Repository Pattern in TypeScript  

---

## 🔒 Security & Authentication  
- Role-based authentication (Admin, Inspector, User) using JWT  
- Secure file uploads for profile images & documents  
- Separate refresh token management for different roles  
- Data validation and error handling  

---

## 📅 Future Improvements  
✅ GPS-based inspector tracking  
✅ Enhanced analytics in the admin dashboard  

---

## Screenshots

![Landing Page Dark](https://i.imgur.com/7kPZGTS.png)
![Landing Page Light](https://i.imgur.com/ixp9Rx9.png)



## ⚡ Getting Started  

### 📥 Clone the Repository  
```sh
git clone https://github.com/yourusername/Inspecto.git
cd Inspecto
```

### 🔧 Install Dependencies  
#### Backend:  
```sh
cd backend
npm install
```
#### Frontend:  
```sh
cd frontend
npm install
```

### 🚀 Run the Application  
#### Start the Backend:  
```sh
cd backend
npm start
```
#### Start the Frontend:  
```sh
cd frontend
npm run dev
```

---

## 🤝 Contributing  
We welcome contributions! Feel free to fork the repo and submit a pull request.  

---

## 📜 License  
This project is licensed under the MIT License.  

---

## 📩 Contact  
For queries, feel free to reach out or raise an issue in the repository.  

---

🚀 *Inspecto – Making Vehicle Inspections Seamless!*  
