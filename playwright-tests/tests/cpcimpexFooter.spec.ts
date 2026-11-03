// Футер cpcimpex.com — автотесты. Автор: Денис (Limmmp)
import { test, expect, Page, Locator } from '@playwright/test';

// ---------- Page Object футера ----------
class FooterPage {
  readonly footer: Locator;
  readonly logoLink: Locator;
  readonly logoImage: Locator;
  readonly fasovka: Locator;
  readonly promo: Locator;
  readonly other: Locator;
  readonly copyright: Locator;
  readonly phoneLink: Locator;
  readonly emailLink: Locator;
  readonly contactsLink: Locator;

  constructor(private readonly page: Page) {
    // На странице есть скрытое мегаменю с теми же ссылками,
    // поэтому всё ищем строго внутри <footer>.
    this.footer = page.locator('footer.footer');
    this.logoLink = this.footer.locator('.logo_block a');
    this.logoImage = this.footer.getByRole('img', { name: 'CPCIMPEX.COM' });
    this.fasovka = this.footer.locator('.fasovka');
    this.promo = this.footer.locator('.promo');
    this.other = this.footer.locator('.other');
    this.copyright = this.footer.locator('.copyright');
    this.phoneLink = this.footer.getByRole('link', { name: '+7 (495) 234 0707' });
    this.emailLink = this.footer.getByRole('link', { name: 'info@cpcimpex.com' });
    this.contactsLink = this.other.getByRole('link', { name: 'Контакты', exact: true });
  }

  async goto() {
    await this.page.goto('/');
    await this.footer.scrollIntoViewIfNeeded();
  }

  // Заголовок колонки — это <p class="h3">, а не <h3>
  title(column: Locator) {
    return column.locator('p.h3');
  }

  links(column: Locator) {
    return column.getByRole('link');
  }

  // Все http-ссылки футера проверяются запросом из браузера (тот же домен)
  async brokenLinks(): Promise<string[]> {
    const urls = await this.footer
      .locator('a[href^="http"], a[href^="/"]')
      .evaluateAll((els) => [...new Set(els.map((a) => (a as HTMLAnchorElement).href))]);
    return this.page.evaluate(async (list) => {
      const res = await Promise.all(
        list.map(async (u) => {
          try {
            const r = await fetch(u);
            return r.status >= 400 ? `${r.status} ${u}` : null;
          } catch {
            return `ERR ${u}`;
          }
        })
      );
      return res.filter((x): x is string => x !== null);
    }, urls);
  }
}

// ---------- Тесты ----------
test.describe('Футер cpcimpex.com', () => {
  let page: Page;
  let footer: FooterPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    footer = new FooterPage(page);
    await footer.goto();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('TC-F01: футер отображается', async () => {
    await expect(footer.footer).toBeVisible();
  });

  test('TC-F02: логотип виден и ведёт на главную', async () => {
    await expect(footer.logoImage).toBeVisible();
    await expect(footer.logoLink).toHaveAttribute('href', '/');
  });

  test('TC-F03: колонка "Фасовка" — 6 ссылок', async () => {
    await expect(footer.title(footer.fasovka)).toHaveText('Фасовка');
    await expect(footer.links(footer.fasovka)).toHaveCount(6);
  });

  test('TC-F04: колонка "Групповая упаковка" — 5 ссылок', async () => {
    await expect(footer.title(footer.promo)).toHaveText('Групповая упаковка');
    await expect(footer.links(footer.promo)).toHaveCount(5);
  });

  test('TC-F05: колонка "Другое" — 8 ссылок', async () => {
    await expect(footer.title(footer.other)).toHaveText('Другое');
    await expect(footer.links(footer.other)).toHaveCount(8);
  });

  test('TC-F06: телефон — ссылка tel:', async () => {
    await expect(footer.phoneLink).toBeVisible();
    await expect(footer.phoneLink).toHaveAttribute('href', 'tel:+74952340707');
  });

  test('TC-F07: email — ссылка mailto:', async () => {
    await expect(footer.emailLink).toBeVisible();
    await expect(footer.emailLink).toHaveAttribute('href', 'mailto:info@cpcimpex.com');
  });

  test('TC-F08: копирайт с текущим годом', async () => {
    await expect(footer.copyright).toContainText(`Copyright © ${new Date().getFullYear()}`);
    await expect(footer.copyright).toContainText('Все права защищены');
  });

  // BUG-F01: ссылка «Топперы с начинкой под ключ» отдаёт 404.
  // test.fail() — тест ожидаемо падает; когда баг починят, Playwright сообщит.
  test('TC-F09: все ссылки футера открываются (нет 4xx/5xx)', async () => {
    test.fail(true, 'BUG-F01: «Топперы с начинкой под ключ» → 404');
    test.setTimeout(60_000);
    const broken = await footer.brokenLinks();
    expect(broken, `Битые ссылки:\n${broken.join('\n')}`).toEqual([]);
  });

  // Последний: уводит со страницы
  test('TC-F10: клик по "Контакты" открывает страницу контактов', async () => {
    await footer.contactsLink.click();
    await expect(page).toHaveURL(/\/contacts\.html$/);
  });
});
