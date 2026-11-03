// Футер cpcimpex.com — автотесты. Автор: Денис (Limmmp), 03.11.2026

import { test, expect, Page } from '@playwright/test';
import { CpcimpexFooterPage } from '../pages/cpcimpexFooter.page';

test.describe('CPC ImpEx — футер сайта (одно окно браузера)', () => {
  let page: Page;
  let po: CpcimpexFooterPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    po = new CpcimpexFooterPage(page);
    await po.goto();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('1. Футер отображается', async () => {
    await expect(po.footer).toBeVisible();
  });

  test('2. Логотип виден и ведёт на главную', async () => {
    await expect(po.logoImage).toBeVisible();
    await expect(po.logoLink).toHaveAttribute('href', '/');
  });

  test('3. Колонка "Фасовка": заголовок и 6 ссылок', async () => {
    await expect(po.columnTitle(po.fasovkaColumn)).toHaveText('Фасовка');
    await expect(po.columnLinks(po.fasovkaColumn)).toHaveCount(6);
  });

  test('4. Колонка "Групповая упаковка": заголовок и 5 ссылок', async () => {
    await expect(po.columnTitle(po.promoColumn)).toHaveText('Групповая упаковка');
    await expect(po.columnLinks(po.promoColumn)).toHaveCount(5);
  });

  test('5. Колонка "Другое": заголовок и 8 ссылок', async () => {
    await expect(po.columnTitle(po.otherColumn)).toHaveText('Другое');
    await expect(po.columnLinks(po.otherColumn)).toHaveCount(8);
  });

  test('6. Телефон — кликабельная ссылка tel:', async () => {
    await expect(po.phoneLink).toBeVisible();
    await expect(po.phoneLink).toHaveAttribute('href', 'tel:+74952340707');
  });

  test('7. Email — кликабельная ссылка mailto:', async () => {
    await expect(po.emailLink).toBeVisible();
    await expect(po.emailLink).toHaveAttribute('href', 'mailto:info@cpcimpex.com');
  });

  test('8. Копирайт с текущим годом', async () => {
    const year = new Date().getFullYear();
    await expect(po.copyright).toContainText(`Copyright © ${year}`);
    await expect(po.copyright).toContainText('Все права защищены');
  });

  // Известный баг BUG-F01: ссылка «Топперы с начинкой под ключ» отдаёт 404.
  // test.fail() — тест ожидаемо падает. Когда баг починят, Playwright
  // сообщит об этом, и пометку нужно будет убрать.
  test('9. Все ссылки футера открываются (нет 4xx/5xx)', async () => {
    test.fail(true, 'BUG-F01: битая ссылка «Топперы с начинкой под ключ» → 404');
    test.setTimeout(60_000);
    const broken = await po.brokenLinks();
    expect(broken, `Битые ссылки:\n${broken.join('\n')}`).toEqual([]);
  });

  // Поведенческий тест — последний, т.к. уводит со страницы.
  test('10. Клик по "Контакты" открывает страницу контактов', async () => {
    await po.contactsLink.click();
    await expect(page).toHaveURL(/\/contacts\.html$/);
  });
});
