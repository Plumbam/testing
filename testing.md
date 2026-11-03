# 📋 Тест-кейсы: Проверка карточек товаров и услуг (cpcimpex.com)

Документация тест-кейсов для автоматизированного набора тестов Playwright, проверяющих блок карточек услуг (`.cart_block`) на сайте [cpcimpex.com](https://cpcimpex.com).

---

## 📌 Общая информация

* **Объект тестирования:** Каталог услуг компании CPCIMPEX (`.cart_block`)
* **URL стенда:** [https://cpcimpex.com](https://cpcimpex.com)
* **Инструмент автоматизации:** Playwright (Node.js)
* **Паттерн:** Page Object Model (POM)
* **Предусловие для всех кейсов (Pre-conditions):**
  1. Браузер открыт с разрешением экрана $\ge 1280 \times 800$.
  2. Выполнен переход на `https://cpcimpex.com`.
  3. Всплывающий баннер CookieHub закрыт / предустановлена сессионная cookie согласия.

---

## 📑 Сводная матрица карточек (Test Data)

| № | Название услуги | Ожидаемый `href` | `target` | Тип перехода | Ожидаемый статус |
|---|---|---|:---:|:---:|:---:|
| 1 | **Фасовка овощей и фруктов** | `http://ccfresh.ru` | `_blank` | Новая вкладка | ⚠️ Ошибка DNS (Баг) |
| 2 | **Фасовка в фигурный пакет** | `https://cpcimpex.com/services/fasovka-v-figurnyij-paket.html` | — | Текущая вкладка | 200 OK |
| 3 | **Фасовка в 3-х шовный пакет** | `https://cpcimpex.com/services/fasovka-v-3-x-shovnyij-paket.html` | — | Текущая вкладка | 200 OK |
| 4 | **Фасовка в 4-х шовный пакет** | `https://cpcimpex.com/services/fasovka-v-4-x-shovnyij-paket.html` | — | Текущая вкладка | 200 OK |
| 5 | **Фасовка в пакет Doy-pack** | `https://cpcimpex.com/services/fasovka-v-paket-doy-pack.html` | — | Текущая вкладка | 200 OK |
| 6 | **Фасовка в топперы** | `https://cpcimpex.com/services/fasovka-v-topperyi.html` | — | Текущая вкладка | 200 OK |
| 7 | **Топперы с начинкой под ключ** | `https://toppers.cpcimpex.com/` | `_blank` | Новая вкладка | 200 OK |
| 8 | **Промо наборы в пленке LDPE** | `https://cpcimpex.com/services/promo-naboryi-v-plenke-ldpe.html` | — | Текущая вкладка | 200 OK |
| 9 | **Промо наборы в пленке ПОФ** | `https://cpcimpex.com/services/promo-naboryi-v-plenke-pof.html` | — | Текущая вкладка | 200 OK |
| 10 | **Промо наборы в пленке ПЭТ** | `https://cpcimpex.com/services/promo-naboryi-v-plenke-pet.html` | — | Текущая вкладка | 200 OK |
| 11 | **Промо наборы в картоне** | `https://cpcimpex.com/services/promo-naboryi-v-kartone.html` | — | Текущая вкладка | 200 OK |
| 12 | **Вырубка платинки** | `https://cpcimpex.com/services/vyirubka-platinki.html` | — | Текущая вкладка | 200 OK |

---

## 🧪 Детализация тест-кейсов

### TC-01: Отображение блока и количества карточек

* **Приоритет:** High (Smoke)
* **Цель:** Проверить наличие контейнера услуг и общее количество элементов в сетке.
* **Шаги:**
  1. Найти на странице элемент `.cart_block`.
  2. Посчитать количество дочерних элементов `.cart_item`.
* **Ожидаемый результат:**
  * Контейнер `.cart_block` видим на странице.
  * Количество карточек равно ровно **12**.

---

### TC-02: Валидация разметки, контента и кликабельности элементов

* **Приоритет:** High (UI / Functional)
* **Цель:** Убедиться, что каждая карточка кликабельна и содержит корректные тексты, картинки и ссылки.
* **Шаги:**
  1. Для каждой из 12 карточек проверить состояние видимости (`visible`) и активности (`enabled`).
  2. Сверить текст тега `<h3>` с ожидаемым наименованием услуги.
  3. Проверить атрибут `href` ссылки (соответствует таблице тестовых данных).
  4. Проверить атрибут `target` (`_blank` для карточек 1 и 7, `null` для остальных).
  5. Проверить отображение `<img>` и значение атрибута `alt`.
  6. Проверить наличие бейджа с текстом `New` у первой карточки (*«Фасовка овощей и фруктов»*).
* **Ожидаемый результат:**
  * Все 12 карточек кликабельны и не заблокированы.
  * Тексты заголовков и `alt` картинок соответствуют названию услуги.
  * Ссылки и целевые атрибуты сформированы без ошибок.
  * Бейдж `.newN` присутствует только у первой карточки.

---

### TC-03: Клик и загрузка внутренних страниц услуг (10 карточек)

* **Приоритет:** Critical (Navigation & E2E)
* **Область:** Карточки № 2–6 и № 8–12.
* **Шаги:**
  1. Кликнуть по карточке услуги в `.cart_block`.
  2. Дождаться завершения навигации (`domcontentloaded`).
  3. Проверить текущий URL в адресной строке.
  4. Проверить HTTP-статус ответа сервера на загрузку документа.
  5. Проверить наличие ключевых элементов на открывшейся странице (`<title>`, `<h1>`/`<h2>`).
* **Ожидаемый результат:**
  * Происходит переход в текущей вкладке на соответствующий URL `https://cpcimpex.com/services/<slug>.html`.
  * HTTP-статус ответа сервера — **200 OK**.
  * Заголовок страницы (`<title>`) не пустой, на странице отображается контент услуги.

---

### TC-04: Клик по карточке «Топперы с начинкой под ключ» (внешний поддомен)

* **Приоритет:** High (Integration / New Tab)
* **Шаги:**
  1. Найти карточку *«Топперы с начинкой под ключ»*.
  2. Кликнуть по карточке и перехватить открытие новой вкладки (`target="_blank"`).
  3. Дождаться загрузки документа во вновь открывшейся вкладке.
  4. Проверить URL, заголовок и статус ответа целевого ресурса.
* **Ожидаемый результат:**
  * Карточка открывается в новой вкладке браузера.
  * URL вкладки содержит `https://toppers.cpcimpex.com/`.
  * HTTP-статус ответа целевого сайта — **200 OK**.
  * Заголовок открывшейся страницы содержит `toppers`.

---

### TC-05: Клик по карточке «Фасовка овощей и фруктов» (внешний домен)

* **Приоритет:** High (Integration / Broken Link Check)
* **Шаги:**
  1. Найти карточку *«Фасовка овощей и фруктов»*.
  2. Проверить значение атрибута `href` (`http://ccfresh.ru`).
  3. Кликнуть по карточке и ожидать открытие новой вкладки (`target="_blank"`).
  4. Зафиксировать статус сетевого ответа и доступность целевого ресурса.
* **Ожидаемый результат:**
  * Ссылка карточки сформирована на `http://ccfresh.ru` и открывается в новой вкладке.
  * **Фактический результат (Дефект):** Домен `ccfresh.ru` не делегирован / отсутствует DNS-запись (`NXDOMAIN` / `ENOTFOUND`). Сайт не открывается.
  * Тест фиксирует дефект внешней ссылки и сохраняет информацию в отчет.

---

# Футер сайта cpcimpex.com

**Автор:** Денис (Limmmp)
**Стек:** TypeScript + Playwright (`@playwright/test`)
**Цель:** проверить, что футер отображается целиком, все его ссылки рабочие, а телефон и почта кликабельны.

---

## Тест-кейсы

**Общее предусловие:** открыта главная страница `https://cpcimpex.com`, страница прокручена до футера.

| ID | Приоритет | Название | Шаги | Ожидаемый результат |
|---|---|---|---|---|
| TC-F01 | Medium | Футер отображается | Прокрутить страницу вниз | Футер виден |
| TC-F02 | Medium | Логотип | Найти логотип в футере | Логотип виден, ссылка ведёт на `/` |
| TC-F03 | Medium | Колонка «Фасовка» | Проверить заголовок и ссылки | Заголовок «Фасовка», 6 ссылок |
| TC-F04 | Medium | Колонка «Групповая упаковка» | Проверить заголовок и ссылки | Заголовок «Групповая упаковка», 5 ссылок |
| TC-F05 | Medium | Колонка «Другое» | Проверить заголовок и ссылки | Заголовок «Другое», 8 ссылок |
| TC-F06 | High | Телефон | Найти телефон в футере | Виден, `href="tel:+74952340707"` |
| TC-F07 | High | Email | Найти почту в футере | Видна, `href="mailto:info@cpcimpex.com"` |
| TC-F08 | Low | Копирайт | Прочитать строку копирайта | Есть «Copyright © <текущий год>» и «Все права защищены» |
| TC-F09 | **Critical** | Битые ссылки | Открыть все ссылки футера | Ни одна не отвечает 4xx/5xx — ❌ **падает, см. BUG-F01** |
| TC-F10 | High | Переход в «Контакты» | Кликнуть «Контакты» в колонке «Другое» | Открывается `/contacts.html` |

### BUG-F01 — битая ссылка «Топперы с начинкой под ключ» (404)

| Поле | Значение |
|---|---|
| **Серьёзность** | Major |
| **Шаги** | 1. Открыть `https://cpcimpex.com`<br>2. Прокрутить до футера<br>3. Нажать «Топперы с начинкой под ключ» в колонке «Фасовка» |
| **Ожидаемый результат** | Открывается `https://toppers.cpcimpex.com/` |
| **Фактический результат** | Открывается `https://cpcimpex.com/https://toppers.cpcimpex.com/` → **404** |
| **Вероятная причина** | В CMS абсолютный адрес сохранён как относительный, и к нему приклеивается адрес сайта |

---

## Автотест (TypeScript + Playwright)

Установка:

```bash
npm i -D @playwright/test
npx playwright install chromium
```

---

### `playwright.config.ts`

> ⚠️ Сайт отдаёт **пустую страницу** headless-браузеру: Chromium в headless-режиме шлёт `User-Agent` и `sec-ch-ua` со словом `HeadlessChrome`. Поэтому оба заголовка подменены на обычный Chrome. Без этого в headless падают любые тесты сайта, в том числе на Python (там то же задаётся через фикстуру `browser_context_args`).

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://cpcimpex.com',
    // Сайт отдаёт пустую страницу headless-браузеру (заголовки с "HeadlessChrome"),
    // поэтому представляемся обычным Chrome.
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    extraHTTPHeaders: { 'sec-ch-ua': '"Chromium";v="140", "Not:A-Brand";v="8"' },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```

---

### `cpcimpexFooter.spec.ts`

```ts
// Футер cpcimpex.com — автотесты. Автор: Денис (Limmmp)
import { test, expect, Page, Locator } from '@playwright/test';

// ---------- Page Object футера ----------
class FooterPage {
  readonly footer: Locator;
  readonly logoLink: Locator;
  readonly logoImage: Locator;
  readonly fasovka: Locator;
  readonly promo: Locator;
  readonly other: Locator;
  readonly copyright: Locator;
  readonly phoneLink: Locator;
  readonly emailLink: Locator;
  readonly contactsLink: Locator;

  constructor(private readonly page: Page) {
    // На странице есть скрытое мегаменю с теми же ссылками,
    // поэтому всё ищем строго внутри <footer>.
    this.footer = page.locator('footer.footer');
    this.logoLink = this.footer.locator('.logo_block a');
    this.logoImage = this.footer.getByRole('img', { name: 'CPCIMPEX.COM' });
    this.fasovka = this.footer.locator('.fasovka');
    this.promo = this.footer.locator('.promo');
    this.other = this.footer.locator('.other');
    this.copyright = this.footer.locator('.copyright');
    this.phoneLink = this.footer.getByRole('link', { name: '+7 (495) 234 0707' });
    this.emailLink = this.footer.getByRole('link', { name: 'info@cpcimpex.com' });
    this.contactsLink = this.other.getByRole('link', { name: 'Контакты', exact: true });
  }

  async goto() {
    await this.page.goto('/');
    await this.footer.scrollIntoViewIfNeeded();
  }

  // Заголовок колонки — это <p class="h3">, а не <h3>
  title(column: Locator) {
    return column.locator('p.h3');
  }

  links(column: Locator) {
    return column.getByRole('link');
  }

  // Все http-ссылки футера проверяются запросом из браузера (тот же домен)
  async brokenLinks(): Promise<string[]> {
    const urls = await this.footer
      .locator('a[href^="http"], a[href^="/"]')
      .evaluateAll((els) => [...new Set(els.map((a) => (a as HTMLAnchorElement).href))]);
    return this.page.evaluate(async (list) => {
      const res = await Promise.all(
        list.map(async (u) => {
          try {
            const r = await fetch(u);
            return r.status >= 400 ? `${r.status} ${u}` : null;
          } catch {
            return `ERR ${u}`;
          }
        })
      );
      return res.filter((x): x is string => x !== null);
    }, urls);
  }
}

// ---------- Тесты ----------
test.describe('Футер cpcimpex.com', () => {
  let page: Page;
  let footer: FooterPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    footer = new FooterPage(page);
    await footer.goto();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('TC-F01: футер отображается', async () => {
    await expect(footer.footer).toBeVisible();
  });

  test('TC-F02: логотип виден и ведёт на главную', async () => {
    await expect(footer.logoImage).toBeVisible();
    await expect(footer.logoLink).toHaveAttribute('href', '/');
  });

  test('TC-F03: колонка "Фасовка" — 6 ссылок', async () => {
    await expect(footer.title(footer.fasovka)).toHaveText('Фасовка');
    await expect(footer.links(footer.fasovka)).toHaveCount(6);
  });

  test('TC-F04: колонка "Групповая упаковка" — 5 ссылок', async () => {
    await expect(footer.title(footer.promo)).toHaveText('Групповая упаковка');
    await expect(footer.links(footer.promo)).toHaveCount(5);
  });

  test('TC-F05: колонка "Другое" — 8 ссылок', async () => {
    await expect(footer.title(footer.other)).toHaveText('Другое');
    await expect(footer.links(footer.other)).toHaveCount(8);
  });

  test('TC-F06: телефон — ссылка tel:', async () => {
    await expect(footer.phoneLink).toBeVisible();
    await expect(footer.phoneLink).toHaveAttribute('href', 'tel:+74952340707');
  });

  test('TC-F07: email — ссылка mailto:', async () => {
    await expect(footer.emailLink).toBeVisible();
    await expect(footer.emailLink).toHaveAttribute('href', 'mailto:info@cpcimpex.com');
  });

  test('TC-F08: копирайт с текущим годом', async () => {
    await expect(footer.copyright).toContainText(`Copyright © ${new Date().getFullYear()}`);
    await expect(footer.copyright).toContainText('Все права защищены');
  });

  // BUG-F01: ссылка «Топперы с начинкой под ключ» отдаёт 404.
  // test.fail() — тест ожидаемо падает; когда баг починят, Playwright сообщит.
  test('TC-F09: все ссылки футера открываются (нет 4xx/5xx)', async () => {
    test.fail(true, 'BUG-F01: «Топперы с начинкой под ключ» → 404');
    test.setTimeout(60_000);
    const broken = await footer.brokenLinks();
    expect(broken, `Битые ссылки:\n${broken.join('\n')}`).toEqual([]);
  });

  // Последний: уводит со страницы
  test('TC-F10: клик по "Контакты" открывает страницу контактов', async () => {
    await footer.contactsLink.click();
    await expect(page).toHaveURL(/\/contacts\.html$/);
  });
});
```

---

## Запуск тестов

```bash
# Все тесты футера
npx playwright test cpcimpexFooter.spec.ts

# С открытым браузером
npx playwright test cpcimpexFooter.spec.ts --headed

# UI-режим: тесты по шагам со снимками страницы
npx playwright test cpcimpexFooter.spec.ts --ui

# HTML-отчёт после прогона
npx playwright show-report
```

Результат прогона 03.11.2026: **9 passed, 1 expected fail** (TC-F09 ловит BUG-F01).

---
