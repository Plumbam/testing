# Автотесты и тест‑кейсы: блок «Нужна консультация?» (cpcimpex.com)

| Поле | Значение |
|------|----------|
| Модуль | Главная страница → форма обратной связи «Нужна консультация?» |
| URL | https://cpcimpex.com/ |
| Инструмент | Playwright (TypeScript), паттерн Page Object |
| Автор | `@your-name` *(подставьте свой ник)* |
| Дата создания | 03.11.2026 |
| Статус | Готово к прогону |

---

## 1. Тестируемый функционал (описание UI)

Блок «Нужна консультация?» содержит следующие элементы (по скриншоту и DOM главной страницы):

1. Заголовок блока — **«Нужна консультация?»**
2. Ссылка в шапке блока — **«Контакты»**
3. Подзаголовок — **«Мы всегда готовы помочь вам, просто заполните форму обратной связи ниже»**
4. Текстовое поле **«ФИО»**
5. Текстовое поле **«Email»**
6. Текстовое поле **«Телефон»**
7. Многострочное поле **«Какой у вас вопрос?»** (textarea)
8. Чекбокс согласия: *«Нажимая кнопку "Отправить", вы соглашаетесь на обработку персональных данных»*
9. Кнопка **«Отправить»** (изначально неактивна при пустой/невалидной форме)

---

## 2. Предусловия и настройка окружения

- Установлен Node.js ≥ 18 и Playwright: `npm init playwright@latest` (или `npm i -D @playwright/test`).
- В `playwright.config.ts` задан `baseURL: 'https://cpcimpex.com'` — тогда `page.goto('/')` открывает нужную страницу (см. §6).
- Браузерные бинарники установлены: `npx playwright install`.
- Тесты не требуют авторизации и моков — работают против живой страницы.

---

## 3. Тест‑кейсы

**Общее предусловие:** открыта главная страница `https://cpcimpex.com/`, выполнен скролл/ожидание до блока «Нужна консультация?».

| ID | Приоритет | Тип | Заголовок | Шаги | Ожидаемый результат | Авто‑тест |
|----|-----------|-----|-----------|------|---------------------|-----------|
| TC‑01 | P2 | UI | Заголовок блока | Найти заголовок «Нужна консультация?» | Заголовок виден, текст совпадает | test 1 |
| TC‑02 | P2 | UI | Ссылка «Контакты» | Найти ссылку «Контакты» в шапке блока | Ссылка видна и кликабельна | test 3* |
| TC‑03 | P2 | UI | Подзаголовок | Найти текст про форму обратной связи | Текст виден | test 2 |
| TC‑04 | P1 | UI | Поле «ФИО» | Найти поле ввода «ФИО» | Поле видно, доступно для ввода | test 4 |
| TC‑05 | P1 | UI | Поле «Email» | Найти поле ввода «Email» | Поле видно, доступно для ввода | test 5 |
| TC‑06 | P1 | UI | Поле «Телефон» | Найти поле ввода «Телефон» | Поле видно, доступно для ввода | test 6 |
| TC‑07 | P1 | UI | Поле вопроса | Найти textarea «Какой у вас вопрос?» | Поле видно, доступно для ввода | test 7 |
| TC‑08 | P1 | UI | Чекбокс согласия | Найти чекбокс обработки ПД | Чекбокс виден | test 8 |
| TC‑09 | P1 | UI | Кнопка «Отправить» | Найти кнопку «Отправить» | Кнопка видна | test 9 |
| TC‑10 | **P0** | Поведенческий | Активация отправки | Заполнить все поля валидно, согласие отмечено | Кнопка «Отправить» становится `enabled` | test 10 |

\* Порядок нумерации автотестов сохранён как в спеке (ссылка «Контакты» — test 3), трассировка TC↔test указана явно.

---

## 4. Структура файлов в репозитории

```
tests/
├── pages/
│   └── cpcimpexContact.page.ts     # Page Object
├── specs/
│   └── cpcimpexContact.spec.ts     # Спека (10 тестов)
└── playwright.config.ts            # baseURL + projects
```

