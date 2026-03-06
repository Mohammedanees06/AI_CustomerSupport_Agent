# AI Customer Support SaaS

> A production-grade, **AI-powered customer support platform** built with the MERN stack — featuring a realtime chat widget, RAG knowledge base, voice support, ticket escalation, and a multi-tenant business dashboard.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7-red)](https://redis.io)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## Overview

This project is a **fully functional AI customer support SaaS** that businesses can embed on their websites with a single script tag. Customers chat with an AI that answers from the business's knowledge base, looks up order statuses in real time, and escalates to human agents when needed.

It is designed as both a **working product** and a **learning reference** for building production-style AI applications with async processing, realtime communication, and multi-tenancy.

---

## Features

### 🤖 AI-Powered Chat
- Retrieval-Augmented Generation (RAG) pipeline — AI answers only from the business's knowledge base
- Confidence scoring — low confidence answers auto-escalate to a support ticket
- Order lookup — detects order numbers and queries the database directly, bypassing AI
- Conversation memory — full history per conversation

### 📦 Embeddable Customer Widget
- Pure JavaScript widget — no framework, no build step
- One script tag embeds it on any website (Shopify, WordPress, plain HTML)
- Order ID verification screen before chat starts
- Realtime responses via Socket.IO
- Typing indicators and auto-scroll
- Mobile responsive
- Isolated inline styles — never conflicts with the host website's CSS

### 🧠 Knowledge Base Management
- Upload PDFs
- Paste plain text
- Scrape content from a website URL
- Bulk import FAQ pairs
- Vector embeddings via Google Gemini
- Similarity search to find relevant context per query

### 📞 Voice Support (Twilio)
- Customer enters their phone number → Twilio calls them
- AI answers using their order context from the moment they pick up
- Speech-to-text → RAG → AI reply → text-to-speech
- Conversation memory per call session (Redis)
- Auto-escalation when AI confidence is low

### 🎫 Ticket System
- Auto-created when AI confidence is below threshold
- Dashboard to view, filter, and update ticket status
- Priority levels (high / medium / low)
- Color-coded status badges

### 📊 Analytics Dashboard
- Total messages, AI responses, order lookups, tickets created
- AI resolution rate
- Ticket breakdown by status
- Live BullMQ queue stats (waiting / active / completed / failed)

### 🔐 Authentication
- JWT-based auth
- Google OAuth (Passport.js)
- Business setup flow after registration
- Protected dashboard routes

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Customer Website                   │
│          <script src="yourapp.com/widget.js">        │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP + Socket.IO
┌─────────────────────▼───────────────────────────────┐
│                  Express Server                      │
│   Auth │ Chat │ Orders │ Knowledge │ Voice │ Monitor │
└──────┬──────────────────────────┬────────────────────┘
       │                          │
       │ BullMQ Jobs              │ Socket.IO Events
       ▼                          ▼
┌─────────────┐          ┌─────────────────┐
│  AI Worker  │          │  Redis Pub/Sub  │
│  (separate  │─────────▶│  (cross-process │
│   process)  │          │   event bridge) │
└──────┬──────┘          └────────┬────────┘
       │                          │
       │ Gemini API               │ Emit to client
       ▼                          ▼
┌─────────────┐          ┌─────────────────┐
│   MongoDB   │          │   React Dashboard│
│  (data)     │          │  (business owner)│
└─────────────┘          └─────────────────┘
```

**Key architectural decisions:**
- **Redis Pub/Sub** bridges the AI worker process to the Express server so Socket.IO events work across separate Node processes
- **BullMQ** handles all AI jobs asynchronously — prevents API timeouts and enables horizontal scaling
- **RAG pipeline** — embeddings stored in MongoDB, cosine similarity search per query
- **Widget as static JS** — served from Express, loads on any site, zero dependencies

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Redux Toolkit, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Cache & Queue | Redis (ioredis), BullMQ |
| Realtime | Socket.IO |
| AI | Google Gemini 2.5 Flash |
| Voice | Twilio Voice API |
| Auth | JWT, Passport.js, Google OAuth |
| Widget | Vanilla JavaScript (no framework) |

---

## Project Structure

```
ai-customer-support/
├── client/                        # React dashboard
│   └── src/
│       ├── app/                   # Redux store + routes
│       ├── components/            # Reusable UI components
│       ├── pages/
│       │   ├── auth/              # Login, Register
│       │   └── dashboard/         # Chat, Tickets, Knowledge, Analytics
│       └── features/              # Redux slices
│
└── server/                        # Express backend
    └── src/
        ├── config/                # DB, Redis, Socket, Passport
        ├── controllers/           # Route handlers
        ├── models/                # Mongoose schemas
        ├── routes/                # Express routers
        ├── services/
        │   ├── ai/                # Gemini, embeddings, RAG
        │   ├── queue/             # BullMQ worker + job processor
        │   └── analytics.service.js
        └── middleware/            # Auth, rate limiting
    ├── server.js                  # Entry point
    └── widget.js                  # Embeddable customer widget
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Google Gemini API key
- Twilio account (for voice features)

### 1. Clone the repository

```bash
git clone https://github.com/Mohammedanees06/ai-customer-support
cd ai-customer-support
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

### 4. Run the application

```bash
# Terminal 1 — Backend (server + AI worker together)
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

| Service | URL |
|---|---|
| React Dashboard | http://localhost:5173 |
| Express API | http://localhost:5000 |
| Widget | http://localhost:5000/widget.js |

### 5. Embed the widget

Paste this into any HTML page:

```html
<script
  src="http://localhost:5000/widget.js"
  data-business-id="YOUR_BUSINESS_ID"
  data-server-url="http://localhost:5000"
></script>
```

---

## How It Works

### Chat Flow
```
Customer types message
        ↓
POST /api/chat/message-async
        ↓
Message saved → job added to BullMQ
        ↓
Worker picks up job
        ↓
Order number? → query DB directly
No order?    → RAG knowledge lookup → Gemini AI
        ↓
Low confidence? → create support ticket
        ↓
AI message saved → published to Redis
        ↓
Express subscribes → Socket.IO emits to widget
        ↓
Customer sees response in realtime
```

### Voice Flow
```
Customer clicks "Call me" in widget
        ↓
Enters phone number
        ↓
POST /api/voice/call-customer
        ↓
Backend fetches order context
        ↓
Twilio calls customer's phone
        ↓
Customer picks up → AI greets with order info
        ↓
Speech → RAG → Gemini → TTS spoken reply
        ↓
Conversation continues until hangup
```

---

## Roadmap

- [x] Realtime chat with Socket.IO
- [x] RAG knowledge base
- [x] Embeddable widget
- [x] Order lookup
- [x] Ticket escalation
- [x] Analytics dashboard
- [x] Voice support (Twilio)
- [ ] Voice call button in widget
- [ ] Embed code page in dashboard
- [ ] Orders management page
- [ ] Agent handoff (human takeover)
- [ ] Widget customization (colors, name)
- [ ] Production deployment guide
- [ ] WhatsApp integration
- [ ] Email integration

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add your feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a pull request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Author

**Mohammed Anees**

[GitHub](https://github.com/Mohammedanees06) · [Portfolio](https://mohammedanees.netlify.app)