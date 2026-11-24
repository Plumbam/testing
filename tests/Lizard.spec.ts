import { test, expect } from '@playwright/test';

test.describe('Тестирование сайта "Ящерицы"', () => {
  
  //Перед каждым тестом переходим на главную страницу
  //Примечание: если в playwright.config.ts не задан baseURL, замените '/' на полный URL, например 'https://ваш-сайт.ru/'
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); 
  });

  test('Проверка корректной загрузки главной страницы и заголовка', async ({ page }) => {
    //Проверяем, что мы находимся на ожидаемом пути (адаптируйте регулярное выражение под реальный URL)
    await expect(page).toHaveURL(/.*\/$/); 
    
    //Альтернативная проверка заголовка: ищем h1 и проверяем текст без учета регистра
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText('Ящерицы', { ignoreCase: true });
  });

  test('Проверка наличия и интерактивности поля поиска', async ({ page }) => {
    //Заменяем 'input[type="search"]' или 'input[name="q"]' на реальный CSS-селектор поля поиска на сайте
    const searchInput = page.locator('input[type="text"], input[type="search"]').first(); 
    
    await expect(searchInput).toBeVisible();
    
    //Проверяем, что поле принимает ввод (имитация действий пользователя)
    await searchInput.fill('тестовый запрос');
    await expect(searchInput).toHaveValue('тестовый запрос');
    
    //Очищаем поле для чистоты эксперимента (опционально)
    await searchInput.clear();
    await expect(searchInput).toHaveValue('');
  });

  test('Проверка перехода в раздел "Определения" из главного меню', async ({ page }) => {
    //Ищем ссылку по точному тексту. .first() защищает от ошибок, если таких элементов несколько
    const definitionsLink = page.locator('a:has-text("Определения")').first();
    
    await expect(definitionsLink).toBeVisible();
    
    //Совершаем клик и ожидаем перехода
    await definitionsLink.click();
    
    //Проверяем, что URL изменился и содержит ключевое слово раздела (адаптируйте под реальный URL)
    await expect(page).toHaveURL(/opredeleniya|definitions/i);
    
    //Проверяем, что контекст страницы изменился (например, появился новый заголовок)
    const pageHeading = page.locator('h1, h2').first();
    await expect(pageHeading).toContainText(/определен/i);
  });

  test('Проверка наличия и содержимого футера (подвала сайта)', async ({ page }) => {
    //Замените 'footer' на реальный селектор, например '.site-footer' или '#footer'
    const footer = page.locator('footer'); 
    
    await expect(footer).toBeVisible();
    
    //Проверяем наличие типичных элементов футера (год, права, контакты)
    //Регулярное выражение ищет "2024", "2025" или фразу "Все права защищены"
    await expect(footer).toContainText(/2024|2025|Все права защищены/i);
  });
});
