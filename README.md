
# Super Shuffler: Intelligent Playlist Randomizer

Super Shuffler is a full-stack application built to provide a powerful, customized, and persistent way to shuffle and manage music playlists. Unlike standard streaming platform shuffles that often repeat tracks or artists too closely, this application implements a custom Fisher-Yates shuffle algorithm on the backend to guarantee truly random order.

## Features

* **User Authentication:** Secure user registration and login using JWT (FastAPI).
* **Playlist Management:** Users can add and view tracks (stored in PostgreSQL).
* **True Random Shuffle:** A dedicated backend endpoint executes the Fisher-Yates shuffle algorithm, updating track positions in the database.
* **Real-time Updates:** Frontend automatically reloads the playlist to display the new order after shuffling.
* **Scalable Architecture:** Ready for future integration with external APIs (e.g., Spotify) to sync real-world playlists.

## Tech Stack

This project leverages a modern, containerized technology stack:

| **Component**        | **Technology**    | **Role**                                                                  |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------- |
| **Frontend**         | Angular                 | UI/UX, Component-based architecture, Forms, HTTP clients.                       |
| **Backend**          | FastAPI (Python)        | High-performance API, Authentication (JWT), Business Logic (Shuffle Algorithm). |
| **Database**         | PostgreSQL              | Robust relational database for persistent storage of users and tracks.          |
| **State Mgt.**       | RxJS / Angular Services | Reactive state management (replacing NGXS).                                     |
| **Containerization** | Docker & Docker Compose | Simplified local development, deployment, and service orchestration.            |

## Getting Started

These instructions will get your project up and running using Docker Compose.

### Prerequisites

You need to have Docker and Docker Compose installed on your system.

### 1. Project Structure

Ensure your project structure includes the necessary `Dockerfile` and `requirements.txt` files as specified in the previous setup steps:

```
my-project/
├── docker-compose.yml
├── .env
├── backend/
│   ├── Dockerfile
│   ├── main.py (FastAPI)
│   └── requirements.txt
└── frontend/
    ├── Dockerfile
    └── src/app/app.component.ts (Angular)

```

### 2. Configuration (`.env` file and `environment.development.ts`)

Create a `.env` file in the root directory to define your database credentials:

```
# Database Configuration
POSTGRES_USER=admin
POSTGRES_PASSWORD=secretpassword
POSTGRES_DB=playlist_db

```

### 3. Build and Run

Use Docker Compose to build the images and launch the three services (Backend, Frontend, DB):

```
docker-compose up --build

```

Wait a few moments for the Postgres database and FastAPI server to initialize.

### 4. Access the Application

Once all services are running:

* **Frontend (App):** Open your browser and navigate to `http://localhost:4200`
* **Backend (API Docs):** View the interactive OpenAPI documentation at `http://localhost:8000/docs`

### Usage

1. **Register / Login:** Create a new user account or log in.
2. **Add Tracks:** Use the form to add songs (Artist and Song Title). These are stored in the database.
3. **Shuffle:** Click the **SHUFFLE** button. The FastAPI backend executes the randomizing algorithm and updates the position of all tracks in the database.
4. **View Results:** The frontend automatically refreshes, displaying the new, shuffled order.

## Security Note

The current backend implementation uses a placeholder `SECRET_KEY` in `main.py`. For production use, this key **must** be moved to an environment variable (`.env` or similar) for security.
