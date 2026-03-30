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

## Screenshots

---
<img width="1919" height="911" alt="Screenshot 2026-03-27 102444" src="https://github.com/user-attachments/assets/3b4ec176-925f-49d5-bc76-e229149693cc" />

<img width="1913" height="913" alt="Screenshot 2026-03-27 102519" src="https://github.com/user-attachments/assets/28926702-05e2-408f-b23b-5a2c45d68071" />

<img width="1919" height="913" alt="Screenshot 2026-03-27 102109" src="https://github.com/user-attachments/assets/d29668c9-1372-4cf7-bb30-d0841d98e9fe" />

<img width="1919" height="893" alt="Screenshot 2026-03-27 102133" src="https://github.com/user-attachments/assets/a74875af-8ae1-43e7-acee-2b8a60f3c0af" />

<img width="1917" height="900" alt="Screenshot 2026-03-27 103601" src="https://github.com/user-attachments/assets/f5fa92a6-5fef-4f96-9e2e-46e24bb56e07" />

<img width="1918" height="906" alt="Screenshot 2026-03-27 103157" src="https://github.com/user-attachments/assets/00fb1ff7-3742-455e-b05c-3b3e0a880a06" />

<img width="1917" height="900" alt="Screenshot 2026-03-27 103601" src="https://github.com/user-attachments/assets/c9d7c9aa-1e26-4b18-be9d-51469eb1c5f7" />

<img width="1905" height="902" alt="Screenshot 2026-03-27 102212" src="https://github.com/user-attachments/assets/af6158a0-3be5-4256-b255-71b4a526931f" />

<img width="1902" height="903" alt="Screenshot 2026-03-27 102201" src="https://github.com/user-attachments/assets/17493b74-8868-4654-b27d-1e41434080a9" />

