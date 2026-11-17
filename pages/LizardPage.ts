import { Page, Locator } from '@playwright/test';

export class LizardPage {
  readonly page: Page;

  // Локаторы элементов
  readonly mainHeading: Locator;
  readonly wikipediaLink: Locator;
  readonly alphabetContainer: Locator;
  readonly menuSynonyms: Locator;
  readonly menuDefinitions: Locator;
  readonly menuAssociations: Locator;
  readonly feedbackLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Используем role-локаторы (best practice Playwright) для максимальной надежности
    this.mainHeading = page.getByRole('heading', { name: 'Ящерицы' });

    // Ссылка на источник
    this.wikipediaLink = page.getByRole('link', { name: 'Википедия' });

    // Блок алфавитной навигации (ищем по характерному началу алфавита)
    this.alphabetContainer = page.locator('text=/а\\s+б\\s+в\\s+г\\s+д/');

    this.menuSynonyms = page.getByRole('link', { name: 'Синонимы', exact: true }).first();
    this.menuDefinitions = page.getByRole('link', { name: 'Толкования', exact: true }).first();
    this.menuAssociations = page.getByRole('link', { name: 'Ассоциации', exact: true }).first();
    this.feedbackLink = page.getByRole('link', { name: 'Обратная связь', exact: true }).first();
  }

  // Метод для перехода на страницу
  async goto() {
    await this.page.goto('https://kartaslov.ru/карта-знаний/Ящерицы');
  }
}
