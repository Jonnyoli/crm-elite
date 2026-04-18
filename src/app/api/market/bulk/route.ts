import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MarketProperty from '@/models/MarketProperty';
import Lead from '@/models/Lead';

const CLIPPER_TOKEN_PREFIX = 'SI_ELITE_';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { token, properties } = body;

    if (!token || !token.startsWith(CLIPPER_TOKEN_PREFIX)) {
      return NextResponse.json({ success: false, error: 'Token inválido.' }, { status: 401 });
    }

    if (!Array.isArray(properties)) {
      return NextResponse.json({ success: false, error: 'Lista de imóveis inválida.' }, { status: 400 });
    }

    const createdProperties = [];
    
    for (const prop of properties) {
      // 1. Create Market Property
      const newProp = await MarketProperty.create({
        title: prop.name || prop.title || 'Imóvel de Mercado',
        price: parseFloat(prop.price?.toString().replace(/[^0-9]/g, '') || '0'),
        location: prop.location || '',
        address: prop.address || '',
        imageUrl: prop.imageUrl || prop.image || '',
        rooms: prop.rooms || '',
        area: prop.area || '',
        sellerName: prop.sellerName || '',
        sellerPhone: prop.sellerPhone || '',
        isParticular: prop.isParticular === 'Sim' || !!prop.isParticular,
        source: prop.source || 'Casafari',
        sourceUrl: prop.url || '',
        status: 'ATIVO'
      });
      createdProperties.push(newProp);

      // 2. Create Seller Lead if phone exists
      if (prop.sellerPhone) {
        // Try to find if seller already exists to avoid duplicates (optional but good)
        const existingLead = await Lead.findOne({ phone: prop.sellerPhone });
        if (!existingLead) {
          await Lead.create({
            name: prop.sellerName || 'Vendedor Mercado',
            phone: prop.sellerPhone,
            email: `${prop.sellerName?.toLowerCase().replace(/\s/g, '.') || 'vendedor'}@mercado.com`,
            role: 'VENDEDOR',
            source: 'SI Super-Clipper',
            notes: `Capturado em massa. Imóvel: ${prop.name || prop.title}`,
            tags: ['Bulk Captured', 'Seller']
          });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: createdProperties.length,
      message: `${createdProperties.length} imóveis importados com sucesso.` 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error: any) {
    console.error('Bulk Import Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
