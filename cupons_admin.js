/* ============================
    VERIFICA ADMIN
============================ */
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado || usuarioLogado.admin !== true) {
    alert("Acesso negado!");
    window.location.href = "../index.html";
}

/* ============================
    CARREGAR CUPONS
============================ */
let cupons = JSON.parse(localStorage.getItem("cupons")) || [];

function atualizarTabela() {
    let tabela = document.getElementById("tabelaCupons");

    tabela.innerHTML = `
        <tr>
            <th>Código</th>
            <th>Desconto</th>
            <th>Usado</th>
            <th>Ações</th>
        </tr>
    `;

    cupons.forEach((c, i) => {
        tabela.innerHTML += `
            <tr>
                <td>${c.codigo}</td>
                <td>${c.desconto}%</td>
                <td>${c.usado ? "Sim" : "Não"}</td>
                <td>
                    <button onclick="removerCupom(${i})">Excluir</button>
                </td>
            </tr>
        `;
    });
}
atualizarTabela();

/* ============================
    CRIAR CUPOM
============================ */
document.getElementById("criarCupom").addEventListener("click", () => {
    let codigo = document.getElementById("cupomCodigo").value;
    let desconto = parseInt(document.getElementById("cupomDesconto").value);

    if (!codigo || !desconto) {
        alert("Preencha todos os campos!");
        return;
    }

    cupons.push({
        codigo,
        desconto,
        usado: false
    });

    localStorage.setItem("cupons", JSON.stringify(cupons));
    atualizarTabela();
    alert("Cupom criado com sucesso!");
});

/* ============================
    REMOVER CUPOM
============================ */
function removerCupom(i) {
    cupons.splice(i, 1);
    localStorage.setItem("cupons", JSON.stringify(cupons));
    atualizarTabela();
}

/* ============================
    LOGOUT
============================ */
document.getElementById("btnSair").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "../index.html";
});
