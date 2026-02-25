# 🚗 Inspecto – Your Trusted Vehicle Inspection Platform

Inspecto is a vehicle inspection marketplace platform that connects vehicle owners with certified inspectors. The system facilitates the complete inspection lifecycle: booking, payment processing, inspection execution, report generation, and post-inspection reviews. The platform operates as a three-sided marketplace with distinct interfaces and workflows for Users (vehicle owners), Inspectors (service providers), and Admins (platform managers).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Security](#security)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [Contact](#contact)
- [Roadmap](#roadmap)
- [License](#license)

## Features

### For Users
- **Secure Registration & Login**
- **Vehicle Management**: add, edit, and delete vehicles
- **Book Inspections** with certified professionals
- **Access, Download & Share Reports**
- **Direct Messaging with Inspectors**

### For Inspectors
- **Verification Workflow & Onboarding**
- **Manage Inspection Requests**
- **Upload Inspection Reports**
- **Grow Your Customer Base**

### For Admins
- **Manage Users & Inspectors**
- **Monitor Inspections & Reports**
- **Analytics Dashboard**

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Redux Toolkit, Axios
- **Backend**: Node.js, Express.js, MongoDB, Socket.io (real-time), JWT authentication
- **File Storage**: Cloudinary

## Screenshots

| Screenshot 1 | Screenshot 2 |
|--------------|--------------|
| ![Screenshot 1](https://i.postimg.cc/zV09N1YQ/Inspecto-1-35pm-08-28.jpg) | ![Screenshot 2](https://i.postimg.cc/hfSHNt6x/Inspecto-1-36pm-08-28.jpg) |

| Screenshot 3 | Screenshot 4 |
|--------------|--------------|
| ![Screenshot 3](https://i.postimg.cc/dh3gtSqV/Inspecto-1-37pm-08-28.jpg) | ![Screenshot 4](https://i.postimg.cc/gw653XL9/Inspecto-1-38pm-08-28.jpg) |

| Screenshot 5 | Screenshot 6 |
|--------------|--------------|
| ![Screenshot 5](https://i.postimg.cc/jD1mWQ5Q/Inspecto-1-38pm-08-28-1.jpg) | ![Screenshot 6](https://i.postimg.cc/tZQckqFs/Inspecto-1-39pm-08-28.jpg) |

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Clone & Install
```bash
git clone https://github.com/square-story/Inspecto.git
cd Inspecto
```

#### Backend
```bash
cd backend
npm install
cp .env.example .env # Configure your .env variables
npm run dev:backend
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env # Configure your .env variables
npm run dev
```

### Test Setup
Manual and automated test instructions go here.

## Project Structure
```
Inspecto/
  backend/
    src/
      ...
  frontend/
    src/
      ...
  docker-compose.yml
  README.md
```

## Environment Variables
See `.env.example` files in both `backend` and `frontend` folders for configuration variables including database URIs, Cloudinary keys, and JWT secrets.

## Security
- Role-based access (Admin, Inspector, User)
- Secure file uploads and cloud storage
- JWT-based authentication
- Input validation

## Folder Structure

```bash
Inspecto/
│
├── .github/
│   └── workflows/
│       └── deploy-backend-render.yml
│
├── backend/
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── jest.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── __tests__/
│       ├── config/
│       ├── controllers/
│       ├── core/
│       ├── di/
│       ├── dtos/
│       ├── middlewares/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── scripts/
│       ├── services/
│       ├── utils/
│       ├── app.ts
│       └── server.ts
│
├── frontend/
│   ├── .gitignore
│   ├── Dockerfile
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vercel.json
│   ├── vite.config.ts
│   ├── public/
│   │   └── favicon.ico
│   └── src/
│       ├── api/
│       ├── app/
│       ├── components/
│       ├── contexts/
│       ├── features/
│       ├── helper/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── provider/
│       ├── routes/
│       ├── services/
│       ├── store/
│       ├── types/
│       ├── utils/
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       └── vite-env.d.ts
│
├── .gitignore
├── README.md
├── docker-compose.yml
├── package-lock.json
└── package.json

```

## Contributing
We love contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) if available, otherwise:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/myFeature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to the branch (`git push origin feature/myFeature`)
5. Open a pull request with a clear description

## Contact
- Open an issue on GitHub for bug reports or feature requests
- Email: [sadik.build@gmail.com](mailto:sadik.build@gmail.com)
- Demo: [inspecto-flax.vercel.app](https://inspecto-flax.vercel.app/)

## Roadmap
- GPS-based real-time inspector tracking
- Advanced analytics for admins
- Dedicated Android/iOS mobile app

## License
[MIT License](LICENSE) (if applicable, clarify or add license file)
