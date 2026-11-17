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
});