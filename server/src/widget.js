(function () {
  "use strict";

  const currentScript =
    document.currentScript ||
    document.querySelector("script[data-business-id]");

  const BUSINESS_ID = currentScript?.getAttribute("data-business-id");
  const SERVER_URL =
    currentScript?.getAttribute("data-server-url") ||
    "http://localhost:5000";

  if (!BUSINESS_ID) {
    console.error("[Widget] data-business-id is required");
    return;
  }

  let conversationId = null;
  let orderId = null;
  let socket = null;
  let isOpen = false;
  let callPanelOpen = false;

  // ============================================================
  // STYLES
  // ============================================================
  const style = document.createElement("style");
  style.textContent = `
    #ai-widget-btn {
      position: fixed; bottom: 24px; right: 24px;
      width: 56px; height: 56px; border-radius: 50%;
      background: #111827; color: white; border: none;
      cursor: pointer; display: flex; align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      z-index: 9999; transition: transform 0.2s, background 0.2s;
    }
    #ai-widget-btn:hover { background: #1f2937; transform: scale(1.07); }

    #ai-widget-container {
      position: fixed; bottom: 92px; right: 24px;
      width: 360px; height: 520px;
      background: white; border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: flex; flex-direction: column;
      z-index: 9998; overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      transform: translateY(20px); opacity: 0;
      pointer-events: none;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }
    #ai-widget-container.open {
      transform: translateY(0); opacity: 1; pointer-events: all;
    }

    #ai-widget-header {
      background: #111827; color: white;
      padding: 16px 18px; display: flex;
      align-items: center; gap: 10px; flex-shrink: 0;
    }
    #ai-widget-header .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: #374151; display: flex;
      align-items: center; justify-content: center; font-size: 18px;
    }
    #ai-widget-header .info { flex: 1; }
    #ai-widget-header .name { font-weight: 600; font-size: 14px; }
    #ai-widget-header .status { font-size: 11px; color: #9ca3af; margin-top: 1px; }
    #ai-widget-close {
      background: none; border: none; color: #9ca3af;
      cursor: pointer; font-size: 20px; line-height: 1; padding: 2px;
    }
    #ai-widget-close:hover { color: white; }

    #ai-widget-body {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px; background: #f9fafb;
    }
    #ai-widget-body::-webkit-scrollbar { width: 4px; }
    #ai-widget-body::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }

    #ai-widget-order-screen {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 24px; gap: 12px; background: #f9fafb;
    }
    #ai-widget-order-screen .icon { font-size: 40px; }
    #ai-widget-order-screen h3 { font-size: 16px; font-weight: 600; color: #111827; margin: 0; }
    #ai-widget-order-screen p { font-size: 13px; color: #6b7280; text-align: center; margin: 0; }
    #ai-widget-order-input {
      width: 100%; padding: 10px 14px;
      border: 1.5px solid #e5e7eb; border-radius: 8px;
      font-size: 14px; outline: none; box-sizing: border-box;
      transition: border-color 0.2s;
    }
    #ai-widget-order-input:focus { border-color: #111827; }
    #ai-widget-order-btn {
      width: 100%; padding: 10px; background: #111827;
      color: white; border: none; border-radius: 8px;
      font-size: 14px; font-weight: 500; cursor: pointer;
      transition: background 0.2s;
    }
    #ai-widget-order-btn:hover { background: #1f2937; }
    #ai-widget-order-btn:disabled { background: #9ca3af; cursor: not-allowed; }
    #ai-widget-order-error { color: #ef4444; font-size: 12px; text-align: center; min-height: 16px; }
    .skip-link {
      font-size: 12px; color: #6b7280; cursor: pointer;
      text-decoration: underline; background: none; border: none; padding: 0;
    }
    .skip-link:hover { color: #111827; }

    .ai-msg, .user-msg {
      max-width: 80%; padding: 10px 14px; border-radius: 12px;
      font-size: 13px; line-height: 1.5; word-wrap: break-word;
    }
    .ai-msg {
      background: white; color: #111827;
      border: 1px solid #e5e7eb; align-self: flex-start;
      border-bottom-left-radius: 3px;
    }
    .user-msg {
      background: #111827; color: white;
      align-self: flex-end; border-bottom-right-radius: 3px;
    }
    .msg-time { font-size: 10px; color: #9ca3af; margin-top: 3px; display: block; }
    .user-msg .msg-time { color: #d1d5db; text-align: right; }

    .typing-indicator {
      display: flex; gap: 4px; align-items: center;
      padding: 10px 14px; background: white;
      border: 1px solid #e5e7eb; border-radius: 12px;
      border-bottom-left-radius: 3px; align-self: flex-start;
    }
    .typing-dot {
      width: 7px; height: 7px; background: #9ca3af;
      border-radius: 50%; animation: typing-bounce 1.2s infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    #ai-widget-footer {
      padding: 12px 14px; border-top: 1px solid #e5e7eb;
      display: flex; gap: 8px; background: white; flex-shrink: 0;
      align-items: flex-end;
    }
    #ai-widget-input {
      flex: 1; padding: 9px 12px;
      border: 1.5px solid #e5e7eb; border-radius: 8px;
      font-size: 13px; outline: none; resize: none;
      font-family: inherit; transition: border-color 0.2s;
    }
    #ai-widget-input:focus { border-color: #111827; }
    #ai-widget-send, #ai-widget-call-btn {
      width: 36px; height: 36px; border: none;
      border-radius: 8px; cursor: pointer;
      display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
      transition: background 0.2s;
    }
    #ai-widget-send {
      background: #111827; color: white;
    }
    #ai-widget-send:hover { background: #374151; }
    #ai-widget-send:disabled { background: #9ca3af; cursor: not-allowed; }
    #ai-widget-call-btn {
      background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0;
    }
    #ai-widget-call-btn:hover { background: #dcfce7; }

    /* CALL PANEL */
    #ai-call-panel {
      position: absolute; bottom: 62px; left: 0; right: 0;
      background: white; border-top: 1px solid #e5e7eb;
      padding: 16px; display: none; flex-direction: column;
      gap: 10px; z-index: 10;
    }
    #ai-call-panel.open { display: flex; }
    #ai-call-panel h4 { font-size: 13px; font-weight: 600; color: #111827; margin: 0; }
    #ai-call-panel p { font-size: 12px; color: #6b7280; margin: 0; }
    #ai-call-phone-input {
      width: 100%; padding: 9px 12px;
      border: 1.5px solid #e5e7eb; border-radius: 8px;
      font-size: 13px; outline: none; box-sizing: border-box;
      transition: border-color 0.2s;
    }
    #ai-call-phone-input:focus { border-color: #111827; }
    #ai-call-submit {
      width: 100%; padding: 9px; background: #16a34a;
      color: white; border: none; border-radius: 8px;
      font-size: 13px; font-weight: 500; cursor: pointer;
      transition: background 0.2s;
    }
    #ai-call-submit:hover { background: #15803d; }
    #ai-call-submit:disabled { background: #9ca3af; cursor: not-allowed; }
    #ai-call-status { font-size: 12px; text-align: center; min-height: 16px; }
    #ai-call-panel-close {
      position: absolute; top: 10px; right: 12px;
      background: none; border: none; cursor: pointer;
      font-size: 16px; color: #9ca3af;
    }
    #ai-call-panel-close:hover { color: #111827; }
  `;
  document.head.appendChild(style);

  // ============================================================
  // DOM
  // ============================================================
  const btn = document.createElement("button");
  btn.id = "ai-widget-btn";
  btn.innerHTML = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  btn.title = "Chat with us";

  const container = document.createElement("div");
  container.id = "ai-widget-container";
  container.innerHTML = `
    <div id="ai-widget-header">
      <div class="avatar">🤖</div>
      <div class="info">
        <div class="name">AI Support</div>
        <div class="status">● Online — usually replies instantly</div>
      </div>
      <button id="ai-widget-close">✕</button>
    </div>

    <div id="ai-widget-order-screen">
      <div class="icon">📦</div>
      <h3>Welcome! How can we help?</h3>
      <p>Enter your Order ID so we can look up your details, or skip to ask a general question.</p>
      <input id="ai-widget-order-input" type="text" placeholder="Order ID (e.g. ORD-1234)" />
      <div id="ai-widget-order-error"></div>
      <button id="ai-widget-order-btn">Start Chat</button>
      <button class="skip-link" id="ai-widget-skip">Skip — I have a general question</button>
    </div>

    <div id="ai-widget-body" style="display:none;"></div>

    <div id="ai-widget-footer" style="display:none; position:relative;">
      <input id="ai-widget-input" type="text" placeholder="Type a message..." />
      <button id="ai-widget-call-btn" title="Request a call">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.57 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </button>
      <button id="ai-widget-send">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>

      <!-- CALL PANEL -->
      <div id="ai-call-panel">
        <button id="ai-call-panel-close">✕</button>
        <h4>📞 Request a Call Back</h4>
        <p>Enter your phone number and we'll call you right away.</p>
        <input id="ai-call-phone-input" type="tel" placeholder="+1 234 567 8900" />
        <button id="ai-call-submit">Call Me Now</button>
        <div id="ai-call-status"></div>
      </div>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(container);

  // ============================================================
  // HELPERS
  // ============================================================
  function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function scrollToBottom() {
    const body = document.getElementById("ai-widget-body");
    if (body) body.scrollTop = body.scrollHeight;
  }

  function appendMessage(content, sender, time) {
    removeTyping();
    const body = document.getElementById("ai-widget-body");
    const div = document.createElement("div");
    div.className = sender === "user" ? "user-msg" : "ai-msg";
    div.innerHTML = `${content}<span class="msg-time">${formatTime(time || new Date())}</span>`;
    body.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    removeTyping();
    const body = document.getElementById("ai-widget-body");
    const div = document.createElement("div");
    div.className = "typing-indicator";
    div.id = "ai-typing";
    div.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
    body.appendChild(div);
    scrollToBottom();
  }

  function removeTyping() {
    const t = document.getElementById("ai-typing");
    if (t) t.remove();
  }

  function switchToChat() {
    document.getElementById("ai-widget-order-screen").style.display = "none";
    document.getElementById("ai-widget-body").style.display = "flex";
    document.getElementById("ai-widget-footer").style.display = "flex";
    appendMessage(
      orderId
        ? `Hi! I've noted your Order ID <strong>#${orderId}</strong>. What can I help you with?`
        : "Hi! I'm your AI support assistant. What can I help you with today?",
      "ai"
    );
    connectSocket();
    document.getElementById("ai-widget-input").focus();
  }

  // ============================================================
  // SOCKET
  // ============================================================
  function connectSocket() {
    if (socket || !conversationId) return;
    const script = document.createElement("script");
    script.src = `${SERVER_URL}/socket.io/socket.io.js`;
    script.onload = () => {
      socket = window.io(SERVER_URL, { query: { businessId: BUSINESS_ID } });
      socket.on("connect", () => {
        socket.emit("join-conversation", { conversationId });
      });
      socket.on("new-message", (msg) => {
        if (msg.sender === "ai" || msg.sender === "agent") {
          removeTyping();
          appendMessage(msg.content, "ai", msg.createdAt);
        }
      });
      socket.on("disconnect", () => { socket = null; });
    };
    document.head.appendChild(script);
  }

  // ============================================================
  // ORDER SUBMIT
  // ============================================================
  async function handleOrderSubmit() {
    const input = document.getElementById("ai-widget-order-input");
    const errorEl = document.getElementById("ai-widget-order-error");
    const submitBtn = document.getElementById("ai-widget-order-btn");
    const value = input.value.trim();

    errorEl.textContent = "";
    if (!value) { errorEl.textContent = "Please enter your Order ID."; return; }

    submitBtn.disabled = true;
    submitBtn.textContent = "Checking...";

    try {
      const res = await fetch(`${SERVER_URL}/api/orders/${BUSINESS_ID}/${encodeURIComponent(value)}`);

      if (res.status === 404) {
        errorEl.textContent = "Order not found. Please check the ID and try again.";
        submitBtn.disabled = false;
        submitBtn.textContent = "Start Chat";
        return;
      }
      if (!res.ok) throw new Error("Server error");

      const order = await res.json();
      orderId = order.orderNumber;
      await createConversation(`order:${orderId}`);
      switchToChat();
    } catch (err) {
      errorEl.textContent = "Something went wrong. Please try again.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Start Chat";
    }
  }

  // ============================================================
  // CREATE CONVERSATION
  // ============================================================
  async function createConversation(customerId) {
    const res = await fetch(`${SERVER_URL}/api/chat/conversation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: BUSINESS_ID, customerId }),
    });
    if (!res.ok) throw new Error("Failed to create conversation");
    const data = await res.json();
    conversationId = data._id;
  }

  // ============================================================
  // SEND MESSAGE
  // ============================================================
  async function sendMessage() {
    const input = document.getElementById("ai-widget-input");
    const sendBtn = document.getElementById("ai-widget-send");
    const text = input.value.trim();
    if (!text || !conversationId) return;

    input.value = "";
    sendBtn.disabled = true;
    appendMessage(text, "user");
    showTyping();

    try {
      await fetch(`${SERVER_URL}/api/chat/message-async`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          businessId: BUSINESS_ID,
          conversationId,
          orderId: orderId || null,
        }),
      });
    } catch (err) {
      removeTyping();
      appendMessage("Sorry, something went wrong. Please try again.", "ai");
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // ============================================================
  // CALL PANEL
  // ============================================================
  function toggleCallPanel() {
    callPanelOpen = !callPanelOpen;
    const panel = document.getElementById("ai-call-panel");
    if (callPanelOpen) {
      panel.classList.add("open");
      document.getElementById("ai-call-phone-input").focus();
    } else {
      panel.classList.remove("open");
    }
  }

  async function handleCallSubmit() {
    const phoneInput = document.getElementById("ai-call-phone-input");
    const submitBtn = document.getElementById("ai-call-submit");
    const statusEl = document.getElementById("ai-call-status");
    const phone = phoneInput.value.trim();

    if (!phone) {
      statusEl.style.color = "#ef4444";
      statusEl.textContent = "Please enter your phone number.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Calling...";
    statusEl.textContent = "";

    try {
      const res = await fetch(`${SERVER_URL}/api/voice/call-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: BUSINESS_ID,
          phoneNumber: phone,
          orderId: orderId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        statusEl.style.color = "#ef4444";
        statusEl.textContent = data.message || "Failed to initiate call.";
        submitBtn.disabled = false;
        submitBtn.textContent = "Call Me Now";
        return;
      }

      statusEl.style.color = "#16a34a";
      statusEl.textContent = "✅ Calling you now! Please answer your phone.";
      phoneInput.value = "";
      submitBtn.textContent = "Call Initiated";

      setTimeout(() => {
        toggleCallPanel();
        submitBtn.disabled = false;
        submitBtn.textContent = "Call Me Now";
        statusEl.textContent = "";
      }, 3000);
    } catch (err) {
      statusEl.style.color = "#ef4444";
      statusEl.textContent = "Something went wrong. Please try again.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Call Me Now";
    }
  }

  // ============================================================
  // TOGGLE WIDGET
  // ============================================================
  function openWidget() {
    isOpen = true;
    container.classList.add("open");
    btn.innerHTML = `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  }

  function closeWidget() {
    isOpen = false;
    container.classList.remove("open");
    btn.innerHTML = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  }

  // ============================================================
  // EVENT LISTENERS
  // ============================================================
  btn.addEventListener("click", () => (isOpen ? closeWidget() : openWidget()));
  document.getElementById("ai-widget-close").addEventListener("click", closeWidget);
  document.getElementById("ai-widget-order-btn").addEventListener("click", handleOrderSubmit);
  document.getElementById("ai-widget-order-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleOrderSubmit();
  });
  document.getElementById("ai-widget-skip").addEventListener("click", async () => {
    orderId = null;
    try { await createConversation("anonymous"); } catch (e) {}
    switchToChat();
  });
  document.getElementById("ai-widget-send").addEventListener("click", sendMessage);
  document.getElementById("ai-widget-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  document.getElementById("ai-widget-call-btn").addEventListener("click", toggleCallPanel);
  document.getElementById("ai-call-panel-close").addEventListener("click", toggleCallPanel);
  document.getElementById("ai-call-submit").addEventListener("click", handleCallSubmit);
  document.getElementById("ai-call-phone-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleCallSubmit();
  });
})();