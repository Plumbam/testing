

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

---

### TC-002 — Видимость ключевых смысловых блоков

| Поле | Значение |
|---|---|
| **ID** | TC-002 |
| **Название** | Проверка отображения ключевых блоков главной страницы |
| **Приоритет** | High |
| **Предусловия** | Главная страница открыта |
| **Шаги** | 1. Открыть `https://cpcimpex.com`<br>2. Проверить видимость блоков: «Инновации в упаковке», «Лидер на рынке», «Наши клиенты» |
| **Ожидаемый результат** | Все три блока присутствуют в DOM и видимы пользователю |

---

### TC-003 — Наличие и работа Cookie-баннера

| Поле | Значение |
|---|---|
| **ID** | TC-003 |
| **Название** | Проверка отображения и закрытия Cookie-баннера |
| **Приоритет** | Medium |
| **Предусловия** | Главная страница открыта в чистой сессии (без сохранённых cookie) |
| **Шаги** | 1. Открыть `https://cpcimpex.com`<br>2. Дождаться появления Cookie-баннера<br>3. Нажать кнопку принятия/закрытия |
| **Ожидаемый результат** | Баннер появляется при первом визите и исчезает после нажатия кнопки |

---

### TC-004 — Навигация по пунктам меню

| Поле | Значение |
|---|---|
| **ID** | TC-004 |
| **Название** | Проверка перехода по пункту меню «Контакты» |
| **Приоритет** | Medium |
| **Предусловия** | Главная страница открыта, Cookie-баннер закрыт |
| **Шаги** | 1. Открыть `https://cpcimpex.com`<br>2. Найти в меню ссылку «Контакты»<br>3. Кликнуть по ней |
| **Ожидаемый результат** | Происходит переход на страницу контактов, URL меняется, страница загружается без ошибок |

---

### TC-005 — Видимость формы обратной связи

| Поле | Значение |
|---|---|
| **ID** | TC-005 |
| **Название** | Проверка наличия формы обратной связи и её полей |
| **Приоритет** | High |
| **Предусловия** | Главная страница открыта, Cookie-баннер закрыт |
| **Шаги** | 1. Открыть `https://cpcimpex.com`<br>2. Прокрутить до блока «Нужна консультация?»<br>3. Проверить наличие полей ввода и кнопки «Отправить» |
| **Ожидаемый результат** | Форма видима, содержит минимум одно текстовое поле и кнопку «Отправить» |


---

### TC-006 — Проверка структуры доступности (Aria Snapshot)

| Поле | Значение |
|---|---|
| **ID** | TC-006 |
| **Название** | Проверка доступности ключевых элементов (a11y) |
| **Приоритет** | Low |
| **Предусловия** | Главная страница открыта |
| **Шаги** | 1. Открыть `https://cpcimpex.com`<br>2. Снять снимок дерева доступности страницы |
| **Ожидаемый результат** | В снимке присутствуют заголовки (`heading`) с осмысленными именами, у кнопок есть доступные имена |

---

## Автотест (Python + Playwright + pytest)

### Структура проекта

```
PythonWright/
├── conftest.py
├── test_cpcimpex.py
└── requirements.txt
```

---

### `requirements.txt`

```txt
pytest==8.3.3
playwright==1.47.0
pytest-playwright==0.5.1
```

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
def test_key_sections_visible(main_page: Page, section_text: str):
    """TC-002: ключевые смысловые блоки видны на странице."""
    section = main_page.get_by_text(section_text, exact=False).first
    section.scroll_into_view_if_needed()
    expect(section).to_be_visible(timeout=10_000)


# ---------- TC-003 ----------
def test_cookie_banner_appears_and_closes(page: Page):
    """TC-003: Cookie-баннер появляется при первом визите и закрывается."""
    page.context.clear_cookies()
    page.goto("https://cpcimpex.com", wait_until="domcontentloaded")

    cookie_button = None
    for text in ["Принять", "Согласен", "Разрешить", "OK", "Accept"]:
        candidate = page.get_by_role("button", name=text)
        if candidate.count() > 0 and candidate.first.is_visible():
            cookie_button = candidate.first
            break

    assert cookie_button is not None, "Cookie-баннер не появился или кнопка не найдена"
    cookie_button.click()

    expect(cookie_button).not_to_be_visible(timeout=5_000)


# ---------- TC-004 ----------
def test_navigation_to_contacts(main_page: Page):
    """TC-004: переход по пункту меню 'Контакты' открывает страницу контактов."""
    contacts_link = main_page.get_by_role("link", name=re.compile("Контакты", re.IGNORECASE)).first
    expect(contacts_link).to_be_visible(timeout=10_000)

    contacts_link.click()
    main_page.wait_for_load_state("domcontentloaded")

    expect(main_page).to_have_url(re.compile(r"contact", re.IGNORECASE), timeout=10_000)


# ---------- TC-005 ----------
def test_contact_form_visible(main_page: Page):
    """TC-005: форма обратной связи и её элементы видимы на странице."""
    heading = main_page.get_by_text("Нужна консультация?", exact=False).first
    heading.scroll_into_view_if_needed()
    expect(heading).to_be_visible(timeout=10_000)

    text_inputs = main_page.locator(
        "input[type='text'], input[type='tel'], input[type='email'], textarea"
    )
    assert text_inputs.count() > 0, "На странице не найдено ни одного поля формы"

    submit_button = main_page.get_by_role(
        "button", name=re.compile("Отправить", re.IGNORECASE)
    ).first
    expect(submit_button).to_be_visible(timeout=5_000)


# ---------- TC-006 ----------
def test_accessibility_snapshot_has_headings(main_page: Page):
    """TC-006: в дереве доступности есть заголовки с осмысленными именами."""
    snapshot = main_page.accessibility.snapshot()

    def collect_roles(node, role):
        found = []
        if node.get("role") == role:
            found.append(node)
        for child in node.get("children", []) or []:
            found.extend(collect_roles(child, role))
        return found

    headings = collect_roles(snapshot, "heading")
    assert len(headings) > 0, "В дереве доступности нет ни одного заголовка"
    assert any(h.get("name", "").strip() for h in headings), \
        "У заголовков отсутствуют доступные имена"
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
