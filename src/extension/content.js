// SI Elite Clipper - Content Script (VERSÃO SUPER-PROSPEÇÃO)

function extractData() {
    const url = window.location.href;
    let data = { 
        url,
        name: "Imóvel Detectado",
        price: "Sob consulta",
        location: "",
        imageUrl: "",
        sellerName: "",
        sellerPhone: "",
        isParticular: false,
        rooms: "",
        area: "",
        source: "Casafari",
        propertyType: "MORADIA"
    };

    // 1. Título e Localização (Header)
    const h1 = document.querySelector('h1');
    if (h1) data.name = h1.innerText.trim();

    const breadcrumbs = document.querySelector('[class*="breadcrumb"]');
    if (breadcrumbs) data.location = breadcrumbs.innerText.replace(/\n/g, ' > ').trim();

    // 2. Preço (Heurística)
    const allText = document.body.innerText;
    const priceMatch = allText.match(/€\s*[0-9][0-9.,]*/);
    if (priceMatch) data.price = priceMatch[0];

    // 3. TABELA DE FONTES (Captura de Telefone e Vendedor)
    // Procuramos pela tabela ou linhas que contenham o telefone
    const rows = document.querySelectorAll('tr, [class*="row"], [class*="Table"] div');
    rows.forEach(row => {
        const text = row.innerText;
        
        // Se a linha tiver um número de telefone no formato internacional (+351...)
        const phoneMatch = text.match(/\+351\s*[0-9]{3}\s*[0-9]{3}\s*[0-9]{3}/);
        if (phoneMatch) {
            data.sellerPhone = phoneMatch[0].replace(/\s/g, '');
            
            // Tentar extrair o nome do vendedor (texto perto do telefone ou em colunas específicas)
            // No Casafari, o nome aparece muitas vezes na coluna "Fontes"
            if (text.includes('Idealista:') || text.includes('Vendedor:')) {
                const parts = text.split(/\n|:/);
                data.sellerName = parts[parts.length - 1].split('+351')[0].trim();
            }
            
            if (text.includes('Sim') && text.includes('Particular')) {
                data.isParticular = true;
            }
        }
    });

    // 4. Detalhes Técnicos (Quartos, Área)
    const details = document.body.innerText;
    const roomsMatch = details.match(/(\d+)\s*Quartos/i);
    if (roomsMatch) data.rooms = roomsMatch[1];
    
    const areaMatch = details.match(/(\d+)\s*m2/i);
    if (areaMatch) data.area = areaMatch[1];

    // 5. Imagem
    const images = document.querySelectorAll('img');
    for (const img of images) {
        if (img.width > 300) {
            data.imageUrl = img.src;
            break;
        }
    }

    console.log("SI Elite Super-Clipper Data:", data);
    return data;
}

// Escutar pedidos do Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getScrapedData") {
        sendResponse(extractData());
    }
});
