let chatHistory = [
    { role: "system", content: "You are KALI AI, an advanced AI created by Master Prageeth. Always be helpful and concise." }
];

// Modals පාලනය කිරීම
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Enter බොත්තම එබූ විට පණිවිඩය යැවීම
function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const userMessage = inputField.value.trim();
    const modelSelect = document.getElementById("model-select");
    const actualModelId = modelSelect.value;
    const modelName = modelSelect.options[modelSelect.selectedIndex].text;
    const chatBox = document.getElementById("chat-box");

    if (!userMessage) return;

    // User ගේ මැසේජ් එක පෙන්නන්න
    chatBox.innerHTML += `<div class="message user-msg">${userMessage}</div>`;
    inputField.value = "";
    chatHistory.push({ role: "user", content: userMessage });

    // Loading එකක් පෙන්වන්න
    const loadingId = "loading-" + Date.now();
    chatBox.innerHTML += `<div id="${loadingId}" class="message ai-msg"><i>${modelName} සිතමින් පවතී...</i></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: actualModelId,
                messages: chatHistory
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Loading එක අයින් කරලා උත්තරය දාන්න
        document.getElementById(loadingId).remove();
        chatBox.innerHTML += `<div class="message ai-msg"><strong>${modelName}:</strong><br>${aiResponse.replace(/\n/g, '<br>')}</div>`;
        
        chatHistory.push({ role: "assistant", content: aiResponse });
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        document.getElementById(loadingId).remove();
        chatBox.innerHTML += `<div class="message system-msg" style="color:#ff4c4c;">Error: සර්වර් දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න.</div>`;
    }
}