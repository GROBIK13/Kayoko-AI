const form = document.getElementById("chatForm");
const promptBox = document.getElementById("prompt");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");

const kayoko = document.getElementById("kayoko");
const mood = document.getElementById("mood");

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

function addMessage(text, type) {
  const message = document.createElement("div");

  message.className = `message ${type}`;
  message.textContent = text;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = promptBox.value.trim();

  if (!text) return;

  welcome.style.display = "none";

  addMessage(text, "user");

  promptBox.value = "";

  setMood("thinking");

  // Временный демонстрационный ответ.
  await new Promise(resolve => setTimeout(resolve, 1200));

  setMood("speaking");

  addMessage(
    "Я получила твоё сообщение! 🌸 Сейчас я работаю в демонстрационном режиме. Скоро подключим настоящий интеллект, и я смогу помогать тебе с программированием и разработкой игр.",
    "assistant"
  );

  setMood("idle");
});

document.getElementById("newChat").addEventListener("click", () => {
  messages.replaceChildren();

  welcome.style.display = "block";

  promptBox.value = "";

  setMood("idle");
});

document.getElementById("projects").addEventListener("click", () => {
  addMessage(
    "Раздел проектов появится в следующей версии.",
    "assistant"
  );
});

document.getElementById("images").addEventListener("click", () => {
  addMessage(
    "Генератор изображений пока не подключён.",
    "assistant"
  );
});

document.getElementById("settings").addEventListener("click", () => {
  addMessage(
    "Настройки Kayoko AI появятся в следующей версии.",
    "assistant"
  );
});
