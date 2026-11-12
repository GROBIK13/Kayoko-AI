const form = document.getElementById("chatForm");
const promptBox = document.getElementById("prompt");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");

const kayoko = document.getElementById("kayoko");
const mood = document.getElementById("mood");

const STORAGE_KEY = "kayokoChatHistory";

let chatHistory = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || "[]"
);

function setMood(state) {
  const images = {
    idle: "images/kayoko-idle.png",
    thinking: "images/kayoko-thinking.png",
    speaking: "images/kayoko-speaking.png"
  };

  const labels = {
    idle: "Ожидает сообщения",
    thinking: "Думает над ответом...",
    speaking: "Отвечает тебе"
  };

  kayoko.src = images[state];
  mood.textContent = labels[state];
}

function saveHistory() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(chatHistory)
  );
}

function addMessage(text, type, save = true) {
  const message = document.createElement("div");

  message.className = `message ${type}`;
  message.textContent = text;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;

  if (save) {
    chatHistory.push({ text, type });
    saveHistory();
  }
}

function loadHistory() {
  messages.replaceChildren();

  if (chatHistory.length === 0) {
    welcome.style.display = "block";
    return;
  }

  welcome.style.display = "none";

  chatHistory.forEach(item => {
    addMessage(item.text, item.type, false);
  });
}

// Отправка сообщений
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = promptBox.value.trim();
  if (!text) return;

  welcome.style.display = "none";

  addMessage(text, "user");
  promptBox.value = "";

  setMood("thinking");

  await new Promise(resolve => setTimeout(resolve, 700));

  setMood("speaking");

  let answer;

  if (window.KOJOKOAI) {
    answer = window.KOJOKOAI.respond(text);
  } else {
    answer = "Ой! Мой мозг пока не подключён! 🌸";
  }

  addMessage(answer, "assistant");

  setMood("idle");
});

// Новый чат
document.getElementById("newChat").addEventListener("click", () => {
  chatHistory = [];
  saveHistory();

  if (window.KOJOKOAI) {
    window.KOJOKOAI.resetMemory();
  }

  messages.replaceChildren();
  welcome.style.display = "block";
  promptBox.value = "";

  setMood("idle");
});

// Разделы
document.getElementById("projects").addEventListener("click", () => {
  addMessage(
    "Раздел проектов появится в следующей версии! 🌸",
    "assistant"
  );
});

document.getElementById("images").addEventListener("click", () => {
  addMessage(
    "Ня! Генератор изображений пока находится в разработке! 🎨",
    "assistant"
  );
});

document.getElementById("settings").addEventListener("click", () => {
  addMessage(
    "Настройки KOJOKO AI скоро появятся! ⚙️",
    "assistant"
  );
});

// Запуск
loadHistory();
setMood("idle");
