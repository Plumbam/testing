// @ts-check

/**
 * Описание данных для карточек услуг cpcimpex.com
 */
export const CARDS_DATA = [
  {
    id: 'fruit-veg',
    title: 'Фасовка овощей и фруктов',
    expectedHref: 'http://ccfresh.ru',
    target: '_blank',
    imageAlt: 'Фасовка овощей и фруктов - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/slide2.jpeg',
    hasNewBadge: true,
    isExternal: true,
  },
  {
    id: 'figure-pack',
    title: 'Фасовка в фигурный пакет',
    expectedHref: 'https://cpcimpex.com/services/fasovka-v-figurnyij-paket.html',
    target: null,
    imageAlt: 'Фасовка в фигурный пакет - CPCIMPEX.COM',
    imageSrc: 'assets/img/blog/figure.jpg',
    hasNewBadge: false,
    isExternal: false,
  },
  {
    id: 'sachet-3x',
    title: 'Фасовка в 3-х шовный пакет',
    expectedHref: 'https://cpcimpex.com/services/fasovka-v-3-x-shovnyij-paket.html',
    target: null,
    imageAlt: 'Фасовка в 3-х шовный пакет - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/sashet3x.png',
    hasNewBadge: false,
    isExternal: false,
  },
  {
    id: 'sachet-4x',
    title: 'Фасовка в 4-х шовный пакет',
    expectedHref: 'https://cpcimpex.com/services/fasovka-v-4-x-shovnyij-paket.html',
    target: null,
    imageAlt: 'Фасовка в 4-х шовный пакет - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/sashet4x.png',
    hasNewBadge: false,
    isExternal: false,
  },
  {
    id: 'doy-pack',
    title: 'Фасовка в пакет Doy-pack',
    expectedHref: 'https://cpcimpex.com/services/fasovka-v-paket-doy-pack.html',
    target: null,
    imageAlt: 'Фасовка в пакет Doy-pack - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/doypak-4.png',
    hasNewBadge: false,
    isExternal: false,
  },
  {
    id: 'toppers',
    title: 'Фасовка в топперы',
    expectedHref: 'https://cpcimpex.com/services/fasovka-v-topperyi.html',
    target: null,
    imageAlt: 'Фасовка в топперы - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/TOPCUP-3.png',
    hasNewBadge: false,
    isExternal: false,
  },
  {
    id: 'turnkey-toppers',
    title: 'Топперы с начинкой под ключ',
    expectedHref: 'https://toppers.cpcimpex.com/',
    target: '_blank',
    imageAlt: 'Топперы с начинкой под ключ - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/slide-06.png',
    hasNewBadge: false,
    isExternal: true,
  },
  {
    id: 'ldpe-promo',
    title: 'Промо наборы в пленке LDPE',
    expectedHref: 'https://cpcimpex.com/services/promo-naboryi-v-plenke-ldpe.html',
    target: null,
    imageAlt: 'Промо наборы в пленке LDPE - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/ldpe.png',
    hasNewBadge: false,
    isExternal: false,
  },
  {
    id: 'pof-promo',
    title: 'Промо наборы в пленке ПОФ',
    expectedHref: 'https://cpcimpex.com/services/promo-naboryi-v-plenke-pof.html',
    target: null,
    imageAlt: 'Промо наборы в пленке ПОФ - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/5.png',
    hasNewBadge: false,
    isExternal: false,
  },
  {
    id: 'pet-promo',
    title: 'Промо наборы в пленке ПЭТ',
    expectedHref: 'https://cpcimpex.com/services/promo-naboryi-v-plenke-pet.html',
    target: null,
    imageAlt: 'Промо наборы в пленке ПЭТ - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/pet.png',
    hasNewBadge: false,
    isExternal: false,
  },
  {
    id: 'cardboard-promo',
    title: 'Промо наборы в картоне',
    expectedHref: 'https://cpcimpex.com/services/promo-naboryi-v-kartone.html',
    target: null,
    imageAlt: 'Промо наборы в картоне - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/upak-2.png',
    hasNewBadge: false,
    isExternal: false,
  },
  {
    id: 'platinka',
    title: 'Вырубка платинки',
    expectedHref: 'https://cpcimpex.com/services/vyirubka-platinki.html',
    target: null,
    imageAlt: 'Вырубка платинки - CPCIMPEX.COM',
    imageSrc: 'assets/img/icons/PLATINKA.png',
    hasNewBadge: false,
    isExternal: false,
  },
];

