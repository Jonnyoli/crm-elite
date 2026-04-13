import { NextRequest, NextResponse } from 'next/server';
import { scrapePortals } from '@/lib/scraper/engine';

export async function POST(req: NextRequest) {
  try {
    const { location, type, maxPrice } = await req.json();

    if (!location || !type) {
      return NextResponse.json({ error: 'Faltam parâmetros de pesquisa.' }, { status: 400 });
    }

    // Executar o scraping real
    const results = await scrapePortals({
      location,
      type,
      maxPrice: Number(maxPrice) || 500000
    });

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error: any) {
    console.error('API Market Scrape Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao processar a pesquisa nos portais.',
      message: error.message 
    }, { status: 500 });
  }
}
