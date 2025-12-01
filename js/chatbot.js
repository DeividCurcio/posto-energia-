/* ================================
       ELEMENTOS
================================ */
const chatbotBtn = document.createElement("button");
chatbotBtn.id = "chatbotBtn";
chatbotBtn.textContent = "💬";

const chatbotWindow = document.createElement("div");
chatbotWindow.id = "chatbotWindow";

chatbotWindow.innerHTML = `
    <div id="chatHeader">Atendente Virtual</div>
    <div id="chatMessages"></div>

    <div id="chatInputArea">
        <input id="chatInput" placeholder="Digite aqui...">
        <button id="chatSend">➤</button>
    </div>
`;

document.body.appendChild(chatbotBtn);

document.body.appendChild(chatbotWindow);

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

/* ================================
       ABRIR / FECHAR
================================ */
chatbotBtn.onclick = () => {
    chatbotWindow.style.display =
        chatbotWindow.style.display === "flex" ? "none" : "flex";
};

/* ================================
       ENVIAR MENSAGEM
================================ */
function enviarMensagem() {
    const texto = chatInput.value.trim();
    if (!texto) return;

    adicionarMensagem(texto, "userMsg");
    chatInput.value = "";

    setTimeout(() => {
        responder(texto.toLowerCase());
    }, 400);
}

chatSend.onclick = enviarMensagem;
chatInput.addEventListener("keypress", e => {
    if (e.key === "Enter") enviarMensagem();
});

/* ================================
       EXIBIR MENSAGENS
================================ */
function adicionarMensagem(texto, classe) {
    const div = document.createElement("div");
    div.className = "msg " + classe;
    div.textContent = texto;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ================================
       RESPOSTAS INTELIGENTES
================================ */
function responder(msg) {
    const preco = JSON.parse(localStorage.getItem("precos")) || {
        gasolina: 5.89,
        etanol: 3.99,
        diesel: 6.29
    };

    const respostas = {
        // preços
        "preço gasolina": `A gasolina está R$ ${preco.gasolina.toFixed(2)}.`,
        "gasolina":       `A gasolina está R$ ${preco.gasolina.toFixed(2)}.`,

        "etanol":         `O etanol está R$ ${preco.etanol.toFixed(2)}.`,
        "preço etanol":   `O etanol está R$ ${preco.etanol.toFixed(2)}.`,

        "diesel":         `O diesel está R$ ${preco.diesel.toFixed(2)}.`,
        "preço diesel":   `O diesel está R$ ${preco.diesel.toFixed(2)}.`,

        // planos
        "plano": "Temos 3 planos: Bronze (10%), Prata (15%) e Ouro (20%).",
        "assinatura": "Para assinar, clique no botão 'Assinar Agora' na página principal.",

        // endereço
        "endereço": "Nosso posto fica na Avenida Brasil, nº 1000 – Centro.",
        "onde fica": "Estamos na Avenida Brasil, nº 1000 – Centro.",

        // horário
        "horário": "Funcionamos 24 horas todos os dias!",
        "atendimento": "Estamos abertos 24h.",

        // serviços
        "serviços": "Oferecemos: abastecimento, troca de óleo, lavagem e loja de conveniência.",

        // saudação
        "oi": "Olá! Como posso te ajudar hoje? 😊",
        "olá": "Olá! 👋 Como posso ajudar?",
        
        // fallback
        "default": "Não entendi muito bem 🤔, mas posso informar preços, serviços, endereço e planos!"
    };

    // procura uma resposta por palavra-chave
    for (const chave in respostas) {
        if (msg.includes(chave)) {
            adicionarMensagem(respostas[chave], "botMsg");
            return;
        }
    }

    // fallback
    adicionarMensagem(respostas["default"], "botMsg");
}
