FRONTEND (React + Tailwind + Redux)

client/
├── public/
│   └── widget.js
│      // Chat widget script that businesses embed on their website
│      // This connects to our backend and opens the AI chat
│
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   │   // Main React component
│   │   │   // Loads routes and global providers
│   │   │
│   │   ├── routes.jsx
│   │   │   // All application routes in one file
│   │   │   // Example: /login, /dashboard, /chat
│   │   │
│   │   └── providers.jsx
│   │       // Wraps app with Redux, Socket, and Language providers
│
│   ├── store/
│   │   ├── index.js
│   │   │   // Creates Redux store using Redux Toolkit
│   │   │
│   │   ├── auth.slice.js
│   │   │   // Stores login user, token, business info
│   │   │
│   │   ├── chat.slice.js
│   │   │   // Stores chat messages, active conversation, unread count
│   │   │
│   │   ├── voice.slice.js
│   │   │   // Stores voice call state (ringing, active, muted)
│   │   │
│   │   └── app.slice.js
│   │       // Stores app-wide settings (theme, language, alerts)
│
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   │   // Reusable button component
│   │   │   │
│   │   │   ├── Modal.jsx
│   │   │   │   // Reusable popup/modal
│   │   │   │
│   │   │   └── Loader.jsx
│   │   │       // Loading spinner
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatBox.jsx
│   │   │   │   // Main chat UI container
│   │   │   │
│   │   │   ├── Message.jsx
│   │   │   │   // Single chat message bubble
│   │   │   │
│   │   │   └── VoiceButton.jsx
│   │   │       // Button to start or stop AI voice call
│   │   │
│   │   └── dashboard/
│   │       ├── StatsCard.jsx
│   │       │   // Shows analytics numbers
│   │       │
│   │       └── Chart.jsx
│   │           // Displays graphs (calls, chats, usage)
│
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.api.js
│   │   │   │   // All login/signup API calls
│   │   │   │
│   │   │   └── auth.thunks.js
│   │   │       // Async Redux actions for auth
│   │   │
│   │   ├── chat/
│   │   │   ├── chat.api.js
│   │   │   │   // Chat-related API calls
│   │   │   │
│   │   │   ├── chat.socket.js
│   │   │   │   // WebSocket events (send/receive messages)
│   │   │   │
│   │   │   └── chat.thunks.js
│   │   │       // Async chat actions
│   │   │
│   │   ├── voice/
│   │   │   ├── voice.api.js
│   │   │   │   // Voice call API calls
│   │   │   │
│   │   │   └── voice.thunks.js
│   │   │       // Async voice actions
│   │   │
│   │   └── analytics/
│   │       └── analytics.api.js
│   │           // Fetch dashboard analytics data
│
│   ├── hooks/
│   │   ├── useAuth.js
│   │   │   // Custom hook for auth logic
│   │   │
│   │   ├── useSocket.js
│   │   │   // Handles socket connection and cleanup
│   │   │
│   │   └── useVoice.js
│   │       // Handles microphone and audio stream
│
│   ├── services/
│   │   ├── apiClient.js
│   │   │   // Axios setup with base URL and headers
│   │   │
│   │   ├── socketClient.js
│   │   │   // Creates socket connection once
│   │   │
│   │   └── i18n.js
│   │       // Language translation setup
│
│   ├── utils/
│   │   ├── constants.js
│   │   │   // Fixed values (roles, limits)
│   │   │
│   │   ├── formatters.js
│   │   │   // Format dates, currency, phone numbers
│   │   │
│   │   └── validators.js
│   │       // Input validation helpers
│
│   ├── styles/
│   │   └── index.css
│   │       // Global Tailwind styles
│
│   └── main.jsx
│       // React entry point
│
└── package.json