<img width="1547" height="862" alt="Screenshot 2026-03-28 150821" src="https://github.com/user-attachments/assets/5aa6d158-aa8c-409e-89a2-53f9266cccc3" />





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
│
├── client/                              # React dashboard (business owner UI)
│   ├── public/
│   │   └── widget.js                    # Dev copy of embeddable widget
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx                  # Root React component
│   │   │   ├── providers.jsx            # Redux, Socket, i18n providers
│   │   │   └── routes.jsx               # All app routes defined here
│   │   │
│   │   ├── assets/
│   │   │   └── react.svg
│   │   │
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatBox.jsx          # Main chat UI container
│   │   │   │   ├── Message.jsx          # Single message bubble
│   │   │   │   └── VoiceButton.jsx      # Start/stop AI voice call
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx           # Reusable button
│   │   │   │   ├── Loader.jsx           # Loading spinner
│   │   │   │   └── Modal.jsx            # Reusable modal/popup
│   │   │   └── dashboard/
│   │   │       ├── Chart.jsx            # Analytics graphs
│   │   │       └── StatsCard.jsx        # Metric number cards
│   │   │
│   │   ├── features/
│   │   │   ├── analytics/
│   │   │   │   └── analytics.api.js     # Fetch analytics data
│   │   │   ├── auth/
│   │   │   │   ├── auth.api.js          # Login/signup API calls
│   │   │   │   └── auth.thunks.js       # Async Redux auth actions
│   │   │   ├── chat/
│   │   │   │   ├── chat.api.js          # Chat API calls
│   │   │   │   ├── chat.socket.js       # Socket.IO send/receive
│   │   │   │   └── chat.thunks.js       # Async chat actions
│   │   │   └── voice/
│   │   │       ├── voice.api.js         # Voice call API calls
│   │   │       └── voice.thunks.js      # Async voice actions
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js               # Auth logic hook
│   │   │   ├── useSocket.js             # Socket connection + cleanup
│   │   │   └── useVoice.js              # Microphone and audio stream
│   │   │
│   │   ├── layouts/
│   │   │   ├── BusinessSetup.jsx        # Onboarding layout
│   │   │   ├── DashboardHeader.jsx      # Top nav bar
│   │   │   └── DashboardLayout.jsx      # Sidebar + content wrapper
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── GoogleAuthSuccess.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── dashboard/
│   │   │       ├── AnalyticsPage.jsx    # Metrics + charts
│   │   │       ├── ChatPage.jsx         # Conversations list + messages
│   │   │       ├── Dashboard.jsx        # Knowledge base management
│   │   │       ├── EmbedPage.jsx        # Script tag embed code
│   │   │       └── TicketsPage.jsx      # Support tickets
│   │   │
│   │   ├── routes/
│   │   │   ├── BusinessGuard.jsx        # Redirects if no business setup
│   │   │   └── ProtectedRoute.jsx       # Redirects if not logged in
│   │   │
│   │   ├── services/
│   │   │   ├── apiClient.js             # Axios instance with base URL + headers
│   │   │   ├── i18n.js                  # Language translation setup
│   │   │   └── socketClient.js          # Single socket connection instance
│   │   │
│   │   ├── store/
│   │   │   ├── index.js                 # Redux store setup
│   │   │   ├── app.slice.js             # Theme, language, alerts
│   │   │   ├── auth.slice.js            # User, token, auth state
│   │   │   ├── business.slice.js        # Business info
│   │   │   ├── chat.slice.js            # Messages, active conversation
│   │   │   └── voice.slice.js           # Call state (ringing, active, muted)
│   │   │
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── index.css                # Global Tailwind styles
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js             # Fixed values (roles, limits)
│   │   │   ├── formatters.js            # Date, currency, phone formatters
│   │   │   └── validators.js            # Input validation helpers
│   │   │
│   │   ├── main.jsx                     # React entry point
│   │   └── test.html                    # Local widget test page
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
├── server/                              # Express backend
│   └── src/
│       ├── config/
│       │   ├── db.js                    # MongoDB connection
│       │   ├── env.js                   # Environment variable loader
│       │   ├── passport.js              # Google OAuth strategy
│       │   ├── redis.js                 # Redis connection
│       │   └── socket.js               # Socket.IO + Redis pub/sub subscriber
│       │
│       ├── controllers/
│       │   ├── analytics.controller.js
│       │   ├── auth.controller.js
│       │   ├── business.controller.js
│       │   ├── chat.controller.js       # sendMessage, sendMessageAsync, getConversations
│       │   ├── googleAuthController.js
│       │   ├── knowledge.controller.js  # PDF, text, scrape, FAQ upload
│       │   ├── monitor.controller.js    # Queue stats
│       │   ├── order.controller.js
│       │   ├── ticket.controller.js
│       │   └── voice.controller.js      # handleIncomingCall, processSpeech
│       │
│       ├── jobs/
│       │   └── ai.job.js                # Background AI job logic
│       │
│       ├── middlewares/
│       │   ├── auth.middleware.js        # JWT verification
│       │   ├── error.middleware.js       # Central error handler
│       │   └── rateLimit.middleware.js   # Abuse prevention
│       │
│       ├── models/
│       │   ├── Analytics.model.js
│       │   ├── Business.model.js
│       │   ├── Knowledge.model.js        # Embeddings + text chunks
│       │   ├── Message.model.js
│       │   ├── Order.model.js
│       │   ├── Ticket.model.js
│       │   ├── User.js
│       │   └── conversation.model.js
│       │
│       ├── routes/
│       │   ├── analytics.routes.js
│       │   ├── authRoutes.js
│       │   ├── business.routes.js
│       │   ├── chat.routes.js
│       │   ├── knowledge.routes.js
│       │   ├── monitor.routes.js
│       │   ├── order.routes.js
│       │   ├── ticket.routes.js
│       │   └── voice.routes.js
│       │
│       ├── services/
│       │   ├── ai/
│       │   │   ├── ai.service.js         # Gemini API — generates replies
│       │   │   ├── embedding.service.js  # Text → vector embeddings
│       │   │   ├── rag.service.js        # Similarity search on knowledge base
│       │   │   └── tts.service.js        # Text-to-speech
│       │   ├── cache/
│       │   │   └── redis.service.js      # Redis get/set helpers
│       │   ├── integrations/
│       │   │   ├── shopify.service.js    # Shopify order integration
│       │   │   └── woocommerce.service.js
│       │   ├── queue/
│       │   │   ├── ai.queue.js           # BullMQ queue definition
│       │   │   └── worker.js             # AI job processor (separate process)
│       │   ├── socket/
│       │   │   └── socket.service.js     # Emits realtime events
│       │   ├── voice/
│       │   │   ├── call.service.js       # Manages call flow
│       │   │   └── stt.service.js        # Speech-to-text
│       │   └── analytics.service.js      # incrementMetric helper
│       │
│       ├── test/
│       │   ├── gemini.test.js
│       │   └── list-models.js
│       │
│       ├── utils/                        # Shared backend helpers
│       ├── app.js                        # Express app setup
│       ├── server.js                     # HTTP server entry point
│       └── widget.js                     # Embeddable customer widget (served at /widget.js)
│
│   └── package.json
│
├── .gitignore
├── README.md
└── NOTES.md                             # Architecture and concept notes
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
- [x] Voice call button in widget
- [x] Embed code page in dashboard
- [x] Orders management page
- [x] Agent handoff (human takeover)
- [x] Widget customization (colors, name)
- [x] Production deployment guide
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