*(Пути можно адаптировать под конвенцию вашего репозитория — импорты в спеке поправьте соответственно.)*

---

## 5. Page Object — `cpcimpexContact.page.ts`

Стиль полностью повторяет `blenderExtensions.page.ts`: ленивые `readonly Locator`, объявленные в конструкторе, и метод `goto()`. Для полей формы применён устойчивый локатор через `.or()` (placeholder **или** label), чтобы тест пережил смену вёрстки без правки спеки.

```ts
import { Page, Locator } from '@playwright/test';

export class CpcimpexContactPage {
  private readonly page: Page;

  // --- Локаторы (ленивые: резолвятся в момент действия, а не при создании) ---
  readonly consultationHeading: Locator;
  readonly consultationSubtitle: Locator;
  readonly contactsLink: Locator;

  readonly fioInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly questionTextarea: Locator;

  readonly consentCheckbox: Locator;
  readonly consentLabel: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Шапка блока
    this.consultationHeading = page.getByRole('heading', { name: 'Нужна консультация?' });
    this.consultationSubtitle = page.getByText(
      'Мы всегда готовы помочь вам, просто заполните форму обратной связи ниже'
    );
    this.contactsLink = page.getByRole('link', { name: 'Контакты' });

    // Поля формы: подписи на cpcimpex.com реализованы как placeholder у
    // underline-инпутов, но для устойчивости допускаем и настоящий <label>.
    this.fioInput = page.getByPlaceholder('ФИО').or(page.getByLabel('ФИО'));
    this.emailInput = page.getByPlaceholder('Email').or(page.getByLabel('Email'));
    this.phoneInput = page.getByPlaceholder('Телефон').or(page.getByLabel('Телефон'));
    this.questionTextarea = page
      .getByPlaceholder('Какой у вас вопрос?')
      .or(page.getByLabel('Какой у вас вопрос?'));

    // Согласие на обработку ПД (семантически input[type=checkbox]).
    this.consentCheckbox = page.getByRole('checkbox');
    this.consentLabel = page.getByText(/Нажимая кнопку .Отправить., вы соглашаетесь/);

    // Кнопка отправки (изначально disabled, активируется после валидного заполнения).
    this.submitButton = page.getByRole('button', { name: 'Отправить' });
  }

  // Действие: открыть страницу (использует baseURL из конфига = https://cpcimpex.com)
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  // Вспомогательное действие: заполнить форму валидными данными
  async fillValidForm(): Promise<void> {
    await this.fioInput.fill('Иванов Иван Иванович');
    await this.emailInput.fill('test@example.com');
    await this.phoneInput.fill('+7 999 123-45-67');
    await this.questionTextarea.fill('Здравствуйте, интересует стоимость копакинга.');

    // Чекбокс на скриншоте отмечен по умолчанию, но на всякий случай проверяем состояние.
    if (!(await this.consentCheckbox.isChecked())) {
      await this.consentCheckbox.check({ force: true });
    }
  }
}
```

---

## 6. Спека — `cpcimpexContact.spec.ts`

Паттерн идентичен `blender.spec.ts`: одно окно браузера в `beforeAll`, закрытие в `afterAll`, 10 нумерованных тестов; поведенческий тест (активация кнопки) идёт последним, чтобы не менять состояние страницы до чистых проверок видимости.

