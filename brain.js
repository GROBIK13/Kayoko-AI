
/* =========================================
   KOJOKO AI — BRAIN v0.2
   Personality: Kayoko 🌸
========================================= */

(function () {
  "use strict";

  const memory = {
    userName: "",
    messagesCount: 0,
    lastTopic: ""
  };

  const knowledge = {
    greetings: [
      "Привет! 🌸 Рада тебя видеть. Чем займёмся?",
      "О, привет! Как дела? Что будем делать сегодня?",
      "Привет! Я здесь. Чем могу помочь?"
    ],

    thanks: [
      "Всегда пожалуйста! 🌸",
      "Рада помочь!",
      "Не за что! Обращайся."
    ],

    goodbye: [
      "До встречи! Буду ждать новых задач 🌸",
      "Пока! Хорошего дня!",
      "Удачи! Заглядывай ещё."
    ],

    coding: [
      "Конечно! Давай разберёмся с кодом. На каком языке программирования работаем?",
      "Могу помочь написать небольшой код. Расскажи, что он должен делать.",
      "Давай создадим это вместе! Опиши задачу, и я предложу решение."
    ],

    math: [
      "Давай решим задачу по математике. Пришли условие полностью.",
      "Хорошо! Разберём решение по шагам, чтобы было понятно.",
      "Попробуем решить. Напиши пример или условие задачи."
    ],

    school: [
      "Давай разберём школьное задание. Пришли его условие.",
      "Хорошо! Я помогу разобраться и объясню тему простыми словами.",
      "Давай сделаем это вместе, шаг за шагом."
    ],

    manga: [
      "Манга? 🌸 Звучит интересно! Над чем сейчас работаешь?",
      "Можем придумать сцену, диалог или развитие персонажа.",
      "Давай поработаем над историей!"
    ],

    mood: [
      "Я здесь и готова помочь! 🌸",
      "Всё хорошо. Чем займёмся?",
      "Настроение рабочее! Есть интересная задача?"
    ],

    unknown: [
      "Хм... Я пока не совсем поняла. Можешь объяснить немного подробнее?",
      "Интересная мысль! Расскажи об этом чуть подробнее.",
      "Я пока не знаю точного ответа, но попробую разобраться."
    ]
  };

  function randomAnswer(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function containsAny(text, words) {
    return words.some(word => text.includes(word));
  }

  function detectCategory(text) {
    if (containsAny(text, [
      "привет", "здравствуй", "доброе утро",
      "добрый вечер", "хай", "hello"
    ])) return "greetings";

    if (containsAny(text, [
      "спасибо", "благодарю", "спс"
    ])) return "thanks";

    if (containsAny(text, [
      "пока", "до встречи", "увидимся"
    ])) return "goodbye";

    if (containsAny(text, [
      "код", "программ", "javascript",
      "html", "css", "python", "сайт",
      "ошибка", "функци"
    ])) return "coding";

    if (containsAny(text, [
      "математ", "уравнен", "пример",
      "дроб", "процент", "алгебр"
    ])) return "math";

    if (containsAny(text, [
      "домашн", "задание", "урок",
      "школ", "истори", "биологи",
      "географ", "физик", "литератур"
    ])) return "school";

    if (containsAny(text, [
      "манга", "каёко", "марин",
      "нацуми", "персонаж", "сюжет"
    ])) return "manga";

    if (containsAny(text, [
      "как дела", "как ты", "настроение"
    ])) return "mood";

    return "unknown";
  }

  function remember(text, category) {
    memory.messagesCount++;
    memory.lastTopic = category;

    const nameMatch = text.match(
      /(?:меня зовут|моё имя|мое имя)\s+([а-яёa-z0-9_-]+)/i
    );

    if (nameMatch) {
      memory.userName = nameMatch[1];
    }
  }

  function personalize(answer) {
    if (memory.userName) {
      return answer.replace(
        "{name}",
        memory.userName
      );
    }

    return answer.replace("{name}", "").trim();
  }

  function respond(input) {
    if (typeof input !== "string" || !input.trim()) {
      return "Напиши что-нибудь, и я постараюсь помочь! 🌸";
    }

    const text = input.toLowerCase().trim();

    const category = detectCategory(text);

    remember(text, category);

    return personalize(
      randomAnswer(knowledge[category])
    );
  }

  function getMemory() {
    return { ...memory };
  }

  function resetMemory() {
    memory.userName = "";
    memory.messagesCount = 0;
    memory.lastTopic = "";
  }

  window.KOJOKOAI = {
    respond,
    getMemory,
    resetMemory
  };

  console.log("🌸 KOJOKO AI Brain v0.2 загружен!");
})();
