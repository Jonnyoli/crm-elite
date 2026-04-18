import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Property from '@/models/Property';
import MarketProperty from '@/models/MarketProperty';

const CLIPPER_TOKEN_PREFIX = 'SI_ELITE_';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { token, type, data } = body;

    // Basic Token Validation
    if (!token || !token.startsWith(CLIPPER_TOKEN_PREFIX)) {
      return NextResponse.json({ success: false, error: 'Token inválido.' }, { status: 401 });
    }

    let result;

    if (type === 'MARKET') {
      // 1. Save to Market Database (Separated from official listings)
      result = await MarketProperty.create({
        title: data.name || data.title || 'Imóvel de Mercado',
        price: parseFloat(data.price?.toString().replace(/[^0-9]/g, '') || '0'),
        location: data.location || '',
        address: data.address || '',
        imageUrl: data.imageUrl || data.image || '',
        rooms: data.rooms || '',
        area: data.area || '',
        sellerName: data.sellerName || '',
        sellerPhone: data.sellerPhone || '',
        isParticular: data.isParticular === 'Sim' || !!data.isParticular,
        source: data.source || 'Casafari Clipper',
        sourceUrl: data.url || '',
        notes: `Importado do Clipper. Vendedor: ${data.sellerName || 'n/a'}`,
        status: 'ATIVO'
      });

      // 2. If there is a phone number, also create a Lead as a VENDEDOR
      if (data.sellerPhone) {
        await Lead.create({
          name: data.sellerName || 'Vendedor Mercado',
          phone: data.sellerPhone,
          email: `${data.sellerName?.toLowerCase().replace(/\s/g, '.') || 'vendedor'}@mercado.com`,
          role: 'VENDEDOR',
          source: 'SI Elite Clipper',
          notes: `Proprietário do imóvel: ${data.name || data.title}\nURL: ${data.url}`,
          tags: ['Market Prospect', 'Seller']
        });
      }
    } else if (type === 'PROPERTY') {
      // Direct import to official listings
      result = await Property.create({
        address: data.address || data.location || 'Sem morada',
        price: parseFloat(data.price?.toString().replace(/[^0-9]/g, '') || '0'),
        type: data.propertyType || 'MORADIA',
        status: 'DISPONIVEL',
        description: `Importado via Clipper de: ${data.url}`,
        imageUrl: data.imageUrl || data.image,
        location: data.location,
        sellerPhone: data.sellerPhone // Ad-hoc storage if needed
      });
    } else {
      return NextResponse.json({ success: false, error: 'Tipo de importação inválido.' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Importado com sucesso para ${type}`,
      data: result 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error: any) {
    console.error('Import API Error:', error);
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
