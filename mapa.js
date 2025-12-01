/* ===============================================
    CONFIGURAÇÃO DO POSTO
================================================ */
const posto = {
    nome: "Posto Energia+",
    lat: -22.9035,   // coloque a LATITUDE do seu posto
    lng: -43.2096    // coloque a LONGITUDE do seu posto
};

/* ===============================================
      INICIAR MAPA
================================================ */
let map = L.map('map').setView([posto.lat, posto.lng], 15);

// adicionar mapa base gratuito
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// marcador do posto
L.marker([posto.lat, posto.lng])
    .addTo(map)
    .bindPopup(`<b>${posto.nome}</b><br>Estamos aqui!`)
    .openPopup();

/* ===============================================
      LOCALIZAÇÃO DO USUÁRIO
================================================ */
let btnLocalizar = document.getElementById("btnLocalizar");
let distanciaTxt = document.getElementById("distancia");

btnLocalizar.addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocalização não é suportada pelo seu navegador.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        sucessoLocalizacao,
        erroLocalizacao
    );
});

function sucessoLocalizacao(pos) {
    let userLat = pos.coords.latitude;
    let userLng = pos.coords.longitude;

    // marcador do usuário
    L.marker([userLat, userLng], { color: "blue" })
        .addTo(map)
        .bindPopup("Você está aqui.")
        .openPopup();

    // ajustar visão
    map.setView([userLat, userLng], 14);

    // calcular distância
    let distancia = calcularDistancia(userLat, userLng, posto.lat, posto.lng);
    distanciaTxt.textContent = `Distância até o posto: ${distancia.toFixed(2)} km`;

    registrarVisita();
}

function erroLocalizacao() {
    alert("Não foi possível obter sua localização.");
}

/* ===============================================
      CALCULAR DISTÂNCIA ENTRE 2 PONTOS
================================================ */

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    let dLat = (lat2 - lat1) * Math.PI / 180;
    let dLon = (lon2 - lon1) * Math.PI / 180;

    let a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) *
        Math.sin(dLon/2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/* ===============================================
      REGISTRAR ÚLTIMA VISITA
================================================ */

function registrarVisita() {
    let agora = new Date().toLocaleString("pt-BR");
    localStorage.setItem("ultimaVisitaPosto", agora);
    document.getElementById("ultimaVisita").textContent = agora;
}

/* carregar última visita */
let ultima = localStorage.getItem("ultimaVisitaPosto");
if (ultima) {
    document.getElementById("ultimaVisita").textContent = ultima;
}
