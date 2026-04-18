// SI Elite Clipper - Content Script
// Scrapes the page for real estate data

function extractData() {
    const url = window.location.href;
    let data = { url };

    if (url.includes("casafari.com")) {
        // Casafari Selectors (Approximation)
        data.name = document.querySelector(".property-title, h1")?.innerText || "Imóvel Casafari";
        data.price = document.querySelector(".price, .property-price")?.innerText || "";
        data.location = document.querySelector(".location, .address")?.innerText || "";
        data.description = document.querySelector(".description, #description")?.innerText || "";
        data.imageUrl = document.querySelector("img.main-image, .gallery img")?.src || "";
        data.source = "Casafari";
    } else if (url.includes("idealista.pt")) {
        // Idealista Selectors
        data.name = document.querySelector(".main-info__title-main")?.innerText || "Imóvel Idealista";
        data.price = document.querySelector(".info-data-price")?.innerText || "";
        data.location = document.querySelector(".main-info__title-minor")?.innerText || "";
        data.imageUrl = document.querySelector(".main-image img")?.src || "";
        data.source = "Idealista";
    } else if (url.includes("imovirtual.com")) {
        data.name = document.querySelector("h1[data-cy='ad_title']")?.innerText || "Imóvel Imovirtual";
        data.price = document.querySelector("strong[data-cy='ad_price']")?.innerText || "";
        data.imageUrl = document.querySelector(".slick-slide img")?.src || "";
        data.source = "Imovirtual";
    }

    return data;
}

// Send a message back to the popup when requested
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getScrapedData") {
        const data = extractData();
        sendResponse(data);
    }
});
