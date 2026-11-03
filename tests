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
