import { test, expect } from '@playwright/test';
import { LizardPage } from '../pages/LizardPage';

test.describe('Карта знаний: Ящерицы (Page Object Model)', () => {
  let lizardPage: LizardPage;

  // Перед каждым тестом создаем новый экземпляр Page Object и переходим на страницу
  test.beforeEach(async ({ page }) => {
    lizardPage = new LizardPage(page);
    await lizardPage.goto();
  });

  test('Тест 1: Проверка наличия и корректности главного заголовка', async () => {
    // Проверяем, что заголовок виден на странице
    await expect(lizardPage.mainHeading).toBeVisible();
    // Проверяем точное совпадение текста
    await expect(lizardPage.mainHeading).toHaveText('Ящерицы');
  });

  test('Тест 2: Проверка наличия алфавитной навигации', async () => {
    // Проверяем, что блок с алфавитом отображается
    await expect(lizardPage.alphabetContainer).toBeVisible();
    // Дополнительная проверка: убеждаемся, что текст содержит последовательность букв
    await expect(lizardPage.alphabetContainer).toContainText('а б в г д');
  });

  test('Тест 3: Проверка корректности ссылки на источник Википедия', async () => {
    // Проверяем, что ссылка видна
    await expect(lizardPage.wikipediaLink).toBeVisible();
    // Проверяем, что атрибут href содержит домен wikipedia.org (регистронезависимо)
    await expect(lizardPage.wikipediaLink).toHaveAttribute('href', /wikipedia\.org/i);
  });

  test('Тест 4: Проверка наличия основных пунктов меню', async () => {
    await expect(lizardPage.menuSynonyms).toBeVisible();
    await expect(lizardPage.menuDefinitions).toBeVisible();
    await expect(lizardPage.menuAssociations).toBeVisible();
  });

  test('Тест 5: Проверка перехода в раздел Ассоциации через меню', async ({ page }) => {
    await lizardPage.menuAssociations.click();
    await expect(page).toHaveURL(/assotsiatsii-k-slovu/);
  });

  test('Тест 6: Проверка перехода на страницу Обратная связь', async ({ page }) => {
    await expect(lizardPage.feedbackLink).toBeVisible();
    await lizardPage.feedbackLink.click();
    await expect(page).toHaveURL(/(обратная-связь|%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D0%BD%D0%B0%D1%8F)/i);
  });
});
 test('Тест 7: Проверка наличия поля поиска', async ({ page }) => {
    // Ищем поле ввода по типу или плейсхолдеру. 
    // Замените 'input[type="search"]' на реальный селектор, если он другой (например, '.search-input')
    const searchInput = page.locator('input[type="text"], input[type="search"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('тест');
    await expect(searchInput).toHaveValue('тест');
  });

  test('Тест 8: Проверка наличия изображений ящериц на странице', async ({ page }) => {
    const images = page.locator('img');
    await expect(images.first()).toBeVisible();
    const firstImageAlt = await images.first().getAttribute('alt');
    expect(firstImageAlt).toBeTruthy();
  });

  test('Тест 9: Проверка перехода по ссылке "Википедия" (внешний ресурс)', async ({ page }) => {
    const wikiLink = page.locator('a:has-text("Википедия")').first();
    await expect(wikiLink).toBeVisible();
    const href = await wikiLink.getAttribute('href');
    expect(href).toContain('wikipedia.org');
  });