BACKEND (Node + Express + Redis + AI)
server/
├── src/
│   ├── app.js
│   │   // Creates express app
│   │   // Registers middleware and routes
│
│   ├── server.js
│   │   // Starts HTTP server and WebSocket server
│
│   ├── config/
│   │   ├── env.js
│   │   │   // Loads environment variables
│   │   │
│   │   ├── db.js
│   │   │   // Connects to MongoDB
│   │   │
│   │   ├── redis.js
│   │   │   // Connects to Redis
│   │   │
│   │   └── socket.js
│   │       // Configures Socket.io with Redis adapter
│
│   ├── routes/
│   │   ├── auth.routes.js
│   │   │   // Login and signup endpoints
│   │   │
│   │   ├── chat.routes.js
│   │   │   // Chat message APIs
│   │   │
│   │   ├── voice.routes.js
│   │   │   // Voice call webhooks (Twilio/Exotel)
│   │   │
│   │   ├── business.routes.js
│   │   │   // Business setup, FAQ upload, policies
│   │   │
│   │   └── analytics.routes.js
│   │       // Dashboard analytics APIs
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   │   // Handles auth request and response
│   │   │
│   │   ├── chat.controller.js
│   │   │   // Handles chat requests
│   │   │
│   │   ├── voice.controller.js
│   │   │   // Handles incoming voice calls
│   │   │
│   │   └── business.controller.js
│   │       // Handles business data
│
│   ├── services/
│   │   ├── ai/
│   │   │   ├── ai.service.js
│   │   │   │   // Calls AI model to generate response
│   │   │   │
│   │   │   ├── embedding.service.js
│   │   │   │   // Converts text to embeddings
│   │   │   │
│   │   │   ├── rag.service.js
│   │   │   │   // Fetches relevant business data
│   │   │   │
│   │   │   └── tts.service.js
│   │   │       // Converts AI text to voice
│   │   │
│   │   ├── voice/
│   │   │   ├── stt.service.js
│   │   │   │   // Converts voice to text
│   │   │   │
│   │   │   └── call.service.js
│   │   │       // Manages call flow
│   │   │
│   │   ├── cache/
│   │   │   └── redis.service.js
│   │   │       // Get/set data in Redis
│   │   │
│   │   ├── queue/
│   │   │   ├── ai.queue.js
│   │   │   │   // Push AI tasks to queue
│   │   │   │
│   │   │   └── worker.js
│   │   │       // Processes queued AI jobs
│   │   │
│   │   ├── socket/
│   │   │   └── socket.service.js
│   │   │       // Emits real-time events
│   │   │
│   │   └── integrations/
│   │       ├── shopify.service.js
│   │       │   // Shopify order integration
│   │       │
│   │       └── woocommerce.service.js
│   │           // WooCommerce order integration
│
│   ├── models/
│   │   ├── User.model.js
│   │   │   // User schema
│   │   │
│   │   ├── Business.model.js
│   │   │   // Business data schema
│   │   │
│   │   ├── Message.model.js
│   │   │   // Chat messages schema
│   │   │
│   │   ├── Ticket.model.js
│   │   │   // Support ticket schema
│   │   │
│   │   └── Order.model.js
│   │       // Order data schema
│
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   │   // Protects private routes
│   │   │
│   │   ├── rateLimit.middleware.js
│   │   │   // Prevents abuse
│   │   │
│   │   └── error.middleware.js
│   │       // Handles errors centrally
│
│   ├── utils/
│   │   ├── logger.js
│   │   │   // Logs errors and info
│   │   │
│   │   ├── constants.js
│   │   │   // Fixed backend values
│   │   │
│   │   └── helpers.js
│   │       // Small reusable helpers
│
│   └── jobs/
│       └── ai.job.js
│           // Background AI job logic
│
├── .env
│   // Secrets and keys
│
├── package.json
└── README.md


What is Redis?
Redis keeps data that is needed right now in fast memory, used for
caching, shared memory, scaling apps
So: App does NOT go to database every time, App gets data instantly

Why database is slow
Database (MongoDB):
Stores data on disk
Reads take more time
Good for permanent storage

Redis:
Stores data in RAM
Reads are very very fast
Good for temporary data

Without Redis ❌

User asks:
“What are your store timings?”
App: Go to database->Read data->Send repl->This happens every time → slow.

With Redis ✅
First time: App gets answer from database->Saves it in Redis
Next time:App gets answer directly from Redis->No database call->Much faster.

Local Redis
Local Redis means Redis runs on your own computer.
Features:
No API key, No internet needed, Used for development & learning,Runs on localhost:6379

