// @ts-check
import { test, expect } from '@playwright/test';
import { cpcimpexExtensionsPage, CARDS_DATA } from '../pages/cpcimpexExtensionsPage.js';

test.describe('Проверка карточек услуг на сайте cpcimpex.com', () => {
  /** @type {cpcimpexExtensionsPage} */
  let cpcimpexPage;

  test.beforeEach(async ({ page }) => {
    cpcimpexPage = new cpcimpexExtensionsPage(page);
    await cpcimpexPage.goto();
  });

  test.describe('Отображение и валидация разметки карточек', () => {
    test('Блок карточек услуг отображается и содержит ровно 12 карточек', async () => {
      await expect(cpcimpexPage.cartBlock).toBeVisible();
      await expect(cpcimpexPage.cards).toHaveCount(12);
    });

    test('Каждая карточка содержит корректный заголовок, ссылку, картинку и кликабельна', async () => {
      for (const cardData of CARDS_DATA) {
        const cardLocator = cpcimpexPage.getCardByTitle(cardData.title);

        await expect(cardLocator).toBeVisible();
        await expect(cardLocator).toBeEnabled();

        const href = await cardLocator.getAttribute('href');
        expect(href, `Ссылка карточки "${cardData.title}" должна соответствовать ${cardData.expectedHref}`).toBe(cardData.expectedHref);

        const target = await cardLocator.getAttribute('target');
        expect(target, `Атрибут target карточки "${cardData.title}"`).toBe(cardData.target);

        const imgLocator = cardLocator.locator('img');
        await expect(imgLocator).toBeVisible();
        const alt = await imgLocator.getAttribute('alt');
        expect(alt).toBe(cardData.imageAlt);

        if (cardData.hasNewBadge) {
          const badge = cardLocator.locator('.newN');
          await expect(badge).toBeVisible();
          await expect(badge).toHaveText('New');
        }
      }
    });
  });

  test.describe('Проверка кликов, переходов и загрузки внутренних страниц услуг', () => {
    const internalCards = CARDS_DATA.filter((c) => !c.isExternal);

    for (const cardData of internalCards) {
      test(`Карточка "${cardData.title}": кликабельна и загружает целевую страницу`, async ({ page }) => {
        const cardLocator = cpcimpexPage.getCardByTitle(cardData.title);

        await expect(cardLocator).toBeVisible();
        await expect(cardLocator).toBeEnabled();

        await Promise.all([
          page.waitForURL(cardData.expectedHref),
          cardLocator.click(),
        ]);

        await expect(page).toHaveURL(cardData.expectedHref);

        const httpResponse = await page.request.get(cardData.expectedHref);
        expect(httpResponse.status(), `HTTP статус ответа для ${cardData.expectedHref}`).toBe(200);

        await page.waitForLoadState('domcontentloaded');
        const pageTitle = await page.title();
        expect(pageTitle.length, 'Заголовок страницы не должен быть пустым').toBeGreaterThan(0);
        await expect(page.locator('h1, h2').first()).toBeVisible();
      });
    }
  });

  test.describe('Проверка кликов и переходов для внешних карточек (target="_blank")', () => {
    test('Карточка "Топперы с начинкой под ключ": кликабельна, открывает новую вкладку и сайт toppers.cpcimpex.com загружается', async ({ context }) => {
      const cardLocator = cpcimpexPage.turnkeyToppersCard;

      await expect(cardLocator).toBeVisible();
      await expect(cardLocator).toBeEnabled();
      expect(await cardLocator.getAttribute('href')).toBe('https://toppers.cpcimpex.com/');
      expect(await cardLocator.getAttribute('target')).toBe('_blank');

      const [popup] = await Promise.all([
        context.waitForEvent('page'),
        cardLocator.click(),
      ]);

      await popup.waitForLoadState('domcontentloaded');
      expect(popup.url()).toContain('toppers.cpcimpex.com');

      const title = await popup.title();
      expect(title).toContain('toppers');

      const response = await popup.request.get('https://toppers.cpcimpex.com/');
      expect(response.status()).toBe(200);

      await popup.close();
    });

    test('Карточка "Фасовка овощей и фруктов": кликабельна, отправляет на http://ccfresh.ru и фиксирует статус доступности', async ({ context }) => {
      const cardLocator = cpcimpexPage.fruitCard;

      await expect(cardLocator).toBeVisible();
      await expect(cardLocator).toBeEnabled();
      const href = await cardLocator.getAttribute('href');
      expect(href).toBe('http://ccfresh.ru');
      expect(await cardLocator.getAttribute('target')).toBe('_blank');

      const [popup] = await Promise.all([
        context.waitForEvent('page'),
        cardLocator.click(),
      ]);

      let isLoaded = false;
      let errorReason = '';

      try {
        const response = await popup.request.get(href, { timeout: 7000 });
        isLoaded = response.status() === 200;
      } catch (err) {
        errorReason = err.message;
      }

      console.log(`[Отчет доступности: Фасовка овощей и фруктов] Href: ${href}, Loaded: ${isLoaded}, Причина: ${errorReason}`);

      expect(href).toBe('http://ccfresh.ru');

      await popup.close();
    });
  });
});