```ts
import { test, expect, Page } from '@playwright/test';
import { CpcimpexContactPage } from '../pages/cpcimpexContact.page';

test.describe('CPC ImpEx — форма «Нужна консультация?» (одно окно браузера)', () => {
  let page: Page;
  let po: CpcimpexContactPage;

  // Браузер/страница создаются ОДИН раз
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    po = new CpcimpexContactPage(page);
    await po.goto();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('1. Заголовок "Нужна консультация?"', async () => {
    await expect(po.consultationHeading).toBeVisible();
  });

  test('2. Подзаголовок про форму обратной связи', async () => {
    await expect(po.consultationSubtitle).toBeVisible();
  });

  test('3. Ссылка "Контакты"', async () => {
    await expect(po.contactsLink).toBeVisible();
  });

  test('4. Поле "ФИО"', async () => {
    await expect(po.fioInput).toBeVisible();
  });

  test('5. Поле "Email"', async () => {
    await expect(po.emailInput).toBeVisible();
  });

  test('6. Поле "Телефон"', async () => {
    await expect(po.phoneInput).toBeVisible();
  });

  test('7. Текстовое поле "Какой у вас вопрос?"', async () => {
    await expect(po.questionTextarea).toBeVisible();
  });

  test('8. Чекбокс согласия на обработку ПД', async () => {
    await expect(po.consentCheckbox).toBeVisible();
  });

  test('9. Кнопка "Отправить" видима', async () => {
    await expect(po.submitButton).toBeVisible();
  });

  // Поведенческий тест — идёт последним.
  test('10. Кнопка "Отправить" активируется после заполнения формы', async () => {
    await po.fillValidForm();
    await expect(po.submitButton).toBeEnabled();
  });
});
```

---

## 7. Фрагмент `playwright.config.ts`

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',
  use: {
    baseURL: 'https://cpcimpex.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  // projects: chromium / firefox / webkit — по вашей матрице
});
```

---

## 8. Запуск и отчёт

```bash
# Прогон только этого набора
npx playwright test cpcimpexContact.spec.ts

# С headed-браузером (для отладки)
npx playwright test cpcimpexContact.spec.ts --headed

# Просмотр HTML-отчёта после прогона
npx playwright show-report
```

---

## 9. Примечания по локаторам и поддерживаемости

- **Поля формы.** Подписи «ФИО / Email / Телефон / Какой у вас вопрос?» на `cpcimpex.com` визуально являются placeholder’ами underline‑инпутов. В PO применён `.or(getByPlaceholder, getByLabel)`: если фронтенд заменит placeholder на настоящий `<label for="...">`, спеки менять не нужно — поменяется только поведение локатора. Это и есть смысл Page Object.
- **Чекбокс согласия** сделан кастомно (синий квадрат с галочкой), но семантически остаётся `input[type=checkbox]`, поэтому `getByRole('checkbox')` + `check({ force: true })` корректны. При изменении вёрстки — fallback: `page.getByText(/Нажимая кнопку/)` как кликабельная подпись.
- **Кнопка «Отправить»** на пустой форме отрисована серой (`disabled`): `toBeVisible()` в test 9 проходит, а `toBeEnabled()` в test 10 проверяет именно переход в активное состояние после валидного заполнения — это ключевой P0‑сценарий формы.
- **Перед первым коммитом** рекомендуется прогнать `npx playwright codegen https://cpcimpex.com/` и убедиться, что выбранные локаторы резолвятся в единственный элемент (иначе Playwright упадёт с strict‑mode ошибкой — это нормально и подскажет, какой селектор уточнить).

---

## 10. Чек‑лист перед коммитом в git

- [ ] `baseURL` в конфиге указывает на `https://cpcimpex.com`.
- [ ] Локально прогнано `npx playwright test cpcimpexContact.spec.ts` — все 10 тестов зелёные.
- [ ] Нет моков/заглушек, тесты идут против живой страницы.
- [ ] Имена файлов и пути импортов соответствуют конвенции репозитория.
- [ ] При необходимости набор добавлен в CI‑джобу (smoke/регресс).
- [ ] Этот `.md` закоммичен рядом со спекой как документация тест‑кейсов.

---
---

# Автотесты и тест‑кейсы: футер сайта (cpcimpex.com)

| Поле | Значение |
|------|----------|
| Модуль | Все страницы → футер (`<footer class="footer">`) |
| URL | https://cpcimpex.com/ |
| Инструмент | Playwright (TypeScript), паттерн Page Object |
| Автор | Денис |
| Дата создания | 03.11.2026 |
| Статус | Прогнано: 9 passed, 1 expected fail (известный баг BUG‑F01) |

---

## 1. Тестируемый функционал (описание UI)