Cloud Redis

Cloud Redis means Redis runs on another server (online).
Examples:
Upstash
Redis Cloud
AWS ElastiCache
Features:
Needs URL / password
Used in production
Accessible from anywhere

Why we used Docker
Windows cannot run Redis easily.

Docker:

Runs Redis in a small container
No installation headache
Works like real server Redis

How Docker Redis works (Simple)
Docker starts Redis
Redis waits on port 6379
Your backend connects to it
Redis is ready
Command we used:
docker run -d -p 6379:6379 redis

USER FLOW: User → Browser → Backend → Redis → Backend → User


Twilio
Voice Architecture (Simple View)
Phone Call
   ↓
Webhook (Twilio)
   ↓
Speech-to-Text
   ↓
Queue → Worker → AI
   ↓
Text-to-Speech
   ↓
Return audio to caller

Twilio and Ngrok

---

## 🎯 What Are We Trying To Do?

We want this:

> 📞 When someone calls your Twilio number → your AI should answer.

That’s the goal.

---

## 🧠 Problem

Your AI server is running here:

```
http://localhost:5000
```

But:

❌ “localhost” means **only your laptop can see it**
❌ Twilio is on the internet
❌ Twilio cannot see your laptop

So when someone calls, Twilio doesn’t know where to send the call data.

---

## 🟢 What Twilio Does

Twilio gives you:

* A real phone number
* When someone calls:

  * Twilio sends a request (webhook) to a URL you give it

Example:

```
https://yourdomain.com/api/voice/call
```

But you don’t have a public domain yet.

---

## 🔵 What ngrok Does

ngrok creates a public URL that points to your laptop.

When you run:

```
ngrok http 5000
```

It creates something like:

```
https://abcd.ngrok-free.app
```

Now:

```
Internet → abcd.ngrok-free.app → your laptop (port 5000)
```

So Twilio can now reach your AI.

---

## 🔁 Full Flow (Very Simple)

1️⃣ Someone calls your Twilio number
2️⃣ Twilio sends call info to:

```
https://abcd.ngrok-free.app/api/voice/call
```

3️⃣ ngrok sends that to:

```
http://localhost:5000/api/voice/call
```

4️⃣ Your AI processes it
5️⃣ Twilio reads the AI reply out loud

---

## 🔥 Why Both Needed?

| Tool   | Why                                |
| ------ | ---------------------------------- |
| Twilio | Gives phone number + handles voice |
| ngrok  | Makes your local server public     |

Without ngrok → Twilio cannot reach your AI.

Without Twilio → No phone number.

---

Twilio gives you a real phone number.
When someone calls it, Twilio needs a public URL to send the call data to.
Your AI is running on localhost (only your laptop), so Twilio can’t reach it.
ngrok gives your laptop a temporary public link.


Role of ngrok

Your AI server is running here:
http://localhost:5000

But:
❌ Twilio (on the internet)
cannot access localhost

Because localhost = only your laptop

What ngrok does

When you run:
ngrok http 5000

ngrok creates a public internet link like:
https://abc.ngrok-free.dev

Now this happens:
Twilio sends the call data to your public ngrok URL over the internet.
ngrok receives it and forwards that request to your local server running on localhost:5000.
Twilio → https://abc.ngrok-free.dev → localhost:5000

So ngrok is just a:
Bridge between Twilio (internet) and your local AI server


Step by step when you call the number::

---
**Step 1 — You call the number**
You dial `+1 213 370 1583` from your phone. This number belongs to Twilio (like a Jio/Airtel number).
---
**Step 2 — Twilio receives your call**
Twilio picks up and thinks:
> "Someone called me, let me check what I should do"
It checks its settings and sees your ngrok URL:
```
https://subepiglottic-nonrousing-elbert.ngrok-free.dev/api/voice/call
```
---
Step 3 — Twilio contacts your server**
Twilio sends a message (POST request) to your ngrok URL saying:
> "Hey server! Someone called from +917022544934, what should I do?"

Step 4 — Ngrok forwards to your laptop**
Your server is running on your laptop (`localhost:3000`). The internet can't reach your laptop directly. 
So ngrok forwards Twilio's message to your laptop.`
Twilio → Ngrok → Your Laptop

