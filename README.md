# 🧠 CodeSync - Collaborative Code Editor

CodeSync is a real-time collaborative code editor built with the MERN stack. It empowers developers to code together in real-time, supports multiple programming languages, offers instant code execution, and includes an AI assistant for code optimization.

## 🔗 Live Demo

[**codesync-ai.vercel.app**](https://codesync-ai.vercel.app/)

---

## ✨ Features

- **💻 Real-time Collaboration:** Code with others in real-time using Socket.IO. See cursor positions and edits instantly.
- **🎨 Multi-Language Support:** Syntax highlighting and execution for **JavaScript, Python, C++, and Java**.
- **⚡ Live Code Execution:** Run code directly in the browser using the Piston API.
- **🤖 AI Assistant:** Get code suggestions, optimizations, and bug fixes powered by Hugging Face AI.
- **🌗 Themes:** Choose between Light, VS Dark, and High Contrast Black themes.
- **🔐 Secure Authentication:** User authentication powered by Clerk.
- **📱 Responsive Design:** Modern UI built with Tailwind CSS, compatible with various screen sizes.
- **📂 File Handling:** Create, edit, and manage code files securely.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`)
- **Real-time:** [Socket.IO Client](https://socket.io/)
- **Auth:** [Clerk](https://clerk.com/)
- **UI Components:** [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/), [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Real-time:** [Socket.IO](https://socket.io/)
- **AI Integration:** Hugging Face Inference API
- **Code Execution:** [Piston API](https://github.com/engineer-man/piston)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- **Node.js**: v18 or higher recommended.
- **npm** or **yarn**: Package manager.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/codesync.git
cd codesync
```

### 2️⃣ Server Setup

Open a terminal and navigate to the server directory.

```bash
cd server
npm install
```

**Create a `.env` file in the `server` directory:**

```env
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

**Start the Server:**

```bash
# Development mode (with nodemon)
npm run server

# OR Production start
npm start
```
The server will run on `http://localhost:5000`.

### 3️⃣ Client Setup

Open a new terminal and navigate to the client directory.

```bash
cd ..
cd client
npm install
```

**Create a `.env` file in the `client` directory:**

```env
VITE_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

**Start the Client:**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Client (`client/.env`)

| Variable | Description |
| :--- | :--- |
| `VITE_BASE_URL` | URL of the backend server (e.g., `http://localhost:5000`). |
| `VITE_CLERK_PUBLISHABLE_KEY` | Public key from your Clerk dashboard. |

### Server (`server/.env`)

| Variable | Description |
| :--- | :--- |
| `PORT` | Port for the backend server (default: `5000`). |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins (e.g., `http://localhost:5173`). |
| `HUGGINGFACE_API_KEY` | API Key for the Hugging Face Inference API. |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch: `git checkout -b feature/AmazingFeature`.
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`.
4. Push to the branch: `git push origin feature/AmazingFeature`.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
