/* ============================
    CUPOM NO PAGAMENTO
============================ */
let cupons = JSON.parse(localStorage.getItem("cupons")) || [];

document.addEventListener("DOMContentLoaded", () => {
    const campoCupom = document.createElement("input");
    campoCupom.placeholder = "Insira um cupom (opcional)";
    campoCupom.id = "campoCupom";
    campoCupom.style.marginTop = "10px";

    const modalContent = document.querySelector("#modalPagamento .modal-content");
    if (modalContent) {
        modalContent.appendChild(campoCupom);
    }
});

/* Aplica cupom antes da confirmação */
function aplicarCupom(valor) {
    const input = document.getElementById("campoCupom");
    const codigo = (input ? input.value : "").trim();

    if (!codigo) return valor;

    const cupom = cupons.find(c => c.codigo === codigo);

    if (!cupom) {
        alert("Cupom inválido!");
        return valor;
    }

    if (cupom.usado) {
        alert("Cupom já foi utilizado!");
        return valor;
    }

    const novoValor = valor - (valor * (cupom.desconto / 100));

    cupom.usado = true;
    localStorage.setItem("cupons", JSON.stringify(cupons));

    alert(`Cupom aplicado! Novo valor: R$ ${novoValor.toFixed(2)}`);

    return novoValor;
}
