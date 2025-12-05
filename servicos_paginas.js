document.querySelectorAll(".serv").forEach(card => {
    card.addEventListener("click", () => {
        let serv = card.dataset.serv;
        window.location.href = `../servico_${serv}.html`;
    });
});
