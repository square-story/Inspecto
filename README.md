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
✅ Real-time messaging  
✅ GPS-based inspector tracking  
✅ Enhanced analytics in the admin dashboard  

---

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

## File Structure
```sh
Inspecto/
├─ .env
├─ .gitignore
├─ backend/
│  ├─ .env
│  ├─ .gitignore
│  ├─ dist/
│  │  ├─ app.js
│  │  ├─ config/
│  │  │  ├─ app.config.js
│  │  │  └─ db.config.js
│  │  ├─ controllers/
│  │  │  ├─ auth/
│  │  │  │  ├─ admin.auth.controller.js
│  │  │  │  ├─ inspector.auth.controller.js
│  │  │  │  └─ user.auth.controller.js
│  │  │  └─ user.controller.js
│  │  ├─ middlewares/
│  │  │  ├─ auth.middleware.js
│  │  │  └─ role.middleware.js
│  │  ├─ models/
│  │  │  ├─ admin.model.js
│  │  │  ├─ inspector.model.js
│  │  │  └─ user.model.js
│  │  ├─ repositories/
│  │  │  ├─ admin.repository.js
│  │  │  ├─ inspector.repository.js
│  │  │  ├─ interfaces/
│  │  │  │  └─ user.repository.interface.js
│  │  │  ├─ user.repository.js
│  │  │  └─ vehicle.repository.js
│  │  ├─ routes/
│  │  │  ├─ admin.routes.js
│  │  │  ├─ inspector.routes.js
│  │  │  └─ user.routes.js
│  │  ├─ server.js
│  │  ├─ services/
│  │  │  ├─ auth/
│  │  │  │  ├─ admin.auth.service.js
│  │  │  │  ├─ inspector.auth.service.js
│  │  │  │  └─ user.auth.service.js
│  │  │  └─ user.service.js
│  │  ├─ utils/
│  │  │  ├─ errorHandler.js
│  │  │  ├─ logger.js
│  │  │  └─ token.utils.js
│  │  └─ __tests__/
│  │     └─ example.test.js
│  ├─ jest.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src/
│  │  ├─ app.ts
│  │  ├─ config/
│  │  │  ├─ app.config.ts
│  │  │  ├─ db.config.ts
│  │  │  └─ redis.ts
│  │  ├─ controllers/
│  │  │  ├─ admin.controller.ts
│  │  │  ├─ auth/
│  │  │  │  ├─ admin.auth.controller.ts
│  │  │  │  ├─ inspector.auth.controller.ts
│  │  │  │  └─ user.auth.controller.ts
│  │  │  ├─ inspection.controller.ts
│  │  │  ├─ inspector.controller.ts
│  │  │  ├─ payment.controller.ts
│  │  │  ├─ user.controller.ts
│  │  │  └─ vehicle.controller.ts
│  │  ├─ middlewares/
│  │  │  ├─ auth.middleware.ts
│  │  │  └─ role.middleware.ts
│  │  ├─ models/
│  │  │  ├─ admin.model.ts
│  │  │  ├─ inspection.model.ts
│  │  │  ├─ inspector.model.ts
│  │  │  ├─ payment.model.ts
│  │  │  ├─ user.model.ts
│  │  │  └─ vehicle.model.ts
│  │  ├─ repositories/
│  │  │  ├─ admin.repository.ts
│  │  │  ├─ inspection.repository.ts
│  │  │  ├─ inspector.repository.ts
│  │  │  ├─ interfaces/
│  │  │  │  ├─ inspection.repository.interface.ts
│  │  │  │  ├─ inspector.repository.interface.ts
│  │  │  │  ├─ payment.repository.interface.ts
│  │  │  │  ├─ user.repository.interface.ts
│  │  │  │  └─ vehicle.repository.interface.ts
│  │  │  ├─ payment.repository.ts
│  │  │  ├─ user.repository.ts
│  │  │  └─ vehicle.repository.ts
│  │  ├─ routes/
│  │  │  ├─ admin.routes.ts
│  │  │  ├─ inspection.routes.ts
│  │  │  ├─ inspector.routes.ts
│  │  │  ├─ payment.routes.ts
│  │  │  ├─ user.routes.ts
│  │  │  └─ vehicles.routes.ts
│  │  ├─ server.ts
│  │  ├─ services/
│  │  │  ├─ admin.service.ts
│  │  │  ├─ auth/
│  │  │  │  ├─ admin.auth.service.ts
│  │  │  │  ├─ inspector.auth.service.ts
│  │  │  │  └─ user.auth.service.ts
│  │  │  ├─ email.service.ts
│  │  │  ├─ inspection.service.ts
│  │  │  ├─ inspector.service.ts
│  │  │  ├─ payment.service.ts
│  │  │  ├─ user.service.ts
│  │  │  └─ vehicle.service.ts
│  │  ├─ utils/
│  │  │  ├─ checkPaymentStatus.ts
│  │  │  ├─ email.ts
│  │  │  ├─ emailTemplates.ts
│  │  │  ├─ errorHandler.ts
│  │  │  ├─ logger.ts
│  │  │  ├─ otp.ts
│  │  │  └─ token.utils.ts
│  │  └─ __tests__/
│  │     └─ example.test.ts
│  └─ tsconfig.json
├─ desktop.ini
├─ frontend/
│  ├─ .env
│  ├─ .gitignore
│  ├─ components.json
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public/
│  │  └─ favicon.ico
│  ├─ src/
│  │  ├─ api/
│  │  │  └─ axios.ts
│  │  ├─ app/
│  │  │  ├─ AboutUs/
│  │  │  │  └─ index.tsx
│  │  │  ├─ adminDashboard/
│  │  │  │  ├─ components/
│  │  │  │  │  └─ AdminCard.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  └─ layout/
│  │  │  │     ├─ AdminSidebar.tsx
│  │  │  │     ├─ Header.tsx
│  │  │  │     └─ Layout.tsx
│  │  │  ├─ Contact/
│  │  │  │  └─ index.tsx
│  │  │  ├─ FAQ/
│  │  │  │  └─ index.tsx
│  │  │  ├─ Footer/
│  │  │  │  └─ index.tsx
│  │  │  ├─ hero/
│  │  │  │  └─ index.tsx
│  │  │  ├─ InspectorDashBoard/
│  │  │  │  ├─ app-sidebar.tsx
│  │  │  │  ├─ components/
│  │  │  │  │  ├─ AlertCompletion.tsx
│  │  │  │  │  ├─ EmailVerifcation.tsx
│  │  │  │  │  ├─ Search.tsx
│  │  │  │  │  └─ UserNav.tsx
│  │  │  │  ├─ Home.tsx
│  │  │  │  ├─ layout/
│  │  │  │  │  ├─ InspectorNavBar.tsx
│  │  │  │  │  └─ nav-user.tsx
│  │  │  │  └─ layout.tsx
│  │  │  ├─ InspectorManagment/
│  │  │  │  ├─ columns.tsx
│  │  │  │  ├─ components/
│  │  │  │  │  ├─ data-table-faceted-filter.tsx
│  │  │  │  │  ├─ data-table-view-options.tsx
│  │  │  │  │  ├─ DataTableToolbar.tsx
│  │  │  │  │  ├─ DenyReason.tsx
│  │  │  │  │  └─ InspectorDataTable.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ InspectorSettings/
│  │  │  │  ├─ AddressManagement/
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ DocumentManagment/
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  ├─ InspectorProfileForm.tsx
│  │  │  │  └─ SlotManagment/
│  │  │  │     └─ index.tsx
│  │  │  ├─ navbar/
│  │  │  │  ├─ logo.tsx
│  │  │  │  ├─ nav-menu.tsx
│  │  │  │  ├─ navigation-sheet.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ UserProfileIcon.tsx
│  │  │  ├─ UserDashboard/
│  │  │  │  ├─ dashboard/
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  ├─ InspectionManagement/
│  │  │  │  │  ├─ components/
│  │  │  │  │  │  ├─ AddressAutocomplete.tsx
│  │  │  │  │  │  ├─ MultiStepForm.tsx
│  │  │  │  │  │  ├─ schemas.tsx
│  │  │  │  │  │  └─ steps/
│  │  │  │  │  │     ├─ Step1.tsx
│  │  │  │  │  │     ├─ Step2.tsx
│  │  │  │  │  │     ├─ Step3.tsx
│  │  │  │  │  │     └─ Step4.tsx
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ PaymentHistory/
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ profile/
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  └─ ProfileForm.tsx
│  │  │  │  └─ VehicleManagment/
│  │  │  │     ├─ components/
│  │  │  │     │  ├─ AddVechicleDialogBox.tsx
│  │  │  │     │  ├─ DisplayVehicle.tsx
│  │  │  │     │  ├─ EditVehicleDialog.tsx
│  │  │  │     │  └─ VehicleDetailSheet.tsx
│  │  │  │     └─ index.tsx
│  │  │  └─ UserManagement/
│  │  │     ├─ columns.tsx
│  │  │     ├─ index.tsx
│  │  │     └─ UserDataTable.tsx
│  │  ├─ App.tsx
│  │  ├─ components/
│  │  │  ├─ admin/
│  │  │  │  ├─ adminDashboard/
│  │  │  │  │  ├─ components/
│  │  │  │  │  └─ layout/
│  │  │  │  ├─ InspectorManagment/
│  │  │  │  │  └─ components/
│  │  │  │  └─ UserManagement/
│  │  │  ├─ AnimatedContent.tsx
│  │  │  ├─ AvailabilityPicker.tsx
│  │  │  ├─ BackButton.tsx
│  │  │  ├─ columnHeader.tsx
│  │  │  ├─ Comingsoon.tsx
│  │  │  ├─ common/
│  │  │  │  ├─ AboutUs/
│  │  │  │  ├─ Contact/
│  │  │  │  ├─ FAQ/
│  │  │  │  ├─ Footer/
│  │  │  │  ├─ hero/
│  │  │  │  └─ PasswordManagment/
│  │  │  ├─ content-section.tsx
│  │  │  ├─ fancy-multi-select.tsx
│  │  │  ├─ InspectionTypeCard.tsx
│  │  │  ├─ inspector/
│  │  │  │  ├─ InspectionDetailsDialog.tsx
│  │  │  │  ├─ InspectorDashBoard/
│  │  │  │  │  ├─ components/
│  │  │  │  │  └─ layout/
│  │  │  │  ├─ InspectorSettings/
│  │  │  │  │  ├─ AddressManagement/
│  │  │  │  │  ├─ DocumentManagment/
│  │  │  │  │  └─ SlotManagment/
│  │  │  │  ├─ payment-stats.tsx
│  │  │  │  ├─ transaction-history.tsx
│  │  │  │  └─ upcoming-earnings.tsx
│  │  │  ├─ LoadingSpinner.tsx
│  │  │  ├─ login-form.tsx
│  │  │  ├─ OTPComponent.tsx
│  │  │  ├─ Pagination.tsx
│  │  │  ├─ PasswordManagment/
│  │  │  │  └─ index.tsx
│  │  │  ├─ ProfileDrop.tsx
│  │  │  ├─ ProfileDropDown.tsx
│  │  │  ├─ side-nav.tsx
│  │  │  ├─ SplitText.tsx
│  │  │  ├─ SpotlightCard.tsx
│  │  │  ├─ StripePaymentWrapper.tsx
│  │  │  ├─ SvgText.tsx
│  │  │  ├─ team-switcher.tsx
│  │  │  ├─ Toaster.tsx
│  │  │  ├─ ToolTip.tsx
│  │  │  ├─ ui/
│  │  │  │  ├─ alert-dialog.tsx
│  │  │  │  ├─ alert.tsx
│  │  │  │  ├─ aspect-ratio.tsx
│  │  │  │  ├─ avatar.tsx
│  │  │  │  ├─ badge.tsx
│  │  │  │  ├─ breadcrumb.tsx
│  │  │  │  ├─ button.tsx
│  │  │  │  ├─ calendar.tsx
│  │  │  │  ├─ card.tsx
│  │  │  │  ├─ checkbox.tsx
│  │  │  │  ├─ command.tsx
│  │  │  │  ├─ DarkModeSwitch.tsx
│  │  │  │  ├─ dialog.tsx
│  │  │  │  ├─ drawer.tsx
│  │  │  │  ├─ dropdown-menu.tsx
│  │  │  │  ├─ file-upload.tsx
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ input-otp.tsx
│  │  │  │  ├─ input.tsx
│  │  │  │  ├─ label.tsx
│  │  │  │  ├─ location-input.tsx
│  │  │  │  ├─ LongText.tsx
│  │  │  │  ├─ multi-select.tsx
│  │  │  │  ├─ navigation-menu.tsx
│  │  │  │  ├─ password-input.tsx
│  │  │  │  ├─ phone-input.tsx
│  │  │  │  ├─ popover.tsx
│  │  │  │  ├─ progress.tsx
│  │  │  │  ├─ radio-group.tsx
│  │  │  │  ├─ scroll-area.tsx
│  │  │  │  ├─ select.tsx
│  │  │  │  ├─ separator.tsx
│  │  │  │  ├─ sheet.tsx
│  │  │  │  ├─ sidebar.tsx
│  │  │  │  ├─ skeleton.tsx
│  │  │  │  ├─ switch.tsx
│  │  │  │  ├─ table.tsx
│  │  │  │  ├─ tabs.tsx
│  │  │  │  ├─ tags-input.tsx
│  │  │  │  ├─ textarea.tsx
│  │  │  │  ├─ theme-provider.tsx
│  │  │  │  ├─ toggle-group.tsx
│  │  │  │  ├─ toggle.tsx
│  │  │  │  └─ tooltip.tsx
│  │  │  ├─ user/
│  │  │  │  ├─ navbar/
│  │  │  │  └─ UserDashboard/
│  │  │  │     ├─ dashboard/
│  │  │  │     ├─ InspectionManagement/
│  │  │  │     │  └─ components/
│  │  │  │     │     └─ steps/
│  │  │  │     ├─ PaymentHistory/
│  │  │  │     ├─ profile/
│  │  │  │     └─ VehicleManagment/
│  │  │  │        └─ components/
│  │  │  └─ VehicleDetailsCard.tsx
│  │  ├─ data/
│  │  │  ├─ countries.json
│  │  │  └─ states.json
│  │  ├─ features/
│  │  │  ├─ admin/
│  │  │  │  └─ adminSlice.ts
│  │  │  ├─ auth/
│  │  │  │  ├─ authAPI.ts
│  │  │  │  └─ authSlice.ts
│  │  │  ├─ inspection/
│  │  │  │  ├─ inspectionSlice.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ inspector/
│  │  │  │  └─ inspectorSlice.ts
│  │  │  ├─ payments/
│  │  │  │  ├─ paymentSlice.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ user/
│  │  │  │  └─ userSlice.ts
│  │  │  └─ vehicle/
│  │  │     └─ vehicleSlice.ts
│  │  ├─ hooks/
│  │  │  ├─ use-mobile.tsx
│  │  │  ├─ useDebounce.tsx
│  │  │  ├─ useInspectorDetails.tsx
│  │  │  └─ useUserDetails.tsx
│  │  ├─ index.css
│  │  ├─ lib/
│  │  │  └─ utils.ts
│  │  ├─ main.tsx
│  │  ├─ pages/
│  │  │  ├─ admin/
│  │  │  │  ├─ AdminDashboard.tsx
│  │  │  │  ├─ AdminLoginPage.tsx
│  │  │  │  ├─ InspectorMangement.tsx
│  │  │  │  └─ UserManagement.tsx
│  │  │  ├─ common/
│  │  │  │  ├─ BlockedAccount.tsx
│  │  │  │  ├─ ContactPage.tsx
│  │  │  │  ├─ FAQPage.tsx
│  │  │  │  ├─ HomePage.tsx
│  │  │  │  └─ SupportPage.tsx
│  │  │  ├─ inspector/
│  │  │  │  ├─ DataRegisteration.tsx
│  │  │  │  ├─ EarningsOverview.tsx
│  │  │  │  ├─ InspectionsAssigned.tsx
│  │  │  │  ├─ InspectorDashboard.tsx
│  │  │  │  ├─ InspectorLoginPage.tsx
│  │  │  │  ├─ InspectorProfile.tsx
│  │  │  │  ├─ InspectorRegister.tsx
│  │  │  │  └─ VerifyOTP.tsx
│  │  │  ├─ payment/
│  │  │  │  ├─ failure.tsx
│  │  │  │  └─ success.tsx
│  │  │  └─ user/
│  │  │     ├─ ForgetPasswordPreview.tsx
│  │  │     ├─ GoogleButton.tsx
│  │  │     ├─ ResetPassword.tsx
│  │  │     ├─ UserDashboard.tsx
│  │  │     ├─ UserInputOTP.tsx
│  │  │     ├─ UserLoginPage.tsx
│  │  │     └─ UserRegister.tsx
│  │  ├─ provider/
│  │  │  └─ confirm-dialog-provider.tsx
│  │  ├─ routes/
│  │  │  ├─ AdminRoutes.tsx
│  │  │  ├─ IndexRoutes.tsx
│  │  │  ├─ InspectorRoutes.tsx
│  │  │  ├─ ProtectedRoute/
│  │  │  │  ├─ guards.ts
│  │  │  │  ├─ index.tsx
│  │  │  │  └─ types.ts
│  │  │  ├─ PublicRoutes.tsx
│  │  │  └─ UserRoutes.tsx
│  │  ├─ services/
│  │  │  ├─ admin.service.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ inspection.service.ts
│  │  │  ├─ inspector.service.ts
│  │  │  ├─ payment.service.ts
│  │  │  └─ user.service.ts
│  │  ├─ store/
│  │  │  └─ index.ts
│  │  ├─ types/
│  │  │  ├─ admin.d.ts
│  │  │  ├─ auth.d.ts
│  │  │  ├─ AvaliblePicker.d.ts
│  │  │  ├─ inspector.d.ts
│  │  │  └─ user.d.ts
│  │  ├─ utils/
│  │  │  ├─ cloudinary.ts
│  │  │  └─ uploadToCloudinary.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ package-lock.json
├─ package.json
└─ README.md

```



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
