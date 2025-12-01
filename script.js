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
const body = document.body;
const toggleTheme = document.getElementById("toggleTheme");
const ICON_SUN = "\u2600";      // ☀
const ICON_MOON = "\u{1F319}";  // 🌙

if (localStorage.getItem("tema") === "dark") {
    body.classList.add("dark");
}
toggleTheme.textContent = body.classList.contains("dark") ? ICON_MOON : ICON_SUN;

toggleTheme.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");

    localStorage.setItem("tema", isDark ? "dark" : "light");
    toggleTheme.textContent = isDark ? ICON_MOON : ICON_SUN;
});

/* ============================
    LOGIN / CADASTRO
============================ */
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const menuPainel = document.getElementById("menuPainel");

let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

btnLogin.addEventListener("click", () => abrir("modalLogin"));

document.getElementById("abrirCadastro").addEventListener("click", () => {
    fechar("modalLogin");
    abrir("modalCadastro");
});

/* Cadastro */
document.getElementById("realizarCadastro").addEventListener("click", () => {
    const nome = document.getElementById("cadNome").value.trim();
    const email = document.getElementById("cadEmail").value.trim();
    const senha = document.getElementById("cadSenha").value;

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    if (localStorage.getItem(email)) {
        alert("Este email ja esta cadastrado.");
        return;
    }

    const novoUsuario = {
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
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;

    const usuario = JSON.parse(localStorage.getItem(email) || "null");

    if (!usuario || usuario.senha !== senha) {
        alert("Email ou senha incorretos.");
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
            Number(usuarioLogado.economia || 0).toFixed(2);

        // admin pode editar precos
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

/* CTA do hero leva ao clube e abre cadastro se nao logado */
const btnAssinarHero = document.getElementById("btnAssinar");
if (btnAssinarHero) {
    btnAssinarHero.addEventListener("click", () => {
        const secClube = document.getElementById("clube");
        if (secClube) {
            secClube.scrollIntoView({ behavior: "smooth" });
        }
        if (!usuarioLogado) {
            abrir("modalCadastro");
        }
    });
}

/* ============================
    PRECOS AUTOMATICOS
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

/* Editar precos */
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
const descricoesPlanos = {
    bronze: "Plano Bronze - R$ 9,90/mes (10% de desconto)",
    prata:  "Plano Prata - R$ 14,90/mes (15% de desconto)",
    ouro:   "Plano Ouro - R$ 19,90/mes (20% de desconto)"
};
const valoresPlanos = { bronze: 9.90, prata: 14.90, ouro: 19.90 };

document.querySelectorAll(".btnAssinarPlano").forEach(btn => {
    btn.addEventListener("click", () => {
        planoSelecionado = btn.dataset.plano;
        document.getElementById("planoSelecionado").textContent = descricoesPlanos[planoSelecionado] || "";
        abrir("modalPagamento");
    });
});

/* Pagamento */
document.getElementById("pagarPIX").addEventListener("click", () => confirmarPagamento("PIX"));
document.getElementById("pagarCartao").addEventListener("click", () => {
    document.getElementById("cartaoArea").classList.remove("hide");
});

document.getElementById("confirmarCartao").addEventListener("click", () => {
    const valorDoPlanoSelecionado = valoresPlanos[planoSelecionado] || 0;
    const valorFinal = typeof aplicarCupom === "function"
        ? aplicarCupom(valorDoPlanoSelecionado)
        : valorDoPlanoSelecionado;
    confirmarPagamento("Cartao", valorFinal);
});

/* Finaliza assinatura */
function confirmarPagamento(tipo, valorFinal) {
    if (!usuarioLogado) {
        alert("Faca login!");
        return;
    }

    usuarioLogado.plano = planoSelecionado;

    // registra economia da assinatura (simulacao)
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
    SERVICOS (redirecionamento)
============================ */
document.querySelectorAll(".serv").forEach(card => {
    card.addEventListener("click", () => {
        const serv = card.dataset.serv;
        // Todos os serviços usam a mesma estrutura de página (servico_[nome].html)
        window.location.href = `servico_${serv}.html`;
    });
});
