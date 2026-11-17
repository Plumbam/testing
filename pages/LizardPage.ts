import { Page, Locator } from '@playwright/test';

export class LizardPage {
  readonly page: Page;
  
  // Локаторы элементов
  readonly mainHeading: Locator;
  readonly wikipediaLink: Locator;
  readonly alphabetContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Используем role-локаторы (best practice Playwright) для максимальной надежности
    this.mainHeading = page.getByRole('heading', { name: 'Ящерицы' });
    
    // Ссылка на источник
    this.wikipediaLink = page.getByRole('link', { name: 'Википедия' });
    
    // Блок алфавитной навигации (ищем по характерному началу алфавита)
    this.alphabetContainer = page.locator('text=/а\\s+б\\s+в\\s+г\\s+д/');
  }

  // Метод для перехода на страницу
  async goto() {
    await this.page.goto('https://kartaslov.ru/карта-знаний/Ящерицы');
  }
}