/* =================================
   KOJOKO AI — BRAIN v0.1
   Personality: Kayoko 🌸
================================= */

window.KOJOKOAI = (() => {

  // Память Каёко
  const memory = {
    userName: null,
    messageCount: 0
  };

  // База знаний
  const knowledge = {
    greetings: [
      "Привет! Хай! 🌸 Как твои дела?",
      "Ой, привет! Рада тебя видеть! Ня!",
      "Хм-хм... Привет! Чем займёмся сегодня?"
    ],

    thanks: [
      "Пожалуйста! Всегда рада помочь! 🌸",
      "Э-э... Не за что! Обращайся!",
      "Ня! Рада, что смогла помочь!"
    ],

    mood: [
      "У меня всё хорошо! Спасибо, что спросил! 🌸",
      "Хай! Сегодня отличный день для новых проектов!"
    ]
  };

  // Случайный ответ
  function randomAnswer(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Основная функция обработки сообщений
  function respond(input) {

    if (!input || typeof input !== "string") {
      return "Э-э... Кажется, ты ничего не написал.";
    }

    const message = input.trim();
    const text = message.toLowerCase();

    if (!message) {
      return "Напиши что-нибудь, пожалуйста! 🌸";
    }

    memory.messageCount++;

    // Запоминание имени
    const nameMatch = message.match(
      /(?:меня зовут|моё имя|мое имя)\s+([а-яёa-z-]+)/i
    );

    if (nameMatch) {
      memory.userName = nameMatch[1];

      return `Хай! Очень приятно, ${memory.userName}! 🌸 Я Каёко!`;
    }

    // Приветствие
    if (/^(привет|здравствуй|хай|hello|hi|здравствуйте)/i.test(text)) {
      return randomAnswer(knowledge.greetings);
    }

    // Благодарность
    if (/спасибо|благодарю|спасибки/i.test(text)) {
      return randomAnswer(knowledge.thanks);
    }

    // Настроение
    if (/как дела|как ты|как настроение/i.test(text)) {
      return randomAnswer(knowledge.mood);
    }

    // Имя помощника
    if (/как тебя зовут|твоё имя|твое имя/i.test(text)) {
      return "Я KOJOKO AI! Но можешь просто называть меня Каёко! 🌸";
    }

    // Кто создал
    if (/кто тебя создал|кто твой создатель/i.test(text)) {
      return "Меня создали для помощи с проектами, программированием и общением! Ня!";
    }

    // Помощь
    if (/что ты умеешь|что ты можешь|помоги/i.test(text)) {
      return "Я могу помогать придумывать игры, сайты, объяснять код и давать идеи! 🌸";
    }

    // Программирование
    if (/javascript|js|программирован|код/i.test(text)) {
      return "О! Программирование! 💻 Расскажи, что именно хочешь создать. Я помогу разобраться!";
    }

    // Создание сайта
    if (/создать сайт|сделать сайт|веб-сайт/i.test(text)) {
      return "Хай! Для сайта нам пригодятся HTML, CSS и JavaScript. Давай придумаем его структуру! 🌸";
    }

    // Создание игры
    if (/создать игру|сделать игру|разработать игру/i.test(text)) {
      return "Ура! 🎮 Какую игру будем создавать? 2D, 3D или что-нибудь необычное?";
    }

    // Изображения
    if (/нарисуй|изображени|картинк|генерировать/i.test(text)) {
      return "Ня! Я пока не подключена к генератору изображений, но могу помочь придумать описание для картинки! 🎨";
    }

    // Вопрос о памяти
    if (/как меня зовут/i.test(text)) {
      return memory.userName
        ? `Тебя зовут ${memory.userName}! Хай! 🌸`
        : "Э-э... Ты ещё не говорил мне своё имя!";
    }

    // Ответ по умолчанию
    return randomAnswer([
      "Хм... Интересная мысль! Можешь рассказать подробнее? 🌸",
      "Э-э... Я пока не совсем поняла. Объясни немного иначе!",
      "Ой! Давай попробуем разобраться вместе! Ня!",
      "Интересно! А что ты хочешь сделать дальше?"
    ]);
  }

  // Получение информации о памяти
  function getMemory() {
    return { ...memory };
  }

  // Очистка памяти
  function resetMemory() {
    memory.userName = null;
    memory.messageCount = 0;
  }

  return {
    respond,
    getMemory,
    resetMemory
  };

})();
