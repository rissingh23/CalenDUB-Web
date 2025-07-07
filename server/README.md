# CalenDUB Server Setup Guide

This guide will help you set up Firebase Authentication and MongoDB Atlas for the CalenDUB server.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google account (for Firebase)
- MongoDB Atlas account (free tier available)

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the setup script**
   ```bash
   npm run setup
   ```

3. **Follow the instructions** provided by the setup script to configure Firebase and MongoDB

## Detailed Setup Instructions

### 1. Firebase Setup

#### Option A: Using Service Account File (Recommended for Development)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file and rename it to `serviceAccountKey.json`
6. Place the file in `server/firebase/serviceAccountKey.json`

#### Option B: Using Environment Variables (Recommended for Production)

1. Follow steps 1-4 from Option A
2. Open the downloaded JSON file and extract the values
3. Set the following environment variables in `.env.local`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-client-email%40your-project-id.iam.gserviceaccount.com
```

### 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier is sufficient)
4. Wait for cluster to be created (2-3 minutes)
5. Click **Connect** on your cluster
6. **Add your IP address** to the IP whitelist
7. **Create a database user** with read/write permissions
8. Choose **Connect your application**
9. Copy the connection string
10. Replace `<password>` with your database user password
11. Replace `<dbname>` with `calendub` (or your preferred database name)
12. Set the `MONGO_URI` environment variable in `.env.local`:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/calendub?retryWrites=true&w=majority
```

### 3. Environment Variables

Create a `.env.local` file in the server directory with the following variables:

```env
# MongoDB Atlas Configuration
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/calendub?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin SDK Configuration (if not using serviceAccountKey.json)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
```

## Running the Server

1. **Test your configuration**
   ```bash
   npm run setup
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
All protected endpoints require an `Authorization` header with a Firebase ID token:
```
Authorization: Bearer <firebase-id-token>
```

### Events
- `GET /api/events` - Get all events (public)
- `POST /api/events` - Create new event (protected)
- `GET /api/events/my-events` - Get events created by authenticated user (protected)

### Users
- `POST /api/users` - Create or authenticate user (protected)

### Organizers
- `GET /api/organizers` - Get all organizers (public)
- `POST /api/organizers` - Create new organizer (protected)

## Troubleshooting

### Firebase Issues
- **"Service account file not found"**: Make sure `serviceAccountKey.json` is in the correct location or set environment variables
- **"Invalid token"**: Check that the Firebase project is correctly configured and the token is valid
- **"Authentication failed"**: Verify that the Firebase Admin SDK is properly initialized

### MongoDB Issues
- **"MONGO_URI environment variable not set"**: Make sure `.env.local` file exists and contains the correct MongoDB connection string
- **"Connection failed"**: Check that your IP address is whitelisted in MongoDB Atlas
- **"Authentication failed"**: Verify that the database user credentials are correct

### General Issues
- **"Missing environment variables"**: Run `npm run setup` to check which variables are missing
- **"Port already in use"**: Change the `PORT` environment variable or stop the process using the port

## Security Notes

- Never commit `.env.local` or `serviceAccountKey.json` to version control
- Use environment variables in production
- Regularly rotate Firebase service account keys
- Use MongoDB Atlas IP whitelisting for additional security
- Always use HTTPS in production

## Development vs Production

### Development
- Use `serviceAccountKey.json` for Firebase (easier setup)
- Use `.env.local` for environment variables
- Run with `npm run dev` for auto-restart

### Production
- Use environment variables for Firebase (more secure)
- Set environment variables in your hosting platform
- Run with `npm start`
- Use a process manager like PM2 for production deployments 