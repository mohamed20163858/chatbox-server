# Chatbox Server - Authentication & Real-time Messaging Backend

## Overview
The Chatbox Server is the backend service powering the Chatbox real-time messaging app. It handles authentication, message storage, WebSocket connections, and database interactions.

## Features
- **Authentication:** Uses [Auth.js](https://authjs.dev/) for authentication with providers like Google, GitHub, and email/password.
- **User Management:** Secure user registration, login, and session handling.
- **Resting password using forgot-password functionality:** enable users who forgot their passwords to use this functionality to reset their passwords by sending an email to their registered emails with a specific link for each user to enable each one to reset his password
- **Database Management:** Uses MongoDB with Mongoose for data storage.
- **REST API:** Provides structured API endpoints for frontend communication.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:**  OAuth, JWT
- **Database:** MongoDB (Mongoose ORM)
- **Deployment:** Hosted on Vercel

## Installation
### **1. Clone the repository**
```sh
git clone https://github.com/mohamed20163858/chatbox-serve
cd chatbox-server
```

### **2. Install dependencies**
```sh
npm install
```

### **3. Setup environment variables**
Create a `.env` file and configure:
```env
PORT= your_port # 5000 for example
MONGODB_URI=your_mongodb_uri
SECRET=your_secret
JWT_SECRET= your_jwt_secret
FRONTEND_URL= your_frontend_url
# you can use for example a google security app to create app password that will generate a password for u to use to send automatic emails
EMAIL_USER= your_email_to_use_in_nodemailer
EMAIL_PASSWORD= your_google_generated_app_password_to_use_in_nodemailer
```

### **4. Start the server**
```sh
npm start
```

## API Endpoints
### **Authentication**
- `POST /api/user/signup` - Register a new user
- `POST /api/user/login` - User login
- `POST /api/user/forgot-password` - Generate a token that using in generate active link embedded in mailer body to redirect user to his specific link to enable him reset his password
- `POST /api/user/reset-password`  -  Reset User password
- `POST /api/user/check`  -  when using OAuth services it check if user email exist in our database or not , if it is it authenticate him, otherwise it will not allow him pass 


## Future Enhancements
- **Real-time Messaging:** Implemented using `socket.io` for instant communication.
- **User Profile Management**
- **Group Chat Functionality**
- **End-to-End Encryption**
- **Push Notifications**

## Contribution
If you'd like to contribute, feel free to fork the repo and submit a pull request!

---

This server is part of the Chatbox project and is included in my CV as a demonstration of implementing authentication and real-time communication using modern web technologies.

