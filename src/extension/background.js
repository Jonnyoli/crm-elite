// SI Elite Clipper - Background Service Worker

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendToCRM") {
        const { token, type, data } = request;
        
        // Production URL
        const apiUrl = "https://crm-elite.vercel.app/api/crm/import";

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token, type, data })
        })
        .then(response => response.json())
        .then(result => {
            sendResponse({ success: true, result });
        })
        .catch(error => {
            console.error("Fetch error:", error);
            sendResponse({ success: false, error: error.message });
        });

        return true; // Keep the message channel open for async response
    }
});
