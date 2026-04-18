// SI Elite Clipper - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
    const setupView = document.getElementById('setup-view');
    const mainView = document.getElementById('main-view');
    const tokenInput = document.getElementById('token-input');
    const saveBtn = document.getElementById('save-token');
    const importBtn = document.getElementById('import-btn');
    const statusMsg = document.getElementById('status-msg');
    const propName = document.getElementById('prop-name');
    const propPrice = document.getElementById('prop-price');
    const changeTokenLink = document.getElementById('change-token');

    let currentData = null;

    // Check for saved token
    const result = await chrome.storage.local.get(['clipperToken']);
    if (result.clipperToken) {
        showMainView();
    } else {
        showSetupView();
    }

    saveBtn.addEventListener('click', () => {
        const token = tokenInput.value.trim();
        if (token) {
            chrome.storage.local.set({ clipperToken: token }, () => {
                showMainView();
            });
        }
    });

    changeTokenLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSetupView();
    });

    importBtn.addEventListener('click', async () => {
        if (!currentData) return;

        importBtn.disabled = true;
        statusMsg.innerText = "A enviar para o CRM...";
        statusMsg.className = "status";

        const { clipperToken } = await chrome.storage.local.get(['clipperToken']);

        chrome.runtime.sendMessage({
            action: "sendToCRM",
            token: clipperToken,
            type: "PROPERTY", // Default to property for clipper
            data: currentData
        }, (response) => {
            if (response && response.success) {
                statusMsg.innerText = "✓ Enviado com sucesso!";
                statusMsg.className = "status success";
            } else {
                statusMsg.innerText = "✗ Erro: " + (response?.error || "Falha na ligação");
                statusMsg.className = "status error";
                importBtn.disabled = false;
            }
        });
    });

    function showSetupView() {
        setupView.style.display = 'block';
        mainView.style.display = 'none';
    }

    async function showMainView() {
        setupView.style.display = 'none';
        mainView.style.display = 'block';
        
        // Request data from content script
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab && tab.url && (tab.url.includes('casafari') || tab.url.includes('idealista') || tab.url.includes('imovirtual'))) {
            chrome.tabs.sendMessage(tab.id, { action: "getScrapedData" }, (data) => {
                if (data) {
                    currentData = data;
                    propName.innerText = data.name;
                    propPrice.innerText = data.price;
                } else {
                    propName.innerText = "Não foi possível ler os dados.";
                }
            });
        } else {
            propName.innerText = "Visita um portal imobiliário!";
            importBtn.disabled = true;
        }
    }
});