Step 5 — Your server responds**
Your `handleIncomingCall` runs and sends back TwiML (instructions) to Twilio:
"Say this to the caller: Hello! Welcome to AI Customer Support..."
"Then listen to what they say"

Step 6 — Twilio speaks to you**
Twilio follows the instructions and you hear on your phone:
> *"Hello! Welcome to AI Customer Support. Please tell me how I can help you."*

Step 7 — You speak**
You say something like:
> *"I want to track my order"*
Twilio listens and converts your voice to text:
SpeechResult = "I want to track my order"

Step 8 — Twilio sends your speech to server**
Twilio again contacts your server at `/api/voice/process` with your speech text.

Step 9 — AI processes your speech**
Your `processSpeech` controller sends the text to your AI service. AI generates a reply:
"Your order is out for delivery and will arrive by 5pm"

Step 10 — You hear the AI reply**
Server sends TwiML back to Twilio → Twilio speaks the AI answer → You hear it on your phone! 🎉


You call +1 213 370 1583
        ↓
Twilio picks up the call
        ↓
Twilio asks your server "what should I say?"
        ↓
Ngrok lets Twilio reach your laptop
        ↓
Your server says "say this: Hello Welcome..."
        ↓
Twilio speaks it to you
        ↓
You reply → AI processes → Twilio speaks AI answer


The Problem:

The code is currently locked to one specific business ID.
If a new company joins our platform, the AI will still answer their phone calls using the first company's data.

The Solution
We need to make the code check which phone number was dialed so it can use the right company's data.
Step 1: Add a "phone number" field to our database rules.
Step 2: Save the actual Twilio phone number into our database.
Step 3: Update the code so that when a call comes in, it looks up the dialed number, finds the matching company, and uses the correct AI knowledge to reply.

Here is the step-by-step flow of exactly what happens with this model after a company logs into your website.

### **1. The Company Logs In**
A business owner signs into our platform's frontend dashboard.

### **2. They Add Their Phone Number**
On their dashboard settings, they type in the Twilio phone number they want to use for their AI voice assistant.

### **3. The Database Saves It**

Our website sends that phone number to our backend. Because we just added `twilioNumber` to our model, our database now has a place to save it. It saves a document that looks like this:

