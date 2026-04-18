// SI Elite Clipper - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
    const mainView = document.getElementById('main-view');
    const setupView = document.getElementById('setup-view');
    const statusDiv = document.getElementById('status');
    const tokenInput = document.getElementById('token-input');
    
    let currentData = null;

    // Check for existing token
    const { clipperToken } = await chrome.storage.local.get('clipperToken');
    if (!clipperToken) {
        mainView.style.display = 'none';
        setupView.style.display = 'block';
    }

    // Save Token
    document.getElementById('save-token').addEventListener('click', async () => {
        const token = tokenInput.value.trim();
        if (token.startsWith('SI_ELITE_')) {
            await chrome.storage.local.set({ clipperToken: token });
            window.location.reload();
        } else {
            statusDiv.innerText = "Token inválido!";
        }
    });

    // Change Token
    document.getElementById('change-token').addEventListener('click', async () => {
        await chrome.storage.local.remove('clipperToken');
        window.location.reload();
    });

    // Get Data from Content Script
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        chrome.tabs.sendMessage(tab.id, { action: "getScrapedData" }, (response) => {
            if (chrome.runtime.lastError) {
                statusDiv.innerText = "Erro: faz Refresh na página.";
                return;
            }

            if (response) {
                currentData = response;
                document.getElementById('prop-name').innerText = response.name;
                document.getElementById('prop-price').innerText = response.price;
                
                if (response.sellerPhone) {
                    document.getElementById('seller-info').innerHTML = `
                        📞 <b style="color: #FE6B00">${response.sellerPhone}</b><br>
                        👤 ${response.sellerName || 'Particular'}
                    `;
                }
            }
        });
    } catch (e) {
        statusDiv.innerText = "Erro ao ler a página.";
    }

    // Send Data (Market Mode)
    document.getElementById('send-market').addEventListener('click', () => sendToCRM('MARKET'));

    // Send Data (Property Mode)
    document.getElementById('send-property').addEventListener('click', () => sendToCRM('PROPERTY'));

    async function sendToCRM(type) {
        if (!currentData) return;
        
        statusDiv.innerText = "A enviar para o CRM...";
        const { clipperToken } = await chrome.storage.local.get('clipperToken');

        chrome.runtime.sendMessage({
            action: "sendToCRM",
            token: clipperToken,
            type: type, // 'MARKET' or 'PROPERTY'
            data: currentData
        }, (response) => {
            if (response && response.success) {
                statusDiv.innerHTML = "<b style='color: #4ade80'>Sucesso! Importado.</b>";
                setTimeout(() => window.close(), 1500);
            } else {
                statusDiv.innerHTML = "<b style='color: #f87171'>Erro no envio.</b>";
            }
        });
    }
});
