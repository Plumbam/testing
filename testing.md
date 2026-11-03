

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
