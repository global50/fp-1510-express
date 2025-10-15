# Backend Server

Express.js backend server for the business social network application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (already set in `.env`):
```
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Profile API

#### Fetch Profile by Username
- **POST** `/api/profile/fetch-by-username`
- Body: `{ "username": "john_doe" }`
- Returns: `{ "profile": {...} }` or `{ "profile": null }` if not found

## Architecture

- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **CORS**: Enabled for all origins (configure for production)

## Security

- Uses Supabase anon key for public profile access
- Input validation for all endpoints
- RLS (Row Level Security) enforced at database level
- CORS configured with proper headers

## Project Structure

```
server/
├── src/
│   ├── routes/
│   │   └── profile.js       # Profile-related routes
│   └── index.js             # Main server file
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Current Implementation Status

### Converted Functions (Express Routes)
- ✅ `fetch-profile-by-username` → `/api/profile/fetch-by-username`

### Remaining Edge Functions (To be migrated)
- `generate-auth-state`
- `get-auth-session`
- `process-platform-auth`
- `delete-auth-state`
- `update-profile`
- `update-profile-locations`
- `fetch-additional-profile-data`
- `fetch-reference-lists`
- `fetch-auth-profile`
- `settings`

## Testing

Test the profile fetch endpoint:

```bash
curl -X POST http://localhost:3001/api/profile/fetch-by-username \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user"}'
```

## Next Steps

1. Start the server: `npm run dev`
2. Test profile page loading with the new API
3. Monitor console logs for debugging
4. Once verified, migrate remaining edge functions
