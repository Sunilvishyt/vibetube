# 📺 VibeTube

VibeTube is a modern yet simple, full-stack video sharing platform built with a high-performance **FastAPI** backend and a sleek **React** frontend. It allows users to upload, view, and interact with videos in a seamless, responsive interface.

---

## ✨ Features

- **Authentication:** Secure user system using JWT (Register, Login, Logout).
- **Media Management:** Video upload, storage, and streaming playback.
- **Social Interaction:** Like, comment, and subscription functionality.
- **Personalization:** User profiles, history tracking, and avatar management.
- **Discovery:** Search functionality, trending pages, and "Liked Videos" library.
- **UI/UX:** Responsive design with **Dark/Light theme** toggle via Shadcn UI.

---

## 🛠️ Tech Stack

| Layer          | Technologies                         |
| :------------- | :----------------------------------- |
| **Backend**    | FastAPI, SQLAlchemy, Pydantic, JWT   |
| **Frontend**   | React, Vite, Shadcn UI, Tailwind CSS |
| **Database**   | PostgreSQL                           |
| **Processing** | FFmpeg                               |

---

## 📸 Screenshots

<h3>Homepage light mode</h3>
<img src="./screenshots/homepage light mode.png" alt="Main Page" width="600">
<h3>Homepage dark mode</h3>
<img src="./screenshots/darkmode.png" alt="Main Page" width="600">
<h3>Watch page</h3>
<img src="./screenshots/watchpage.png" alt="Main Page" width="600">
<h3>Profile page</h3>
<img src="./screenshots/profilepage.png" alt="Main Page" width="600">
<h3>Video upload</h3>
<img src="./screenshots/upload page.png" alt="Main Page" width="250">

---

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Python 3.13+**
- **Node.js** (LTS version)
- **FFmpeg** (Required for video processing)
  - **Windows:** `winget install ffmpeg`
  - **macOS:** `brew install ffmpeg`

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/sunilvishyt/vibetube.git
cd vibetube
```

### 2. Backend Setup (FastAPI)

#### 1. Navigate to the backend folder:

```sh
cd vibetube_backend
```

#### 2. Create and activate a virtual environment:

```sh
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### 3. Install dependencies:

```sh
pip install .
```

#### 4. Configure Environment Variables:

Create a .env file inside the vibetube_backend folder and add the following:

```sh
DATABASE_URL=postgresql://user:password@localhost:5432/vibetube
SECRET_KEY="anyrandomstring"
ALGORITHM=HS256
SUPABASE_URL=
SUPABASE_KEY=
FRONTEND_URL=optional
```

#### 5. Set up Storage Directories:

Inside vibetube_backend/app, create a storage folder with the following subdirectories:

```sh
mkdir -p app/storage/thumbnails app/storage/videos app/storage/avatars
```

should look like this -

```sh
vibetube_backend/
└── app/
    └── storage/
        ├── avatars/
        ├── thumbnails/
        └── videos/
```

#### 6. Initialize the Database:

```sh
python -m app.init_db
```

#### 7. Start the Server:

```sh
uvicorn app.main:app --reload
```

---

### 3. Frontend Setup (React)

##### 1. Navigate to the frontend folder:

```sh
cd ../vibetube_frontend
```

##### 2. Configure Environment Variables:

Create a .env file inside the frontend folder and add the following:

```sh
VITE_API_BASE_URL=http://localhost:8000
```

##### 3. Install dependencies:

```sh
npm install
```

##### 4. Start the development server:

```sh
npm run dev
```

---

## 📂 Project Structure

```sh
vibetube_backend/
├── app/
│   ├── storage/          # Local media storage
│   │   ├── avatars/
│   │   ├── thumbnails/
│   │   └── videos/
│   └── init_db.py        # DB Initialization script
├── .env                  # Secrets & Config
└── pyproject.toml

vibetube_frontend/
├── src/
│   ├── components/       # Shadcn & Custom UI components
│   ├── pages/            # History, Watch, Upload, etc.
│   ├── App.jsx           # Main routing
│   └── main.jsx
├── package.json
├── .env
└── vite.config.js
```

---

## 🗄️ Database Models

- **Users:** Profiles, credentials, and avatar links.
- **Videos:** Metadata, file paths, and ownership.
- **Social:** Likes, Comments, and Subscriptions.
- **Analytics:** View tracking and User History.

---

## 🤝 Contribution Guidelines

1. Fork the repository and create your branch: git checkout -b feature/your-feature

2. Commit your changes: git commit -m "Add your feature"

3. Push to your fork: git push origin feature/your-feature

4. Open a Pull Request describing your changes.

For questions or support, please open an issue.