1. Логотип **CPCIMPEX.COM** со ссылкой на главную
2. Колонка **«Фасовка»** — 6 ссылок (фигурный пакет, 3‑х шовный, 4‑х шовный, Doy‑pack, топперы, «Топперы с начинкой под ключ»)
3. Колонка **«Групповая упаковка»** — 5 ссылок (промо‑наборы LDPE / ПОФ / ПЭТ / в картоне, вырубка платинки)
4. Колонка **«Другое»** — 8 ссылок (Каталог решений, Интересное об упаковке, Качество, Разработка, Предложения, Сертификаты, О компании, Контакты)
5. Строка копирайта: *«Copyright © 2026 https://www.cpcimpex.com. Все права защищены…»*
6. Телефон **+7 (495) 234 0707** (`tel:`) и почта **info@cpcimpex.com** (`mailto:`)

> На странице есть скрытое мегаменю (`section.megamenu`) с теми же ссылками, поэтому все локаторы ограничены областью `footer.footer`.

---

## 2. Предусловия и настройка окружения

Те же, что в разделе формы «Нужна консультация?» (Node.js ≥ 18, `@playwright/test`, `baseURL: 'https://cpcimpex.com'`), **плюс обязательная правка конфига — см. §8.** Без неё сайт отдаёт headless‑браузеру пустую страницу и падают все тесты, в том числе тесты формы.

---

## 3. Тест‑кейсы

**Общее предусловие:** открыта главная страница `https://cpcimpex.com/`, выполнена прокрутка до футера.

| ID | Приоритет | Тип | Заголовок | Шаги | Ожидаемый результат | Авто‑тест |
|----|-----------|-----|-----------|------|---------------------|-----------|
| TC‑F01 | P2 | UI | Футер отображается | Прокрутить страницу вниз | Футер виден | test 1 |
| TC‑F02 | P2 | UI | Логотип | Найти логотип в футере | Логотип виден, ссылка ведёт на `/` | test 2 |
| TC‑F03 | P2 | UI | Колонка «Фасовка» | Проверить заголовок и ссылки колонки | Заголовок «Фасовка», 6 ссылок | test 3 |
| TC‑F04 | P2 | UI | Колонка «Групповая упаковка» | Проверить заголовок и ссылки колонки | Заголовок «Групповая упаковка», 5 ссылок | test 4 |
| TC‑F05 | P2 | UI | Колонка «Другое» | Проверить заголовок и ссылки колонки | Заголовок «Другое», 8 ссылок | test 5 |
| TC‑F06 | P1 | UI | Телефон | Найти телефон в футере | Виден, `href="tel:+74952340707"` | test 6 |
| TC‑F07 | P1 | UI | Email | Найти почту в футере | Видна, `href="mailto:info@cpcimpex.com"` | test 7 |
| TC‑F08 | P3 | Контент | Копирайт | Прочитать строку копирайта | Содержит «Copyright © <текущий год>» и «Все права защищены» | test 8 |
| TC‑F09 | **P0** | Функциональный | Битые ссылки | Запросить все http‑ссылки футера | Ни одна не отвечает 4xx/5xx | test 9 ❌ **BUG‑F01** |
| TC‑F10 | P1 | Поведенческий | Переход в «Контакты» | Кликнуть «Контакты» в колонке «Другое» | Открывается `/contacts.html` | test 10 |

---

## 4. Найденные дефекты

### BUG‑F01 — Битая ссылка «Топперы с начинкой под ключ» (404)

| Поле | Значение |
|------|----------|
| Серьёзность | Major (ведёт на несуществующую страницу, теряется переход на сайт топперов) |
| Приоритет | High |
| Где | Футер → колонка «Фасовка» → «Топперы с начинкой под ключ» (то же в скрытом мегаменю) |
| Шаги | 1. Открыть https://cpcimpex.com/ <br>2. Прокрутить до футера <br>3. Нажать «Топперы с начинкой под ключ» |
| Ожидаемый результат | Открывается https://toppers.cpcimpex.com/ |
| Фактический результат | Открывается `https://cpcimpex.com/https://toppers.cpcimpex.com/` → **404** |
| Причина (предположительно) | В CMS абсолютный URL записан как относительный, и к нему добавляется адрес сайта |
| Автотест | test 9 (помечен `test.fail()`; когда баг починят, Playwright сообщит, и пометку нужно снять) |

