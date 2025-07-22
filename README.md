# My Music Backend

A Node.js/Express backend API for a music playlist application with user authentication and playlist management.

## Features

- User authentication with JWT
- Create, read, update, delete playlists
- Add/remove songs from playlists
- Automatic playlist image generation from song covers
- MongoDB integration with Mongoose

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Local Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-music-be
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   - Copy `.env.example` to `.env`

   ```bash
   cp .env.example .env
   ```

   - Fill in the environment variables:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/my-music-db
   JWT_SECRET=your-super-secret-jwt-key
   SPOTIFY_CLIENT_ID=your-spotify-client-id
   SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
   SPOTIFY_REFRESH_TOKEN=your-spotify-refresh-token
   ```

4. **Start MongoDB**

   - If using local MongoDB:

   ```bash
   mongod
   ```

   - Or use MongoDB Atlas connection string in `MONGO_URI`

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Server will start on**
   ```
   http://localhost:5000
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Playlists (Protected Routes)

- `GET /api/playlist` - Get user's playlists
- `GET /api/playlist/:id` - Get playlist by ID
- `POST /api/playlist/create` - Create new playlist
- `PATCH /api/playlist/update/:id` - Update playlist (add songs)
- `DELETE /api/playlist/:id` - Delete playlist
- `DELETE /api/playlist/:id/song/:songId` - Remove song from playlist

### Songs (Protected Routes)

- `GET /api/songs` - Get songs
- `POST /api/songs/search` - Search songs via Spotify API

### Spotify Integration

- `GET /api/auth/generate-spotify-token` - Generate Spotify access token

## Project Structure

```
src/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (auth)
├── models/         # Mongoose models
├── routes/         # API routes
└── server.ts       # Main server file
```

## Development

- The server uses `nodemon` for auto-restart during development
- TypeScript files are compiled on-the-fly using `ts-node`
- CORS is configured for frontend running on `http://localhost:5173`

## Environment Variables

| Variable                | Description               | Example                                 |
| ----------------------- | ------------------------- | --------------------------------------- |
| `PORT`                  | Server port               | `5000`                                  |
| `MONGO_URI`             | MongoDB connection string | `mongodb://localhost:27017/my-music-db` |
| `JWT_SECRET`            | Secret key for JWT tokens | `your-secret-key`                       |
| `SPOTIFY_CLIENT_ID`     | Spotify app client ID     | `your-spotify-client-id`                |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret | `your-spotify-client-secret`            |
| `SPOTIFY_REFRESH_TOKEN` | Spotify refresh token     | `your-spotify-refresh-token`            |
