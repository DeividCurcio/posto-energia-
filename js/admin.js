// Admin Panel Logic
/* ============================
      VERIFICA SE É ADMIN
============================ */
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado || usuarioLogado.admin !== true) {
    alert("Acesso negado! Esta área é exclusiva para administradores.");
    window.location.href = "../index.html";
}

/* ============================
      CRIA ADMIN AUTOMATICAMENTE
============================ */
if (!localStorage.getItem("admin@posto.com")) {
    let admin = {
        nome: "Administrador",
        email: "admin@posto.com",
        senha: "1234",
        plano: "Admin",
        economia: 0,
        admin: true
    };
    localStorage.setItem("admin@posto.com", JSON.stringify(admin));
}

/* ============================
      NAVEGAÇÃO DO PAINEL
============================ */
let paginas = document.querySelectorAll(".page");
let botoes = document.querySelectorAll(".sidebar li");

botoes.forEach(btn => {
    btn.addEventListener("click", () => {
        paginas.forEach(p => p.classList.add("hide"));
        document.getElementById(btn.dataset.page).classList.remove("hide");
    });
});

/* ============================
      LISTAR USUÁRIOS
============================ */
function carregarUsuarios() {
    let tabela = document.getElementById("tabelaUsuarios");

    // limpa tudo menos o header
    tabela.innerHTML = `
        <tr><th>Nome</th><th>Email</th><th>Plano</th><th>Economia</th></tr>
    `;

    for (let i = 0; i < localStorage.length; i++) {
        let chave = localStorage.key(i);

        if (chave.includes("@")) {
            let usuario = JSON.parse(localStorage.getItem(chave));

            tabela.innerHTML += `
                <tr>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.plano}</td>
                    <td>R$ ${Number(usuario.economia || 0).toFixed(2)}</td>
                </tr>
            `;
        }
    }
}
carregarUsuarios();

/* ============================
      PREÇOS
============================ */
let precos = JSON.parse(localStorage.getItem("precos")) || {
    gasolina: 5.89,
    etanol: 3.99,
    diesel: 6.29
};

document.getElementById("editGasolina").value = precos.gasolina;
document.getElementById("editEtanol").value   = precos.etanol;
document.getElementById("editDiesel").value   = precos.diesel;

document.getElementById("salvarPrecos").addEventListener("click", () => {
    precos.gasolina = parseFloat(document.getElementById("editGasolina").value);
    precos.etanol   = parseFloat(document.getElementById("editEtanol").value);
    precos.diesel   = parseFloat(document.getElementById("editDiesel").value);

    localStorage.setItem("precos", JSON.stringify(precos));
    alert("Preços atualizados!");
});

/* ============================
      CUPONS
============================ */
let listaCupons = JSON.parse(localStorage.getItem("cupons")) || [];

function atualizarListaCupons() {
    document.getElementById("listaCupons").innerHTML = "";
    listaCupons.forEach(c => {
        document.getElementById("listaCupons").innerHTML += `
            <li>${c.codigo} — ${c.desconto}%</li>
        `;
    });
}
atualizarListaCupons();

document.getElementById("criarCupom").addEventListener("click", () => {
    let codigo = document.getElementById("cupomCodigo").value.trim();
    let desconto = parseInt(document.getElementById("cupomDesconto").value);

    if (!codigo || !desconto) return alert("Preencha tudo!");

    listaCupons.push({ codigo, desconto });
    localStorage.setItem("cupons", JSON.stringify(listaCupons));

    document.getElementById("cupomCodigo").value = "";
    document.getElementById("cupomDesconto").value = "";

    atualizarListaCupons();
    alert("Cupom criado!");
});

/* ============================
      LOGOUT
============================ */
document.getElementById("btnSair").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "../index.html";
});

/* ============================
      TEMA (DARK/LIGHT)
============================ */
const toggleAdminTheme = document.getElementById("toggleAdminTheme");
if (localStorage.getItem("temaAdmin") === "dark") {
    document.body.classList.add("dark");
    if (toggleAdminTheme) toggleAdminTheme.textContent = "☀";
}
if (toggleAdminTheme) {
    toggleAdminTheme.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const dark = document.body.classList.contains("dark");
        localStorage.setItem("temaAdmin", dark ? "dark" : "light");
        toggleAdminTheme.textContent = dark ? "☀" : "🌙";
    });
}
