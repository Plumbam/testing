

---

# Тестирование сайта cpcimpex.com

**Стек:** Python + Playwright + pytest
**Цель:** безопасная проверка загрузки страницы, отображения блоков, Cookie-баннера, навигации и формы обратной связи без отправки реальных заявок.

---

## Тест-кейсы

### TC-001 — Загрузка главной страницы и заголовок

| Поле | Значение |
|---|---|
| **ID** | TC-001 |
| **Название** | Проверка загрузки главной страницы и заголовка |
| **Приоритет** | High |
| **Предусловия** | Сайт `https://cpcimpex.com` доступен |
| **Шаги** | 1. Открыть `https://cpcimpex.com`<br>2. Дождаться загрузки страницы |
| **Ожидаемый результат** | Страница загружается (HTTP 200), в `<title>` присутствует `CPCIMPEX`, в `body` есть видимый контент |


## Автотест (Python + Playwright + pytest)

Установка:

```bash
pip install -r requirements.txt
playwright install chromium
```

---

### `conftest.py`

```python
import pytest
from playwright.sync_api import Page

BASE_URL = "https://cpcimpex.com"


@pytest.fixture
def main_page(page: Page) -> Page:
    """Открывает главную страницу и закрывает Cookie-баннер, если он есть."""
    page.goto(BASE_URL, wait_until="domcontentloaded")

    # Пробуем закрыть Cookie-баннер разными вариантами текста кнопки
    for text in ["Принять", "Согласен", "Разрешить", "OK", "Accept"]:
        btn = page.get_by_role("button", name=text)
        if btn.count() > 0 and btn.first.is_visible():
            btn.first.click()
            break

    return page
```

---

### `test_cpcimpex.py`

```python
import re
import pytest
from playwright.sync_api import Page, expect


# ---------- TC-001 ----------
def test_page_loads_and_title(main_page: Page):
    """TC-001: главная страница загружается, title содержит CPCIMPEX."""
    expect(main_page).to_have_title(re.compile("CPCIMPEX", re.IGNORECASE))
    expect(main_page.locator("body")).to_be_visible()


# ---------- TC-002 ----------
@pytest.mark.parametrize("section_text", [
    "Инновации в упаковке",
    "Лидер на рынке",
    "Наши клиенты",
])

```

---

## Запуск тестов

```bash
# Все тесты
pytest -v

# Только один тест-кейс
pytest test_cpcimpex.py::test_page_loads_and_title -v

# С открытым браузером (для отладки)
pytest -v --headed

# Короткий вывод ошибок
pytest -v --tb=short
```

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
