# YouTube Live Streaming Manager

A web application built with Next.js for scheduling, managing, and monitoring YouTube Live broadcasts from a single dashboard.

---

## Features

- **4-Column Broadcast Grid**: Displays upcoming, live, and completed broadcasts in a 4-card-per-row layout with playable embedded YouTube players.
- **Direct Go Live & Stop Controls**: Transition broadcasts directly to `live` or `complete` with encoder status checks and confirmation modals.
- **Create Upcoming Streams**: Schedule new broadcasts with RTMP stream key selection or creation, privacy settings, latency preferences, DVR, playlists, and categories.
- **Studio Matrix**: View stream health, encoder connection status, concurrent viewers, total views, and RTMP details in a modal.
- **Multi-User Access**: Supports multiple operator accounts for dashboard access.
- **Dark & Light Mode**: Built-in theme switcher in the top navigation bar.

---

## Getting Started

### Prerequisites

- **Node.js** 18.17.0 or later
- **npm**

### Installation

```bash
git clone <your-repository-url>
cd <project-folder>
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root with your own OAuth credentials and configuration:

| Variable | Description |
|---|---|
| `YOUTUBE_CLIENT_ID` | Google Cloud OAuth 2.0 Client ID |
| `YOUTUBE_CLIENT_SECRET` | Google Cloud OAuth 2.0 Client Secret |
| `AUTH_SECRET` | Secret string used for session signing |
| `ADMIN_USERS_JSON` | Optional JSON array string to configure user accounts |

In Google Cloud Console, add your callback URL to **Authorized Redirect URIs**:
- Local: `http://localhost:3000/api/youtube/callback`
- Production: `https://<your-domain>/api/youtube/callback`

---

## Project Structure

```
├── app/
│   ├── admin/                      # Redirects to /
│   ├── api/
│   │   ├── auth/                   # Login, logout, and session endpoints
│   │   └── youtube/                # OAuth, broadcasts, metrics, transition, options
│   ├── privacy/                    # Privacy Policy page
│   ├── terms/                      # Terms of Service page
│   ├── globals.css
│   ├── layout.js                   # Root layout, Navbar, and Footer
│   ├── not-found.js                # 404 page
│   └── page.js                     # Main dashboard (Sign-in & Live Manager)
├── components/
│   ├── admin/
│   │   ├── ConfirmModal.jsx        # Confirmation and alert modal
│   │   ├── CreateStreamModal.jsx   # Create upcoming stream modal
│   │   ├── LiveEmbedPlayer.jsx     # Embedded YouTube live player
│   │   ├── LiveStreamingTab.jsx    # 4-column broadcast grid and controls
│   │   └── StreamMatrixModal.jsx   # Stream health & metrics modal
│   ├── AdminNavStatus.jsx          # Active user indicator in navbar
│   ├── Navbar.jsx                  # Top navigation bar
│   └── ThemeToggle.jsx             # Dark/Light theme toggle
├── data/
│   └── admin-users.json            # Local user accounts configuration
├── lib/
│   ├── auth.js                     # Authentication and session helpers
│   └── youtube.js                  # YouTube Data API v3 helpers
└── public/
    └── icon.png
```

---

## Deployment

1. Push the repository to your Git provider.
2. Import the project into your hosting platform (e.g., Vercel).
3. Configure the environment variables (`YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `AUTH_SECRET`, and optionally `ADMIN_USERS_JSON`).
4. Add your production `/api/youtube/callback` URL to **Authorized Redirect URIs** in Google Cloud Console.
5. Deploy.
