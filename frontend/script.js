const API_BASE_URL = "http://127.0.0.1:5000";

const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const clearButton = document.getElementById("clear-btn");
const chatForm = document.getElementById("chat-form");
const welcomeScreen = document.getElementById("welcome-screen");
const newChatButton = document.getElementById("new-chat-btn");
const mobileMenuButton = document.getElementById("mobile-menu");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");
const sidebar = document.getElementById("sidebar");

function setSidebarOpen(isOpen) {
  sidebar.classList.toggle("open", isOpen);
  document.body.classList.toggle("navigation-open", isOpen);
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  sidebarBackdrop.hidden = !isOpen;
}

function scrollToLatest() {
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
}

function hideWelcome() {
  if (welcomeScreen) welcomeScreen.hidden = true;
}

function addMessage(role, text, options = {}) {
  hideWelcome();
  const row = document.createElement("article");
  row.className = `message-row ${role}${options.error ? " message-error" : ""}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = role === "user" ? "Y" : "✦";

  const content = document.createElement("div");
  content.className = "message-content";
  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = role === "user" ? "You" : "FlyAwways AI";
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  // textContent prevents user messages or model output from being interpreted as HTML.
  bubble.textContent = text;

  content.append(name, bubble);
  row.append(avatar, content);
  chatBox.appendChild(row);
  scrollToLatest();
  return row;
}

function addTypingIndicator() {
  hideWelcome();
  const row = document.createElement("article");
  row.className = "message-row bot typing-row";
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = "✦";
  const content = document.createElement("div");
  content.className = "message-content";
  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = "FlyAwways AI is thinking";
  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  const dots = document.createElement("div");
  dots.className = "typing-dots";
  for (let i = 0; i < 3; i += 1) dots.appendChild(document.createElement("span"));
  bubble.appendChild(dots);
  content.append(name, bubble);
  row.append(avatar, content);
  chatBox.appendChild(row);
  scrollToLatest();
  return row;
}

async function sendMessage(text = messageInput.value) {
  const message = text.trim();
  if (!message || sendButton.disabled) return;

  addMessage("user", message);
  messageInput.value = "";
  resizeInput();
  sendButton.disabled = true;
  const typingRow = addTypingIndicator();

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    if (typeof data.response !== "string") throw new Error("The server returned an unexpected response.");
    typingRow.remove();
    addMessage("bot", data.response);
  } catch (error) {
    console.error("Chat request failed:", error);
    typingRow.remove();
    addMessage("bot", error.message.includes("Failed to fetch")
      ? "I couldn't connect to the chatbot server. Please make sure Flask and Ollama are running, then try again."
      : `Sorry, something went wrong: ${error.message}`, { error: true });
  } finally {
    sendButton.disabled = false;
    messageInput.focus();
  }
}

function resizeInput() {
  messageInput.style.height = "auto";
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 130)}px`;
}

async function clearChat() {
  setSidebarOpen(false);
  clearButton.disabled = true;
  try {
    const response = await fetch(`${API_BASE_URL}/clear`, { method: "POST" });
    if (!response.ok) throw new Error(`Clear request failed (${response.status})`);
    chatBox.replaceChildren(welcomeScreen);
    welcomeScreen.hidden = false;
    messageInput.value = "";
    resizeInput();
  } catch (error) {
    console.error("Could not clear conversation:", error);
    addMessage("bot", "I couldn't clear the conversation. Please check that the server is running.", { error: true });
  } finally {
    clearButton.disabled = false;
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});

messageInput.addEventListener("input", resizeInput);
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

clearButton.addEventListener("click", clearChat);
newChatButton.addEventListener("click", clearChat);
mobileMenuButton.addEventListener("click", () => {
  setSidebarOpen(mobileMenuButton.getAttribute("aria-expanded") !== "true");
});
sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setSidebarOpen(false);
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    setSidebarOpen(false);
    sendMessage(button.dataset.prompt);
  });
});
