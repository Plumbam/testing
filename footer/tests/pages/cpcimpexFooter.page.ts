// Футер cpcimpex.com — автотесты. Автор: Денис (Limmmp), 03.11.2026

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
