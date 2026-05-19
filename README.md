# Innerwave

Innerwave is a Next.js music discovery app that uses Deezer data and MongoDB-backed user playlists. It provides search, discover, dynamic song pages, and playlist management with authentication.

## Features

- Search for songs and artists
- Dynamic song detail pages at `/[songId]`
- Save/remove songs to a personal playlist
- User authentication with JWT and MongoDB
- Server-side Deezer proxy routes to avoid browser CORS issues
- Embedded Deezer iframe player on song detail pages

## Project Structure

- `src/app/` — App Router pages, layouts, and API routes
- `src/components/` — Shared UI components like `SideBar` and `TopBar`
- `src/context/` — `AuthContext` provider for user state
- `src/lib/` — MongoDB and JWT helper utilities
- `src/models/` — Mongoose schemas

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root with the following values:

```env
MONGODB_URI="your-mongodb-connection-string"
JWT_SECRET="your-jwt-secret"
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser at:

```bash
http://localhost:3000
```

## Available Scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — build the production app
- `npm run start` — run the production server after build
- `npm run lint` — run ESLint

## API Routes

- `GET /api/search?q=...` — search tracks via Deezer proxy
- `GET /api/songs?q=...&limit=...` — fetch track lists used in home/discover pages
- `GET /api/track/[songId]` — fetch a specific track by ID
- `GET /api/playlist` — get current user playlist
- `POST /api/playlist` — add a track to playlist
- `DELETE /api/playlist?trackId=...` — remove a track from playlist

## Environment Variables

- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret key for JWT token signing

## Notes

- The app uses server-side proxy routing for Deezer API requests to avoid CORS failures.
- If the local development server reports port `3000` is in use, stop the existing process or change the port.
- No Deezer API key is required for the public endpoints used here.

## Troubleshooting

- Ensure MongoDB is running and reachable from `MONGODB_URI`
- Restart the dev server after changing `.env.local`
- If playlist actions fail, confirm user authentication is working and the JWT cookie is present
