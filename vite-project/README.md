# Messy Chat Application

This repository contains the **Messy Chat Application**, which includes both the **server** and **client** codebases. Follow the instructions below to set up and run the application.

---

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v16 or later) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- ***

## Project Structure

The project is organized as follows:

```
vite-project/
├── client/       # Frontend code
├── server/       # Backend code
└── README.md     # Project documentation
```

---

## Setting Up the Server

### 1. Navigate to the Server Directory

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory and add the following variables:

```
PORT=9001
JWT_SECRET="asfasfsafasf2841294u128"
ORIGIN="http://localhost:5173"
DATABASE_URL="MongoUri"
GROQ_API_KEY="Your Groq Key"
```

Replace `<your-mongodb-connection-string>` with your MongoDB connection string.

### 4. Start the Server

```bash
npm start
```

The server should now be running on `http://localhost:9001`.

---

## Setting Up the Client

### 1. Navigate to the Client Directory

```bash
cd client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Client

```bash
npm run dev
```

The client should now be running on `http://localhost:5173`.

---

## Running the Application

1. Start the server as described in the **Setting Up the Server** section.
2. Start the client as described in the **Setting Up the Client** section.
3. Open your browser and navigate to `http://localhost:5173` to use the application.

---