* **Name:** "Mary's Bakery"
* **Owner:** (Mary's User ID)
* **twilioNumber:** "+15551234"

### **4. A Customer Calls**
Later, a customer dials `+15551234`. Twilio sends a message to your code saying, "Hey, someone is calling +15551234."

### **5. The AI Makes the Match**
The code searches our database for the number `+15551234`. It instantly finds Mary's Bakery, loads her specific AI knowledge, and answers the phone using her data.

---

Async Thunk :
A thunk is just: A function that returns another function.

An async thunk (specifically createAsyncThunk in Redux Toolkit) is a tool that allows you to write asynchronous logic that interacts with your Redux store.

In standard Redux, reducers must be entirely synchronous and "pure"—they take the current state and an action,
and immediately return a new state. They cannot make API calls, wait for promises, or handle side effects. 
An async thunk acts as a middleware that bridges this gap, allowing you to fetch data from your backend and
update your frontend state accordingly.

Think of an **Async Thunk** as a "middleman" that allows Redux to handle tasks that take time, 
like fetching data from a website.
Normally, Redux is **instant**. You click a button, and the state changes immediately. But APIs are **slow**.
An Async Thunk sits in between the click and the state change to manage that waiting period.

### The 3 Stages it Handles:

1. **Pending:** "I've started the request! Show a loading spinner."
2. **Fulfilled:** "I got the data! Here it is, put it in the store."
3. **Rejected:** "Oops, the server is down. Show an error message."

### In Short:

It's a way to keep your **API logic** out of your UI components and give Redux a way to track 
**loading**, **success**, and **failure** states automatically.


RTK Query :

Think of **RTK Query** as the "Auto-Pilot" for data fetching in Redux.
Before RTK Query, you had to manually write code to fetch data, track if it was loading, handle errors, and save it to the store. RTK Query does all of that for you automatically.
---

### The 4 Main "Superpowers" of RTK Query

1. **Zero Boilerplate:** You don't write `pending`, `fulfilled`, or `rejected` logic. You just define the URL, and RTK Query creates a **custom React Hook** for you (like `useGetUsersQuery`).
2. **Smart Caching:** If Component A fetches "User 1" and then Component B needs "User 1," RTK Query realizes it already has the data and **doesn't make a second network call**.
3. **Automatic Loading States:** The hook gives you variables like `isLoading`, `isError`, and `data` out of the box.
4. **Polling & Revalidation:** You can tell it to "refetch this data every 10 seconds" or "refetch when I refocus the window" with just one line of code.

---

### How it looks in practice

Instead of writing a long Thunk and a Slice, you create an **API Service**:

```javascript
// 1. Define your service
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name) => `pokemon/${name}`,
    }),
  }),
})

// 2. Export the auto-generated hook
export const { useGetPokemonByNameQuery } = pokemonApi

```

Then, in your **Component**, you just use the hook:

```javascript
function App() {
  // RTK Query handles all the "Async" work here!
  const { data, error, isLoading } = useGetPokemonByNameQuery('pikachu')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error!</div>

  return <h1>{data.name}</h1>
}

```
---

### Summary: RTK Query vs. Async Thunk

* **Async Thunk:** You are the chef. You buy the ingredients, cook the meal, and set the table.
* **RTK Query:** You are at a restaurant. You just point at the menu, and the food appears exactly when you need it.



The "Rules of Thumb" for 2026:

Fetching data from a REST/GraphQL API? Use RTK Query.
Uploading a file with a progress bar? Use RTK Query.
Complex logic that involves "waiting" but isn't an API? Use Async Thunk.
Chaining 5 different actions together based on a result? Use Async Thunk.

1. The Messengers (How we move data)These tools are responsible for the actual "phone call" to the server.
| **Feature**        | **Fetch API**                                                                 | **Axios**                                                              |
| ------------------ | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **What is it?**    | Native browser API (No installation required)                                 | Third-party library (Requires `npm install axios`)                     |
| **Error Handling** | Does not throw errors for 4xx/5xx (Manual check required using `response.ok`) | Automatically throws errors for 4xx/5xx responses                      |
| **JSON Data**      | Requires manual call to `response.json()`                                     | Automatically parses JSON response data                                |
| **Interceptors**   | Not built-in (Requires custom wrapper logic)                                  | Built-in interceptors (Useful for JWT, logging, global error handling) |


2. The Managers (How we handle state)
These tools sit on top of the "Messengers" to help Redux understand that a request is happening
| **Feature**     | **Async Thunk (`createAsyncThunk`)**                                                  | **RTK Query (`createApi`)**                                                      |
| --------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Boilerplate** | High. You must manually create `loading`, `success`, and `error` states in slices.    | Minimal. Automatically generates hooks, reducers, and request state management.  |
| **Caching**     | None. Multiple calls trigger multiple API requests.                                   | Built-in caching and request de-duplication. Prevents unnecessary network calls. |
| **Best For**    | Complex, multi-step business logic (e.g., sequential API calls or conditional flows). | Standard CRUD operations (GET, POST, PUT, DELETE).                               |
| **Logic Style** | Imperative (You define *how* the async flow executes).                                | Declarative (You define *what* data you need; library handles execution).        |

Fetch and Axios are just tools to send requests to the server and get data back — they only handle the network call.
Async Thunk and RTK Query help Redux manage what happens during that request — like loading, success, error, and storing data.
Fetch/Axios = “How we talk to the server.”
Async Thunk/RTK Query = “How we manage and store the server response in our app.”


What Is ProtectedRoute?
It checks authentication.It decides allow or redirect.It does NOT define routes.

What Does routes.jsx Do?
routes.jsx defines: What URLs exist, What component loads for each URL,Which routes are public,
Which routes are protected.

Authentication vs Authorization

Authentication:
User logs in
Backend verifies password
Backend generates JWT

Authorization:
Backend checks JWT.Backend checks role (owner/staff)

Backend decides:
Can access dashboard? Can create business? Can view analytics?

Authentication = identity check
Authorization = access control
