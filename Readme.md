# InterviewPro

A real-time collaborative technical interview platform that enables developers to conduct coding interviews with integrated video calling, live chat, coding challenges, code execution, and session management.

![Dashboard](./Images/LandingPage.png)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Session Flow](#session-flow)
- [Session Lifecycle & Cleanup](#session-lifecycle--cleanup)
- [Database Models](#database-models)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Features

### Authentication & User Management
- Clerk-based authentication
- Secure, protected routes
- User onboarding and profile creation
- JWT-based backend authorization

### Interview Sessions
- Create and join interview sessions
- End sessions as a host
- Host and participant roles
- Session status tracking (active / completed)

### Real-Time Video Calling
- Stream Video SDK integration
- Video/audio controls
- Screen sharing support
- Participant management
- Automatic reconnect support

### Real-Time Chat
- Stream Chat integration
- Session-specific chat channels
- Persistent messaging
- Participant synchronization

### Coding Environment
- Monaco-based code editor
- Multiple programming languages
- Starter code templates
- Syntax highlighting
- Code execution via the Piston API

### Problem Management
- Curated DSA problems
- Difficulty levels: Easy / Medium / Hard
- Constraints, examples, and problem descriptions

### Dashboard
- Active interview sessions
- Recently completed sessions
- Session statistics
- Quick session creation

---

## Tech Stack

### Frontend
- React + Vite
- TailwindCSS + DaisyUI
- TanStack Query
- Clerk React SDK
- Stream Video React SDK
- Stream Chat React SDK
- Monaco Editor

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Clerk Express SDK
- Inngest (background jobs / scheduled cleanup)

### Third-Party Services
- Clerk — Authentication
- Stream — Video & Chat
- Piston API — Code execution
- MongoDB Atlas — Database hosting

---

## Architecture

**Frontend**
```
React + Vite
├── Clerk Authentication
├── TanStack Query
├── Stream Video SDK
├── Stream Chat SDK
└── Monaco Editor
```

**Backend**
```
Express API
├── Authentication Middleware
├── Models
│   ├── Session
│   └── User
├── Lib
│   ├── Stream Integration
│   ├── Inngest Jobs
│   └── Database Connection
└── Routes
    ├── Chat Routes
    └── Session Routes
```

---

## Session Flow

**Create Session**
```
Host → Create Session → MongoDB Session → Stream Video Call → Stream Chat Channel
```

**Join Session**
```
Participant → Join Session → Participant Added → Chat Channel Updated → Video Call Joined
```

**End Session**
```
End Session → Delete Stream Call → Delete Chat Channel → Mark Session Completed
```

---

## Session Lifecycle & Cleanup

To prevent sessions from staying active indefinitely after a host or participant disconnects unexpectedly, InterviewPro uses a heartbeat-based cleanup system.

**How it works:**

1. While a session is open, the client sends a heartbeat every 2 minutes, updating the session's `lastActivityAt` timestamp.
2. A scheduled Inngest job periodically scans for sessions whose `lastActivityAt` has gone stale.
3. Sessions that exceed the inactivity threshold are treated as abandoned and automatically cleaned up.

**This detects:**
- Closed browser tabs
- Browser crashes
- Lost network connections
- Abandoned sessions

**Cleanup actions performed:**
- Mark the session as `completed`
- Delete the associated Stream video call
- Delete the associated Stream chat channel

---

## Database Models

### User
```js
{
  name,
  email,
  profileImg,
  clerkId
}
```

### Session
```js
{
  problem,
  difficulty,
  host,
  participants,
  status,
  callId,
  lastActivityAt
}
```

---

## Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_URL=
VITE_CLERK_PUBLISHABLE_KEY=
VITE_STREAM_API_KEY=
```

### Backend (`backend/.env`)
```env
PORT=
MONGO_URI=

CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

STREAM_API_KEY=
STREAM_API_SECRET=

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

---

## Running Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Inngest Dev Server
```bash
npx inngest-cli@latest dev
```

---

## Roadmap

### High Priority
- [ ] **Real-time collaborative code editor** — each participant currently has an independent editor state; changes aren't synced. Planned via WebSockets/Socket.IO or a CRDT library (e.g. Yjs).
- [ ] **Live cursor tracking** — show collaborator cursor positions and names while typing.
- [ ] **Session cleanup automation** — finish the Inngest cron-based cleanup and ensure orphaned Stream resources are always deleted.
- [ ] **Session reconnect handling** — recover an interview session after a browser refresh, restoring chat and video state.

### Interview Experience
- [ ] AI-generated interview feedback (strengths, weaknesses, suggestions) from code submissions
- [ ] Interview scoring system (problem-solving, communication, code quality, overall)
- [ ] Interviewer notes panel
- [ ] Session recording and playback
- [ ] Whiteboard collaboration for diagrams/algorithm explanations
- [ ] Improved screen sharing controls and presentation mode

### Coding Platform
- [ ] Hidden test case execution with pass/fail status
- [ ] Custom input support for code execution
- [ ] Submission history and stored execution results
- [ ] Additional language-specific templates (JavaScript, Python, Java, C++, Go)
- [ ] Auto-save editor state
- [ ] Code formatting (Prettier / language-specific formatters)

### Session Management
- [ ] Shareable session invitation links
- [ ] Scheduled interviews with calendar integration
- [ ] Session analytics dashboard (duration, participation, difficulty stats)
- [ ] Session filtering by date, difficulty, and status

### User Features
- [ ] User profile page
- [ ] Session history page
- [ ] Leaderboard system
- [ ] Achievement badges
- [ ] Public interview portfolio

### DevOps & Infrastructure
- [ ] Docker support
- [ ] CI/CD pipeline
- [ ] Monitoring and logging
- [ ] Rate limiting
- [ ] Redis caching
- [ ] Error tracking (Sentry)
- [ ] Automated backups

---

## Contributing

Contributions are welcome. If you'd like to help out:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request describing what you changed and why

For larger changes, consider opening an issue first to discuss the approach.

---

## License

No license has been specified yet. Add a `LICENSE` file (e.g. MIT) if you intend for others to use, modify, or distribute this project.

---

## Author

**Divyansh Srivastava**
Software Engineer

Built as a full-stack real-time interview platform using React, Node.js, MongoDB, Clerk, Stream, and Inngest.
