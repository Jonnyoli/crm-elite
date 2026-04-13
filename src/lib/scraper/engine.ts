import { chromium, Page } from 'playwright';

export interface ScrapedProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  rooms: string;
  source: string;
  link: string;
  image: string;
  area?: number;
}

export async function scrapePortals(params: {
  location: string;
  type: string;
  maxPrice: number;
}) {
  const results: ScrapedProperty[] = [];
  const browser = await chromium.launch({ headless: true });
  
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 }
    });

    // 1. Scraping Imovirtual
    const imovirtualResults = await scrapeImovirtual(context, params);
    results.push(...imovirtualResults);

    // 2. Scraping Idealista (Simulação/Básico devido a proteções)
    // Nota: O Idealista costuma bloquear robôs em ambientes de servidor sem proxies.
    // Vamos tentar uma abordagem básica ou amigável.
    // const idealistaResults = await scrapeIdealista(context, params);
    // results.push(...idealistaResults);

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }

  return results;
}

async function scrapeImovirtual(context: any, params: any): Promise<ScrapedProperty[]> {
  const page: Page = await context.newPage();
  const searchType = params.type.toLowerCase().includes('moradia') ? 'moradia' : 'apartamento';
  
  // URL amigável do Imovirtual para pesquisa
  const url = `https://www.imovirtual.com/pt/resultados/comprar/${searchType}/${params.location.toLowerCase()}/${params.location.toLowerCase()}?search%5Bfilter_float_price%3Ato%5D=${params.maxPrice}`;
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Aceitar cookies se aparecer
    try { await page.click('#onetrust-accept-btn-handler', { timeout: 3000 }); } catch (e) {}
    
    await page.waitForTimeout(2000); // Esperar carregar dinamicamente

    const properties = await page.evaluate(() => {
      const articles = Array.from(document.querySelectorAll('article[data-sentry-component="AdvertCard"]'));
      return articles.slice(0, 10).map((item, index) => {
        const titleEl = item.querySelector('p[data-cy="listing-item-title"]');
        const priceEl = item.querySelector('span[data-sentry-element="MainPrice"]');
        const linkEl = item.querySelector('a[data-cy="listing-item-link"]') as HTMLAnchorElement;
        const imgEl = item.querySelector('img');
        const locationEl = item.querySelector('p[data-sentry-component="Address"]');

        if (!titleEl || !priceEl || !linkEl) return null;

        let priceRaw = priceEl.textContent?.trim().replace('€', '').replace(/\s/g, '').split(',')[0] || '0';
        const price = parseInt(priceRaw) || 0;

        return {
          id: `imo-${Date.now()}-${index}`,
          title: titleEl.textContent?.trim() || '',
          price: price,
          location: locationEl?.textContent?.trim() || '',
          rooms: 'T' + (titleEl.textContent?.match(/T(\d+)/)?.[1] || '2'),
          source: 'Imovirtual',
          link: linkEl.href,
          image: imgEl?.src || 'https://placehold.co/600x400?text=Sem+Imagem'
        };
      }).filter((i): i is ScrapedProperty => i !== null);
    });

    return properties;
  } catch (e) {
    console.error('Imovirtual scrape failed:', e);
    return [];
  } finally {
    await page.close();
  }
}
