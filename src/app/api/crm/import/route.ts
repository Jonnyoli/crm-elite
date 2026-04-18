import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Property from '@/models/Property';

// Simple authentication token - in a real app this would be more robust
// For this demo, we'll check it against a hardcoded value or a common prefix
const CLIPPER_TOKEN_PREFIX = 'SI_ELITE_';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { token, type, data } = body;

    // Basic Token Validation
    if (!token || !token.startsWith(CLIPPER_TOKEN_PREFIX)) {
      return NextResponse.json({ success: false, error: 'Token inválido ou não fornecido.' }, { status: 401 });
    }

    let result;

    if (type === 'LEAD') {
      result = await Lead.create({
        name: data.name || 'Nova Lead clipper',
        email: data.email || 'n/a',
        phone: data.phone || 'n/a',
        source: data.source || 'Clipper Extension',
        notes: `Importado de: ${data.url}\n\nPreço Inicial: ${data.price}\nLocalização: ${data.location}`,
        status: 'NOVO'
      });
    } else if (type === 'PROPERTY') {
      result = await Property.create({
        address: data.address || data.location || 'Sem morada',
        price: parseFloat(data.price?.replace(/[^0-9]/g, '') || '0'),
        type: data.propertyType || 'MORADIA',
        status: 'DISPONIVEL',
        description: `Importado via Clipper de: ${data.url}`,
        imageUrl: data.imageUrl,
        features: data.features || [],
        location: data.location
      });
    } else {
      return NextResponse.json({ success: false, error: 'Tipo de importação inválido.' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Importado com sucesso: ${type}`,
      data: result 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for browser extensions
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error: any) {
    console.error('Import API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Handle CORS preflight
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
