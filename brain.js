/* =========================================
   KOJOKO AI — BRAIN v0.3
   Personality: Kayoko 🌸
========================================= */

(function () {
  "use strict";

  const memory = {
    userName: "",
    messagesCount: 0,
    lastTopic: "",
    lastMessage: "",
    history: []
  };

  const knowledge = {
    greetings: [
      "Привет! 🌸 Рада тебя видеть! Чем займёмся?",
      "О, привет! Что будем сегодня создавать?",
      "Привет! Я готова помочь!"
    ],

    thanks: [
      "Всегда пожалуйста! 🌸",
      "Рада, что помогла!",
      "Не за что! Обращайся."
    ],

    goodbye: [
      "До встречи! 🌸",
      "Пока! Удачи с проектами!",
      "До скорого!"
    ],

    coding: [
      "Давай разберёмся с программированием! Какой язык используем?",
      "Я помогу написать код. Расскажи, что должна делать программа.",
      "Давай создадим это вместе! 🌸"
    ],

    math: [
      "Давай решим математическую задачу по шагам!",
      "Хорошо! Пришли пример, и я объясню решение.",
      "Попробуем разобраться. 🌸"
    ],

    school: [
      "Давай разберём школьное задание!",
      "Пришли условие. Я объясню всё простыми словами.",
      "Разберём тему постепенно, шаг за шагом."
    ],

    manga: [
      "Манга! 🌸 Давай поработаем над сюжетом!",
      "Можем придумать сцену, диалог или персонажа.",
      "Что нового в твоём проекте?"
    ],

    mood: [
      "Всё хорошо! Готова помогать с проектами. 🌸",
      "Настроение рабочее! Что будем делать?",
      "Я здесь и готова помочь!"
    ],

    unknown: [
      "Хм... Можешь объяснить немного подробнее?",
      "Интересная мысль! Давай разберёмся.",
      "Расскажи чуть больше, чтобы я лучше поняла."
    ]
  };

  function randomAnswer(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function containsAny(text, words) {
    return words.some(word => text.includes(word));
  }

  // Определение темы сообщения
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
      "ошибка", "функци", "массив",
      "переменн", "алгоритм"
    ])) return "coding";

    if (containsAny(text, [
      "математ", "уравнен", "пример",
      "дроб", "процент", "алгебр",
      "посчитай", "вычисли"
    ])) return "math";

    if (containsAny(text, [
      "домашн", "задание", "урок",
      "школ", "истори", "биологи",
      "географ", "физик", "литератур"
    ])) return "school";

    if (containsAny(text, [
      "манга", "каёко", "марин",
      "нацуки", "персонаж", "сюжет"
    ])) return "manga";

    if (containsAny(text, [
      "как дела", "как ты", "настроение"
    ])) return "mood";

    return "unknown";
  }

  // Безопасный калькулятор простых выражений.
  // Поддерживает +, -, *, / и скобки.
  function calculate(expression) {
    const source = expression
      .replace(/,/g, ".")
      .replace(/\s+/g, "");

    if (!source || !/^[0-9.+*/()\-]+$/.test(source)) {
      return null;
    }

    const tokens = source.match(
      /(?:\d+(?:\.\d*)?|\.\d+)|[()+*/-]/g
    );

    if (!tokens || tokens.join("") !== source) {
      return null;
    }

    let position = 0;

    function parseExpression() {
      let value = parseTerm();

      while (tokens[position] === "+" ||
             tokens[position] === "-") {
        const operator = tokens[position++];
        const next = parseTerm();

        value = operator === "+"
          ? value + next
          : value - next;
      }

      return value;
    }

    function parseTerm() {
      let value = parseFactor();

      while (tokens[position] === "*" ||
             tokens[position] === "/") {
        const operator = tokens[position++];
        const next = parseFactor();

        if (operator === "/" && next === 0) {
          throw new Error("Деление на ноль");
        }

        value = operator === "*"
          ? value * next
          : value / next;
      }

      return value;
    }

    function parseFactor() {
      const token = tokens[position++];

      if (token === "-") return -parseFactor();
      if (token === "+") return parseFactor();

      if (token === "(") {
        const value = parseExpression();

        if (tokens[position++] !== ")") {
          throw new Error("Неверные скобки");
        }

        return value;
      }

      const value = Number(token);

      if (!Number.isFinite(value)) {
        throw new Error("Неверное число");
      }

      return value;
    }

    try {
      const result = parseExpression();

      if (position !== tokens.length ||
          !Number.isFinite(result)) {
        return null;
      }

      return Number(result.toFixed(8));
    } catch {
      return null;
    }
  }

  // Поиск математического примера
  function solveMath(text) {
    const match = text.match(
      /(?:посчитай|вычисли|сколько будет|реши)?\s*(-?\d+(?:[.,]\d+)?(?:\s*[+\-*/]\s*-?\d+(?:[.,]\d+)?|\s*[\(\)])+(?:\s*[\d()+\-*/.,]+)*)\s*[?]?$/i
    );

    if (!match) return null;

    const result = calculate(match[1]);

    if (result === null) return null;

    return `Получилось: ${result} 🌸\n\nЯ вычислила выражение ${match[1]}.`;
  }

  // Запоминание сообщений
  function remember(text, category) {
    memory.messagesCount++;
    memory.lastTopic = category;
    memory.lastMessage = text;

    memory.history.push({
      message: text,
      topic: category
    });

    if (memory.history.length > 20) {
      memory.history.shift();
    }

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

  // Главная функция ответа
  function respond(input) {
    if (typeof input !== "string" || !input.trim()) {
      return "Напиши что-нибудь, и я постараюсь помочь! 🌸";
    }

    const text = input.toLowerCase().trim();
    const category = detectCategory(text);

    remember(text, category);

    // Определение имени
    if (/меня зовут|моё имя|мое имя/i.test(text)) {
      return `Приятно познакомиться, ${memory.userName}! 🌸`;
    }

    // Математический калькулятор
    if (category === "math") {
      const solution = solveMath(text);

      if (solution) return solution;
    }

    // Ответ по выбранной категории
    return personalize(
      randomAnswer(knowledge[category])
    );
  }

  function getMemory() {
    return {
      ...memory,
      history: [...memory.history]
    };
  }

  function resetMemory() {
    memory.userName = "";
    memory.messagesCount = 0;
    memory.lastTopic = "";
    memory.lastMessage = "";
    memory.history = [];
  }

  window.KOJOKOAI = {
    respond,
    getMemory,
    resetMemory,
    detectCategory,
    calculate
  };

  console.log("🌸 KOJOKO AI Brain v0.3 загружен!");
})();
