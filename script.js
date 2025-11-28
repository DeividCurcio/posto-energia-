/* ============================
    SISTEMA DE MODAIS
============================ */
function abrir(id) {
    document.getElementById(id).style.display = "flex";
}
function fechar(id) {
    document.getElementById(id).style.display = "none";
}

document.querySelectorAll(".close").forEach(btn => {
    btn.addEventListener("click", () => fechar(btn.dataset.close));
});

/* ============================
    DARK MODE
============================ */
let body = document.body;
let toggleTheme = document.getElementById("toggleTheme");

if (localStorage.getItem("tema") === "dark") {
    body.classList.add("dark");
    toggleTheme.textContent = "☀";
}

toggleTheme.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        localStorage.setItem("tema", "dark");
        toggleTheme.textContent = "☀";
    } else {
        localStorage.setItem("tema", "light");
        toggleTheme.textContent = "🌙";
    }
});

/* ============================
    LOGIN / CADASTRO
============================ */
let btnLogin = document.getElementById("btnLogin");
let btnLogout = document.getElementById("btnLogout");
let menuPainel = document.getElementById("menuPainel");

let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

btnLogin.addEventListener("click", () => abrir("modalLogin"));

document.getElementById("abrirCadastro").addEventListener("click", () => {
    fechar("modalLogin");
    abrir("modalCadastro");
});

/* Cadastro */
document.getElementById("realizarCadastro").addEventListener("click", () => {
    let nome = document.getElementById("cadNome").value;
    let email = document.getElementById("cadEmail").value;
    let senha = document.getElementById("cadSenha").value;

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    if (localStorage.getItem(email)) {
        alert("Este email já está cadastrado!");
        return;
    }

    let novoUsuario = {
        nome,
        email,
        senha,
        plano: "Nenhum",
        economia: 0
    };

    localStorage.setItem(email, JSON.stringify(novoUsuario));
    alert("Cadastro realizado com sucesso!");

    fechar("modalCadastro");
});

/* Login */
document.getElementById("realizarLogin").addEventListener("click", () => {
    let email = document.getElementById("loginEmail").value;
    let senha = document.getElementById("loginSenha").value;

    let usuario = JSON.parse(localStorage.getItem(email));

    if (!usuario || usuario.senha !== senha) {
        alert("Email ou senha incorretos!");
        return;
    }

    usuarioLogado = usuario;
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    atualizarInterfaceUsuario();

    fechar("modalLogin");
});

/* Logout */
btnLogout.addEventListener("click", () => {
    usuarioLogado = null;
    localStorage.removeItem("usuarioLogado");
    atualizarInterfaceUsuario();
});

/* Atualiza interface conforme login */
function atualizarInterfaceUsuario() {
    if (usuarioLogado) {
        btnLogin.classList.add("hide");
        btnLogout.classList.remove("hide");
        menuPainel.classList.remove("hide");
        document.getElementById("painel").classList.remove("hide");

        document.getElementById("painelNome").textContent = usuarioLogado.nome;
        document.getElementById("painelPlano").textContent = usuarioLogado.plano;
        document.getElementById("economiaTotal").textContent =
            usuarioLogado.economia.toFixed(2);

        // admin pode editar preços
        if (usuarioLogado.email === "admin@posto.com") {
            document.getElementById("editPrecos").classList.remove("hide");
        }
    } else {
        btnLogin.classList.remove("hide");
        btnLogout.classList.add("hide");
        menuPainel.classList.add("hide");
        document.getElementById("painel").classList.add("hide");
    }
}
atualizarInterfaceUsuario();

/* ============================
    PREÇOS AUTOMÁTICOS
============================ */
let precos = JSON.parse(localStorage.getItem("precos")) || {
    gasolina: 5.89,
    etanol: 3.99,
    diesel: 6.29
};

function atualizarTabela() {
    document.getElementById("precoGasolina").textContent = "R$ " + precos.gasolina.toFixed(2);
    document.getElementById("precoEtanol").textContent   = "R$ " + precos.etanol.toFixed(2);
    document.getElementById("precoDiesel").textContent   = "R$ " + precos.diesel.toFixed(2);
}
atualizarTabela();

/* Editar preços */
document.getElementById("editPrecos").addEventListener("click", () => {
    abrir("modalPrecos");

    document.getElementById("editGasolina").value = precos.gasolina;
    document.getElementById("editEtanol").value   = precos.etanol;
    document.getElementById("editDiesel").value   = precos.diesel;
});

document.getElementById("salvarPrecos").addEventListener("click", () => {
    precos.gasolina = parseFloat(document.getElementById("editGasolina").value);
    precos.etanol   = parseFloat(document.getElementById("editEtanol").value);
    precos.diesel   = parseFloat(document.getElementById("editDiesel").value);

    localStorage.setItem("precos", JSON.stringify(precos));
    atualizarTabela();
    fechar("modalPrecos");
});

/* ============================
    ASSINATURAS
============================ */
let planoSelecionado = null;

document.querySelectorAll(".btnAssinarPlano").forEach(btn => {
    btn.addEventListener("click", () => {
        planoSelecionado = btn.dataset.plano;

        let texto = {
            bronze: "Plano Bronze — R$ 9,90/mês (10% de desconto)",
            prata:  "Plano Prata — R$ 14,90/mês (15% de desconto)",
            ouro:   "Plano Ouro — R$ 19,90/mês (20% de desconto)"
        };

        document.getElementById("planoSelecionado").textContent = texto[planoSelecionado];

        abrir("modalPagamento");
    });
});

/* Pagamento */
document.getElementById("pagarPIX").addEventListener("click", () => confirmarPagamento("PIX"));
document.getElementById("pagarCartao").addEventListener("click", () => {
    document.getElementById("cartaoArea").classList.remove("hide");
});

document.getElementById("confirmarCartao").addEventListener("click", () => {
    const valoresPlanos = {
        bronze: 9.90,
        prata: 14.90,
        ouro: 19.90
    };
    const valorDoPlanoSelecionado = valoresPlanos[planoSelecionado] || 0;
    let valorFinal = typeof aplicarCupom === 'function' ? aplicarCupom(valorDoPlanoSelecionado) : valorDoPlanoSelecionado;
    confirmarPagamento("Cartão", valorFinal);
});

/* Finaliza assinatura */
function confirmarPagamento(tipo, valorFinal) {
    if (!usuarioLogado) {
        alert("Faça login!");
        return;
    }

    // salva plano & economia
    usuarioLogado.plano = planoSelecionado;

    // registra economia da assinatura (simulação)
    const valoresPlanos = { bronze: 9.90, prata: 14.90, ouro: 19.90 };
    const valorDoPlanoSelecionado = valoresPlanos[planoSelecionado] || 0;
    const economia = Math.max(0, (valorDoPlanoSelecionado - (Number(valorFinal) || 0)));
    usuarioLogado.economia = Number(usuarioLogado.economia || 0) + economia;

    localStorage.setItem(usuarioLogado.email, JSON.stringify(usuarioLogado));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

    alert("Pagamento aprovado via " + tipo + "!");

    fechar("modalPagamento");
    atualizarInterfaceUsuario();
}

/* ============================
    SERVIÇOS (redirecionamento)
============================ */
document.querySelectorAll(".serv").forEach(card => {
    card.addEventListener("click", () => {
        let serv = card.dataset.serv;
        window.location.href = `servico_${serv}.html`;
    });
});
