<div align="center">
  <h1>🧠 CodeSync</h1>
  <p>A Powerful Real-Time Collaborative Code Editor & Execution Environment</p>
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://codesync-ai.vercel.app/)
  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-black.svg)](https://socket.io/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
</div>

<br />

## 📖 Overview

CodeSync is a modern, web-based collaborative code editor designed to bring developers together. Built with the robust MERN stack, it enables seamless real-time coding, instant code execution across multiple languages, and AI-powered coding assistance—all within a secure, responsive, and aesthetically pleasing interface.

## ✨ Key Features

- **💻 Real-Time Collaboration**: Code simultaneously with your team using robust WebSocket connections (`Socket.IO`). Cursor positions, code edits, and input changes are synced instantly across all users in a room.
- **⚡ Live Code Execution**: Powered by the [Piston API](https://github.com/engineer-man/piston), securely execute code directly from the browser. Supports **JavaScript (Node.js)**, **Python**, **C++**, and **Java**.
- **🤖 AI Assistant Integration**: Integrated with the Hugging Face Inference API to provide intelligent code suggestions, bug fixes, and optimization tips right when you need them.
- **🎨 Advanced Editor Features**: Powered by Monaco Editor (`@monaco-editor/react`), providing a desktop-grade editing experience with syntax highlighting, auto-completion, and multiple themes (Light, VS Dark, High Contrast).
- **🔐 Secure Authentication**: Integrated user authentication and management powered by [Clerk](https://clerk.com/).
- **📱 Responsive & Interactive UI**: Built with Tailwind CSS, Framer Motion for smooth animations, and `react-rnd` for draggable/resizable floating windows.

## 🏗️ Architecture & Tech Stack

### Frontend (Client)
- **Core**: React 19, Vite, React Router DOM
- **Styling & UI**: Tailwind CSS, Headless UI, Radix UI, Framer Motion, Lucide React
- **Editor**: Monaco Editor (`@monaco-editor/react`), Shiki Syntax Highlighter
- **State & Real-time**: Socket.IO Client, Axios for API calls
- **Auth**: Clerk React SDK

### Backend (Server)
- **Core**: Node.js, Express.js
- **Real-time**: Socket.IO with connection state recovery
- **In-Memory Storage**: Custom RoomManager for managing concurrent collaboration rooms
- **External APIs**: 
  - Hugging Face Inference API (`@huggingface/inference`)
  - Piston Execution Engine

## 📂 Project Structure

```text
codesync/
├── client/                 # Frontend React Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, icons, etc.
│   │   ├── components/     # Reusable UI components (Editor, Chat, etc.)
│   │   ├── pages/          # Route components (Home, Room, etc.)
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                 # Backend Node.js Server
│   ├── inMemorydb/         # In-memory storage logic
│   │   └── roomManager.js  # Manages active sessions and states
│   ├── routes/             # Express API routes
│   │   ├── session.js      # Session handling endpoints
│   │   └── suggestions.js  # AI suggestion endpoints
│   ├── server.js           # Main server entry & Socket.IO config
│   └── package.json
└── README.md
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`, `yarn`, or `pnpm`

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/codesync.git
cd codesync
```

### 2️⃣ Backend Setup (Server)

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following keys:

```env
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

Start the server:

```bash
# Development mode (with nodemon)
npm run server

# Production mode
npm start
```
*The backend should now be running on `http://localhost:5000`.*

### 3️⃣ Frontend Setup (Client)

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory and add the following keys:

```env
VITE_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

Start the Vite development server:

```bash
npm run dev
```
*The frontend should now be running on `http://localhost:5173`.*

## 🔑 Environment Variables Reference

### Client (`client/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_BASE_URL` | URL of your backend server (e.g., `http://localhost:5000`). |
| `VITE_CLERK_PUBLISHABLE_KEY` | Public publishable key from your Clerk dashboard. |

### Server (`server/.env`)
| Variable | Description |
| :--- | :--- |
| `PORT` | Port for the backend server (default: `5000`). |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins for CORS (e.g., `http://localhost:5173`). |
| `HUGGINGFACE_API_KEY` | API Key for accessing the Hugging Face Inference API for AI suggestions. |

## 🤝 Contributing

We welcome contributions! Please follow these steps to contribute:

1. **Fork** the repository.
2. **Create a branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request** describing your changes.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

<div align="center">
  <br />
  <i>Built with ❤️ by the CodeSync Team</i>
</div>