---

## 5. Структура файлов в репозитории

```
tests/
├── pages/
│   └── cpcimpexFooter.page.ts     # Page Object
├── specs/
│   └── cpcimpexFooter.spec.ts     # Спека (10 тестов)
└── playwright.config.ts           # общий с формой консультации, см. §8
```

---

## 6. Page Object — `cpcimpexFooter.page.ts`

```ts
import { Page, Locator } from '@playwright/test';

export class CpcimpexFooterPage {
  private readonly page: Page;

  // --- Локаторы (ленивые: резолвятся в момент действия) ---
  readonly footer: Locator;
  readonly logoLink: Locator;
  readonly logoImage: Locator;

  // Колонки меню
  readonly fasovkaColumn: Locator;
  readonly promoColumn: Locator;
  readonly otherColumn: Locator;

  // Нижняя строка
  readonly copyright: Locator;
  readonly phoneLink: Locator;
  readonly emailLink: Locator;
  readonly contactsLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // На странице есть скрытое мегаменю с теми же ссылками,
    // поэтому все локаторы ищем строго внутри <footer>.
    this.footer = page.locator('footer.footer');

    this.logoLink = this.footer.locator('.logo_block a');
    this.logoImage = this.footer.getByRole('img', { name: 'CPCIMPEX.COM' });

    this.fasovkaColumn = this.footer.locator('.fasovka');
    this.promoColumn = this.footer.locator('.promo');
    this.otherColumn = this.footer.locator('.other');

    this.copyright = this.footer.locator('.copyright');
    this.phoneLink = this.footer.getByRole('link', { name: '+7 (495) 234 0707' });
    this.emailLink = this.footer.getByRole('link', { name: 'info@cpcimpex.com' });
    this.contactsLink = this.otherColumn.getByRole('link', { name: 'Контакты', exact: true });
  }

  // Открыть главную (baseURL = https://cpcimpex.com) и прокрутить к футеру
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.footer.scrollIntoViewIfNeeded();
  }

  // Заголовок колонки (на сайте это <p class="h3">, а не <h3>)
  columnTitle(column: Locator): Locator {
    return column.locator('p.h3');
  }

  // Ссылки колонки
  columnLinks(column: Locator): Locator {
    return column.getByRole('link');
  }

  // Все http-ссылки футера (без tel: и mailto:)
  async httpLinks(): Promise<string[]> {
    const hrefs = await this.footer
      .locator('a[href]')
      .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
    return [...new Set(hrefs.filter((h) => h.startsWith('http')))];
  }

  // Коды ответа по всем ссылкам сразу (параллельно). Запросы идут из браузера:
  // тот же домен, без CORS и с теми же заголовками, что у страницы.
  async brokenLinks(): Promise<string[]> {
    const urls = await this.httpLinks();
    return this.page.evaluate(async (list) => {
      const results = await Promise.all(
        list.map(async (u) => {
          try {
            const res = await fetch(u, { redirect: 'follow' });
            return res.status >= 400 ? `${res.status} ${u}` : null;
          } catch {
            return `ERR ${u}`;
          }
        })
      );
      return results.filter((r): r is string => r !== null);
    }, urls);
  }
}
```

---

## 7. Спека — `cpcimpexFooter.spec.ts`

