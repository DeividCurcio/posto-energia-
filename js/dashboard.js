// Dashboard logic using localStorage and Chart.js
/* ============================
      VERIFICA SE É ADMIN
============================ */
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (!usuarioLogado || usuarioLogado.admin !== true) {
    alert("Acesso negado!");
    window.location.href = "index.html";
}

/* ============================
      TOTAL DE USUÁRIOS
============================ */
let totalUsuarios = 0;
let totalAssinantes = 0;

let economiaBronze = 0;
let economiaPrata = 0;
let economiaOuro = 0;
let economiaTotal = 0;

let planos = { bronze: 0, prata: 0, ouro: 0 };

for (let i = 0; i < localStorage.length; i++) {
    let chave = localStorage.key(i);

    if (chave.includes("@")) {
        let u = JSON.parse(localStorage.getItem(chave));

        totalUsuarios++;

        if (u.plano !== "Nenhum" && u.plano !== "Admin") {
            totalAssinantes++;
        }

        economiaTotal += Number(u.economia || 0);

        if (u.plano === "bronze") {
            planos.bronze++;
            economiaBronze += Number(u.economia || 0);
        }
        if (u.plano === "prata") {
            planos.prata++;
            economiaPrata += Number(u.economia || 0);
        }
        if (u.plano === "ouro") {
            planos.ouro++;
            economiaOuro += Number(u.economia || 0);
        }
    }
}

/* Exibir números */
document.getElementById("totalUsuarios").textContent = totalUsuarios;
document.getElementById("totalAssinantes").textContent = totalAssinantes;
document.getElementById("economiaTotal").textContent = economiaTotal.toFixed(2);

/* ============================
      GRÁFICO 1 - PLANOS
============================ */
new Chart(document.getElementById("graficoPlanos"), {
    type: "pie",
    data: {
        labels: ["Bronze", "Prata", "Ouro"],
        datasets: [{
            data: [planos.bronze, planos.prata, planos.ouro],
            backgroundColor: ["#cd7f32", "silver", "gold"]
        }]
    }
});

/* ============================
      GRÁFICO 2 - ECONOMIA POR PLANO
============================ */
new Chart(document.getElementById("graficoEconomia"), {
    type: "bar",
    data: {
        labels: ["Bronze", "Prata", "Ouro"],
        datasets: [{
            label: "Economia Total",
            data: [economiaBronze, economiaPrata, economiaOuro],
            backgroundColor: ["#cd7f32", "silver", "gold"]
        }]
    }
});

/* ============================
      GRÁFICO 3 - HISTÓRICO DE LOGINS
============================ */
let logins = JSON.parse(localStorage.getItem("loginHistorico")) || [];

new Chart(document.getElementById("graficoLogins"), {
    type: "line",
    data: {
        labels: logins.map(l => l.data),
        datasets: [{
            label: "Logins por dia",
            data: logins.map(l => l.qtd),
            borderColor: "#003b75",
            backgroundColor: "#78a8ff"
        }]
    }
});

/* ============================
      BOTÃO SAIR
============================ */
document.getElementById("btnSair").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
});
