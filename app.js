/* =====================================
   KOJOKO AI v0.2
   Application Controller
===================================== */

const STORAGE_CHATS = "kojokoAI_chats_v02";
const STORAGE_ACTIVE = "kojokoAI_activeChat_v02";

const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const newChatBtn = document.getElementById("newChatBtn");
const chatHistory = document.getElementById("chatHistory");
const chatTitle = document.getElementById("chatTitle");

const chatForm = document.getElementById("chatForm");
const promptInput = document.getElementById("prompt");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const sendBtn = document.getElementById("sendBtn");

const kayoko = document.getElementById("kayoko");
const mood = document.getElementById("mood");
const toast = document.getElementById("toast");

let chats = loadChats();
let activeChatId = localStorage.getItem(STORAGE_ACTIVE);

let toastTimer = null;

/* =====================================
   ХРАНЕНИЕ ЧАТОВ
===================================== */

function loadChats() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_CHATS)
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveChats() {
  localStorage.setItem(
    STORAGE_CHATS,
    JSON.stringify(chats)
  );
}

function getActiveChat() {
  return chats.find(chat => chat.id === activeChatId);
}

/* =====================================
   СОЗДАНИЕ ЧАТА
===================================== */

function createChat() {
  const chat = {
    id: Date.now().toString(),
    title: "Новый чат",
    messages: [],
    createdAt: new Date().toISOString()
  };

  chats.unshift(chat);
  activeChatId = chat.id;

  localStorage.setItem(STORAGE_ACTIVE, activeChatId);

  saveChats();
  renderChatList();
  renderMessages();

  showToast("Новый чат создан 🌸");
  promptInput.focus();
}

/* =====================================
   ОТКРЫТИЕ ЧАТА
===================================== */

function openChat(id) {
  const chat = chats.find(item => item.id === id);

  if (!chat) return;

  activeChatId = id;

  localStorage.setItem(STORAGE_ACTIVE, id);

  renderChatList();
  renderMessages();

  closeMobileSidebar();
}

/* =====================================
   УДАЛЕНИЕ ЧАТА
===================================== */

function deleteChat(id) {
  const confirmed = confirm(
    "Удалить этот чат?"
  );

  if (!confirmed) return;

  chats = chats.filter(chat => chat.id !== id);

  if (activeChatId === id) {
    activeChatId = null;
    localStorage.removeItem(STORAGE_ACTIVE);
  }

  saveChats();

  if (!activeChatId && chats.length > 0) {
    activeChatId = chats[0].id;
    localStorage.setItem(STORAGE_ACTIVE, activeChatId);
  }

  if (!activeChatId) {
    createChat();
  } else {
    renderChatList();
    renderMessages();
  }

  showToast("Чат удалён");
}

/* =====================================
   СПИСОК ЧАТОВ
===================================== */