```ts
import { test, expect, Page } from '@playwright/test';
import { CpcimpexFooterPage } from '../pages/cpcimpexFooter.page';

test.describe('CPC ImpEx — футер сайта (одно окно браузера)', () => {
  let page: Page;
  let po: CpcimpexFooterPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    po = new CpcimpexFooterPage(page);
    await po.goto();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('1. Футер отображается', async () => {
    await expect(po.footer).toBeVisible();
  });

  test('2. Логотип виден и ведёт на главную', async () => {
    await expect(po.logoImage).toBeVisible();
    await expect(po.logoLink).toHaveAttribute('href', '/');
  });

  test('3. Колонка "Фасовка": заголовок и 6 ссылок', async () => {
    await expect(po.columnTitle(po.fasovkaColumn)).toHaveText('Фасовка');
    await expect(po.columnLinks(po.fasovkaColumn)).toHaveCount(6);
  });

  test('4. Колонка "Групповая упаковка": заголовок и 5 ссылок', async () => {
    await expect(po.columnTitle(po.promoColumn)).toHaveText('Групповая упаковка');
    await expect(po.columnLinks(po.promoColumn)).toHaveCount(5);
  });

  test('5. Колонка "Другое": заголовок и 8 ссылок', async () => {
    await expect(po.columnTitle(po.otherColumn)).toHaveText('Другое');
    await expect(po.columnLinks(po.otherColumn)).toHaveCount(8);
  });

  test('6. Телефон — кликабельная ссылка tel:', async () => {
    await expect(po.phoneLink).toBeVisible();
    await expect(po.phoneLink).toHaveAttribute('href', 'tel:+74952340707');
  });

  test('7. Email — кликабельная ссылка mailto:', async () => {
    await expect(po.emailLink).toBeVisible();
    await expect(po.emailLink).toHaveAttribute('href', 'mailto:info@cpcimpex.com');
  });

  test('8. Копирайт с текущим годом', async () => {
    const year = new Date().getFullYear();
    await expect(po.copyright).toContainText(`Copyright © ${year}`);
    await expect(po.copyright).toContainText('Все права защищены');
  });

  // Известный баг BUG-F01: ссылка «Топперы с начинкой под ключ» отдаёт 404.
  // test.fail() — тест ожидаемо падает. Когда баг починят, Playwright
  // сообщит об этом, и пометку нужно будет убрать.
  test('9. Все ссылки футера открываются (нет 4xx/5xx)', async () => {
    test.fail(true, 'BUG-F01: битая ссылка «Топперы с начинкой под ключ» → 404');
    test.setTimeout(60_000);
    const broken = await po.brokenLinks();
    expect(broken, `Битые ссылки:\n${broken.join('\n')}`).toEqual([]);
  });

  // Поведенческий тест — последний, т.к. уводит со страницы.
  test('10. Клик по "Контакты" открывает страницу контактов', async () => {
    await po.contactsLink.click();
    await expect(page).toHaveURL(/\/contacts\.html$/);
  });
});
```

---

## 8. ⚠️ Правка `playwright.config.ts` (нужна всей команде)

**Проблема:** в headless‑режиме Chromium отправляет заголовок `sec-ch-ua` с брендом `"HeadlessChrome"` (и такой же User‑Agent). Сайт cpcimpex.com на такие запросы отвечает **HTTP 200 с пустым телом** — страница пустая, падает любой тест, включая тесты формы консультации. В режиме `--headed` проблемы нет, поэтому её легко не заметить.

Проверено curl’ом: с `User-Agent: ...HeadlessChrome/...` сайт отдаёт 0 байт, с обычным `Chrome/...` — 31 КБ.

**Решение:** подменить оба заголовка в `use`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',
  use: {
    baseURL: 'https://cpcimpex.com',
    // Сайт отдаёт пустую страницу headless-браузеру — маскируемся под обычный Chrome
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    extraHTTPHeaders: { 'sec-ch-ua': '"Chromium";v="140", "Not:A-Brand";v="8"' },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```

> Это касается и Python‑набора из `testing.md`: там то же самое задаётся через фикстуру `browser_context_args` (`user_agent` и `extra_http_headers`).

---

## 9. Запуск

```bash
npx playwright test cpcimpexFooter.spec.ts
npx playwright test cpcimpexFooter.spec.ts --headed
npx playwright show-report
```

Результат прогона 03.11.2026 (Chromium, headless):

```
  ok  1 … 8   — passed
  x   9       — expected fail (BUG-F01: 404 https://cpcimpex.com/https://toppers.cpcimpex.com/)
  ok 10       — passed
  10 passed (9.5s)
```
