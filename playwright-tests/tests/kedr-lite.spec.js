
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const APP_URL = pathToFileURL(path.resolve(__dirname, '..', 'kedr_lite.html')).href;


async function openApp(page, randoms = []) {
  await page.addInitScript((seq) => {
    const queue = [...seq];
    Math.random = () => (queue.length ? queue.shift() : 0.99);
  }, randoms);
  await page.goto(APP_URL);
}

async function pay(page, amount) {
  await page.locator('#amount').fill(amount);
  await page.locator('#pay').click();
  await expect(page.locator('#status')).not.toHaveText(/^(Обработка…)?$/, { timeout: 20_000 });
}

async function totalCharged(page) {
  const text = await page.locator('#total').textContent();
  return Number(text.replace(/\s/g, ''));
}


test.describe('Кедр-lite: штатный сценарий', () => {
  test('GREEN: оплата 500 ₽ проходит, статус «Оплата прошла»', async ({ page }) => {
    await openApp(page);

    await pay(page, '500');

    await expect(page.locator('#status')).toContainText('Оплата прошла');
    await expect(page.locator('#total')).toHaveText('500');
    await expect(page.locator('#log tbody')).toContainText('списано успешно: 500 ₽');
  });
});


test.describe('Кедр-lite: баги (красные тесты)', () => {

  test('RED BUG-1: сумма 60 000 ₽ (выше всех лимитов) не должна показывать «Оплата прошла»', async ({ page }) => {
    await openApp(page);

    await pay(page, '60000');

    await expect(page.locator('#status')).not.toContainText('Yes');
    await expect(page.locator('#status')).toContainText('No');
    expect(await totalCharged(page)).toBe(0);
  });

 
  test('RED BUG-2: при оплате через резервный провайдер списывается введённая сумма (15 000 ₽, а не 999 ₽)', async ({ page }) => {
    await openApp(page);

    await pay(page, '15000');

    await expect(page.locator('#status')).toContainText('Оплата прошла');
    expect(await totalCharged(page)).toBe(15000);
  });
});