function renderChatList() {
  chatHistory.innerHTML = "";

  chats.forEach(chat => {
    const item = document.createElement("div");
    item.className = "chat-item";

    if (chat.id === activeChatId) {
      item.classList.add("active");
    }

    const openButton = document.createElement("button");
    openButton.className = "chat-open";
    openButton.textContent = "💬 " + chat.title;
    openButton.title = chat.title;

    openButton.addEventListener("click", () => {
      openChat(chat.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "chat-delete";
    deleteButton.textContent = "✕";
    deleteButton.title = "Удалить чат";

    deleteButton.addEventListener("click", () => {
      deleteChat(chat.id);
    });

    item.append(openButton, deleteButton);
    chatHistory.appendChild(item);
  });
}

/* =====================================
   ОТОБРАЖЕНИЕ СООБЩЕНИЙ
===================================== */

function renderMessages() {
  messages.innerHTML = "";

  const chat = getActiveChat();

  if (!chat) {
    welcome.style.display = "block";
    chatTitle.textContent = "Новый чат";
    return;
  }

  chatTitle.textContent = chat.title;

  welcome.style.display =
    chat.messages.length === 0 ? "block" : "none";

  chat.messages.forEach(message => {
    addMessageElement(message.text, message.role);
  });
}

function addMessageElement(text, role) {
  const element = document.createElement("div");

  element.className = "message " + role;
  element.textContent = text;

  messages.appendChild(element);

  const chatArea = document.getElementById("chatArea");
  chatArea.scrollTop = chatArea.scrollHeight;
}

function addMessage(text, role) {
  const chat = getActiveChat();

  if (!chat) return;

  const message = {
    text: text,
    role: role,
    createdAt: new Date().toISOString()
  };

  chat.messages.push(message);

  if (
    chat.messages.length === 1 &&
    role === "user"
  ) {
    chat.title = text.slice(0, 30);

    if (text.length > 30) {
      chat.title += "...";
    }
  }

  saveChats();
  renderChatList();
  renderMessages();
}

/* =====================================
   СОСТОЯНИЕ КАЁКО
===================================== */

function setMood(state) {
  const moods = {
    idle: {
      image: "images/kayoko-idle.jpg",
      text: "Ожидаю сообщения..."
    },

    thinking: {
      image: "images/kayoko-thinking.jpg",
      text: "Думаю..."
    },

    speaking: {
      image: "images/kayoko-speaking.jpg",
      text: "Отвечаю..."
    }
  };

  const selected = moods[state] || moods.idle;

  kayoko.src = selected.image;
  mood.textContent = selected.text;
}

/* =====================================
   ОТПРАВКА СООБЩЕНИЯ
===================================== */

async function sendMessage(text) {
  text = text.trim();

  if (!text) return;

  if (!getActiveChat()) {
    createChat();
  }

  addMessage(text, "user");

  promptInput.value = "";
  promptInput.style.height = "auto";

  welcome.style.display = "none";

  setMood("thinking");
  sendBtn.disabled = true;

  try {
    let answer;

    if (
      window.KOJOKOAI &&
      typeof window.KOJOKOAI.respond === "function"
    ) {
      answer = await window.KOJOKOAI.respond(text);
    } else {
      answer = "Пока мой мозговой модуль не подключён. 🌸";
    }

    if (typeof answer !== "string") {
      answer = String(answer ?? "Я пока не знаю, что ответить.");
    }

    setMood("speaking");

    addMessage(answer, "assistant");

  } catch (error) {
    console.error("KOJOKO AI error:", error);

    setMood("speaking");

    addMessage(
      "Извини, произошла ошибка. Попробуй ещё раз.",
      "assistant"
    );

  } finally {
    sendBtn.disabled = false;

    setTimeout(() => {
      setMood("idle");
    }, 1800);
  }
}

/* =====================================
   КНОПКИ И СОБЫТИЯ
===================================== */

chatForm.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(promptInput.value);
});

newChatBtn.addEventListener("click", createChat);

promptInput.addEventListener("input", () => {
  promptInput.style.height = "auto";

  promptInput.style.height =
    Math.min(promptInput.scrollHeight, 150) + "px";
});

promptInput.addEventListener("keydown", event => {
  if (
    event.key === "Enter" &&
    !event.shiftKey
  ) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

/* =====================================
   СВОРАЧИВАНИЕ МЕНЮ
===================================== */

toggleSidebar.addEventListener("click", () => {
  document.body.classList.toggle("sidebar-collapsed");

  const collapsed = document.body.classList.contains(
    "sidebar-collapsed"
  );

  toggleSidebar.textContent = collapsed ? "›" : "‹";

  toggleSidebar.setAttribute(
    "aria-label",
    collapsed ? "Открыть меню" : "Свернуть меню"
  );
});

function closeMobileSidebar() {
  if (window.innerWidth <= 700) {
    document.body.classList.add("sidebar-collapsed");
    toggleSidebar.textContent = "›";
  }
}

/* =====================================
   ПОДСКАЗКИ
===================================== */

document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.prompt || "";
    promptInput.focus();
  });
});

/* =====================================
   РАЗДЕЛЫ
===================================== */

document.getElementById("projectsBtn")
  .addEventListener("click", () => {
    showToast("Раздел проектов появится позже 📁");
  });

document.getElementById("imagesBtn")
  .addEventListener("click", () => {
    showToast("Раздел изображений появится позже 🖼️");
  });

document.getElementById("settingsBtn")
  .addEventListener("click", () => {
    showToast("Настройки появятся позже ⚙️");
  });

/* =====================================
   УВЕДОМЛЕНИЯ
===================================== */

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

/* =====================================
   ЗАПУСК ПРИЛОЖЕНИЯ
===================================== */

function init() {
  if (
    !activeChatId ||
    !chats.some(chat => chat.id === activeChatId)
  ) {
    if (chats.length > 0) {
      activeChatId = chats[0].id;
    } else {
      createChat();
      return;
    }
  }

  localStorage.setItem(STORAGE_ACTIVE, activeChatId);

  renderChatList();
  renderMessages();
  setMood("idle");

  if (window.innerWidth <= 700) {
    document.body.classList.add("sidebar-collapsed");
    toggleSidebar.textContent = "›";
  }
}

init();
