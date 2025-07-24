<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

### **Real-Time Chat Application**

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

This project is a **real-time chat application** developed using **NestJS** and **Socket.IO**. It supports features like creating rooms, joining rooms, sending and receiving messages, and managing connections. The application includes integration with Google Login or email-based authentication.

---

## **Features**

### **Real-Time Communication**
- **WebSocket-based** real-time communication powered by **Socket.IO**.
- Users can join rooms, send messages, and leave rooms with immediate updates.

### **Room Management**
- Create and manage chat rooms dynamically.
- Rooms are automatically cleaned up when empty.

### **Authentication**
- Google Login or email-based login for user authentication.
- Validates users before allowing them to join or create rooms.

### **Message Handling**
- Users can send and receive messages in real-time.
- Messages are stored and can be retrieved by room.

### **Admin Monitoring**
- Integrated with the **Socket.IO Admin UI** for monitoring WebSocket events and debugging during development.

---

## **Installation**

### **1. Clone the Repository**
```bash
git clone https://github.com/diaaqassem/Real-Time-Chat-Application.git
cd Real-Time-Chat-Application
```

### **2. Install Dependencies**
Ensure you have **Node.js** (v16 or above) and **npm** installed.
```bash
npm install
```

### **3. Environment Variables**
Create a `.env` file in the root directory and configure the following:
```env
PORT=5000
APP_URL = 'http://localhost:5000/api'
DB_URL=<your-mongodb-connection-string>
SECRET_KEY=<your-jwt-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_SECRET=<your-google-client-secret>
ivLength=16
```

### **4. Start the Application**
```bash
npm run start:dev
```

---

## **Endpoints**

### **Socket.IO Events**
| **Event Name**       | **Description**                                      | **Payload**                    |
|-----------------------|------------------------------------------------------|--------------------------------|
| `Create_Room`         | Creates a new chat room.                             | `{ userID, name }`            |
| `Join_Room`           | Joins a user to an existing room.                    | `{ userID, roomID }`          |
| `Send_Message`        | Sends a message to a room.                           | `{ content, userID, roomID }` |
| `Leave_Room`          | Removes a user from a room.                          | `{ userID, roomID }`          |
| `Get_Messages`        | Retrieves all messages from a specific room.         | `{ roomID, userID }`          |

---

## **Technology Stack**
- **Backend Framework**: NestJS
- **WebSocket**: Socket.IO
- **Database**: MongoDB
- **Authentication**: Google OAuth, Session
- **Language**: TypeScript

---

## **Setup for Development**

### **Enable Socket.IO Admin Panel**
To enable the admin UI for monitoring events, visit `https://admin.socket.io` and connect to:
```text
http://localhost:5001
```

### **Database**
Ensure MongoDB is running locally or use a cloud database (e.g., MongoDB Atlas).

---


---

## **Usage Instructions**

1. **Login with Google** or **Email** to authenticate the user.
2. **Create or Join a Room** to start a conversation.
3. Use **real-time messaging** to chat with other users in the room.
4. **Monitor rooms and messages** via the admin panel.

---

## **Some Features**
- Improve error handling and logging.
- Implement room permissions.
- Add user notifications for other users joined room or leave room.

---