export class cpcimpexExtensionsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = 'https://cpcimpex.com';

    // Главный контейнер карточек
    this.cartBlock = page.locator('.cart_block').first();
    this.cards = this.cartBlock.locator('.cart_item');

    // Баннер согласия на cookies (CookieHub)
    this.cookieBanner = page.locator('.ch2-container');
    this.cookieAllowBtn = page.locator('.ch2-allow-all-btn').first();

    // Локаторы для каждой отдельной карточки
    this.fruitCard = this.getCardByTitle('Фасовка овощей и фруктов');
    this.figurePackCard = this.getCardByTitle('Фасовка в фигурный пакет');
    this.sachet3xCard = this.getCardByTitle('Фасовка в 3-х шовный пакет');
    this.sachet4xCard = this.getCardByTitle('Фасовка в 4-х шовный пакет');
    this.doyPackCard = this.getCardByTitle('Фасовка в пакет Doy-pack');
    this.toppersCard = this.getCardByTitle('Фасовка в топперы');
    this.turnkeyToppersCard = this.getCardByTitle('Топперы с начинкой под ключ');
    this.ldpePromoCard = this.getCardByTitle('Промо наборы в пленке LDPE');
    this.pofPromoCard = this.getCardByTitle('Промо наборы в пленке ПОФ');
    this.petPromoCard = this.getCardByTitle('Промо наборы в пленке ПЭТ');
    this.cardboardPromoCard = this.getCardByTitle('Промо наборы в картоне');
    this.platinkaCard = this.getCardByTitle('Вырубка платинки');

    this.joinLink = this.fruitCard;
  }


  async goto() {
    // Предварительно устанавливаем cookie согласия, чтобы баннер CookieHub не блокировал интерфейс
    await this.page.context().addCookies([
      {
        name: 'cookiehub',
        value: '{"answered":true,"revision":1,"dnt":false,"allowSale":true,"allAllowed":true}',
        domain: '.cpcimpex.com',
        path: '/',
      },
    ]).catch(() => {});

    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    await this.acceptCookiesIfPresent();
  }


  async acceptCookiesIfPresent() {
    try {
      if (await this.cookieAllowBtn.isVisible({ timeout: 2500 })) {
        await this.cookieAllowBtn.click();
        await this.cookieAllowBtn.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      }
    } catch {
    }
  }


  getCardByTitle(title) {
    return this.cartBlock.locator('.cart_item', {
      has: this.page.locator('h3', { hasText: title }),
    });
  }

  async getCardHref(cardLocator) {
    return await cardLocator.getAttribute('href');
  }


  async getCardTarget(cardLocator) {
    return await cardLocator.getAttribute('target');
  }

  async clickAndOpen(cardLocator, isOpenInNewTab = false) {
    await cardLocator.scrollIntoViewIfNeeded();

    if (isOpenInNewTab) {
      const [popup] = await Promise.all([
        this.page.waitForEvent('popup'),
        cardLocator.click(),
      ]);
      return { page: popup, isNewPage: true };
    } else {
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
        cardLocator.click(),
      ]);
      return { page: this.page, isNewPage: false };
    }
  }

  async clickJoin() { await this.fruitCard.click(); }
  async clickFruit() { return await this.clickAndOpen(this.fruitCard, true); }
  async clickFigurePack() { return await this.clickAndOpen(this.figurePackCard, false); }
  async clickSachet3x() { return await this.clickAndOpen(this.sachet3xCard, false); }
  async clickSachet4x() { return await this.clickAndOpen(this.sachet4xCard, false); }
  async clickDoyPack() { return await this.clickAndOpen(this.doyPackCard, false); }
  async clickToppers() { return await this.clickAndOpen(this.toppersCard, false); }
  async clickTurnkeyToppers() { return await this.clickAndOpen(this.turnkeyToppersCard, true); }
  async clickLdpePromo() { return await this.clickAndOpen(this.ldpePromoCard, false); }
  async clickPofPromo() { return await this.clickAndOpen(this.pofPromoCard, false); }
  async clickPetPromo() { return await this.clickAndOpen(this.petPromoCard, false); }
  async clickCardboardPromo() { return await this.clickAndOpen(this.cardboardPromoCard, false); }
  async clickPlatinka() { return await this.clickAndOpen(this.platinkaCard, false); }
}
