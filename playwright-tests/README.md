# Автотесты Playwright — cpcimpex.com

Общая папка команды для запуска Playwright-тестов. Тест-кейсы и описание лежат в [`testing.md`](../testing.md), здесь — код, который можно запустить.

## Структура

```
playwright-tests/
├── package.json
├── playwright.config.ts      # baseURL и обход блокировки headless (см. ниже)
├── pages/                    # Page Object’ы
│   └── cpcimpexExtensionsPage.js
└── tests/                    # сами тесты (*.spec.ts / *.spec.js)
    ├── cpcimpex.spec.js        # карточки услуг — Кирилл
    └── cpcimpexFooter.spec.ts  # футер — Денис
```

## Запуск

```bash
cd playwright-tests
npm install
npx playwright install chromium

npm test                  # все тесты
npm run test:ui           # UI-режим: тесты по шагам со снимками страницы
npm run test:headed       # с видимым браузером
npx playwright test cpcimpexFooter      # только один файл
npm run report            # HTML-отчёт после прогона
```

## Как добавить свои тесты

1. Положить файл теста в `tests/` с окончанием `.spec.ts` или `.spec.js`.
2. Page Object (если есть) — в `pages/`, импорт из теста: `../pages/имяФайла.js`.
3. В `page.goto()` можно писать относительный путь (`'/'`) — `baseURL` уже задан в конфиге.
4. Конфиг не менять без нужды: в нём важная правка, без которой сайт не открывается (см. ниже).

## Важно: сайт блокирует headless-браузер

В headless-режиме Chromium отправляет `User-Agent` и `sec-ch-ua` со словом `HeadlessChrome`. На такие запросы cpcimpex.com отвечает **HTTP 200 с пустой страницей**, и падают все тесты. В `--headed` проблемы нет, поэтому её легко не заметить. В `playwright.config.ts` оба заголовка подменены на обычный Chrome.

## Результат прогона 03.11.2026

24 теста: **22 passed, 1 expected fail, 1 failed** — оба падения ловят реальные баги сайта:

| Тест | Результат | Баг |
|------|-----------|-----|
| Футер: TC-F09 «все ссылки футера открываются» | expected fail | Ссылка «Топперы с начинкой под ключ» в футере ведёт на `https://cpcimpex.com/https://toppers.cpcimpex.com/` → 404 |
| Карточки: «Топперы с начинкой под ключ… toppers.cpcimpex.com загружается» | failed | На `https://toppers.cpcimpex.com` стоит чужой SSL-сертификат хостинга (`*.valuehost.ru`), браузер показывает ошибку вместо сайта |
