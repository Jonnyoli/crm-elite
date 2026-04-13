import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { property, tone } = await req.json();

    if (!property) {
      return NextResponse.json({ error: 'Dados do imóvel em falta.' }, { status: 400 });
    }

    // Como sou o Antigravity, posso simular o "IA Engine" que gera o copy baseado no tom.
    // Em produção real, aqui chamaria uma API como OpenAI ou Gemini.
    
    let teaser = "";
    let description = "";
    let hashtags = "#imobiliario #oportunidade #coimbra #luxo";

    if (tone === 'INVESTOR') {
      teaser = `📈 OPORTUNIDADE DE INVESTIMENTO: ${property.title}`;
      description = `Excelente oportunidade para o seu portfólio. Imóvel com alto potencial de valorização em ${property.location}. \n\nDetalhes:\n- Preço: ${property.price}€\n- Tipologia: ${property.rooms}\n- Rentabilidade estimada: 5.5% a 6.2%.\n\nIdeal para o mercado de arrendamento universitário ou local. Contacte para análise de rentabilidade completa.`;
    } else if (tone === 'SOCIAL') {
      teaser = `🏠 A TUA PRÓXIMA CASA EM ${property.location.split(',')[1] || property.location}! ✨`;
      description = `Já te imaginaste a viver aqui? 😍 \nEste ${property.rooms} é perfeito para quem procura conforto e estilo. \n\n✅ ${property.title}\n💰 Apenas ${property.price}€\n📍 Localização premium\n\nNão deixes escapar esta oportunidade! Envia-me uma mensagem direta (DM) para agendar visita. 👇`;
      hashtags = "#homedecor #casasonho #coimbraliving #imobiliariaportugal #dreamhome";
    } else {
      teaser = `Ficha Técnica: ${property.title}`;
      description = `Apartamento ${property.rooms} situado em ${property.location}. Imóvel em excelente estado de conservação, com áreas generosas e boa exposição solar. Proximidade a serviços, transportes e comércio. \n\nValor de mercado: ${property.price}€.\nIdeal para habitação própria ou mercado secundário.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        teaser,
        description,
        hashtags
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
