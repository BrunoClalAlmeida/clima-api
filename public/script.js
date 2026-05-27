const API = "/api/v1";
let requestCount = 0;

const $ = (id) => document.getElementById(id);

function incrementCounter() {
  requestCount++;
  $("statRequests").textContent = requestCount;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}

function loadingHTML(text) {
  return `<div class="loading"><div class="spinner"></div>${text}</div>`;
}

function erroHTML(data) {
  return `
    <div class="erro-card">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div>
        <div class="erro-codigo">${escapeHtml(data.codigo || "ERRO")}</div>
        <div class="erro-msg">${escapeHtml(data.mensagem || "Erro desconhecido")}</div>
      </div>
    </div>`;
}

function jsonViewer(data) {
  return `
    <details class="json-toggle">
      <summary>📄 Ver resposta JSON</summary>
      <pre class="json-output">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
    </details>`;
}

/* === Detecta se é dia ou noite === */
function isDaytime() {
  const h = new Date().getHours();
  return h >= 6 && h < 18;
}

/* === Determina categoria do clima a partir da condição === */
function getWeatherCategory(condicao) {
  const c = (condicao || "").toLowerCase();
  if (c.includes("trovoada") || c.includes("storm") || c.includes("granizo")) return "storm";
  if (c.includes("chuva") || c.includes("garoa") || c.includes("pancada") || c.includes("rain")) return "rain";
  if (c.includes("neblina") || c.includes("fog") || c.includes("nevoeiro")) return "fog";
  if (c.includes("nublado") || c.includes("nuvem") || c.includes("cloud")) return "cloudy";
  return "clear";
}

/* === SVGs dos ícones === */
const WEATHER_ICONS = {
  sun: `
    <svg class="weather-icon sun-icon" viewBox="0 0 100 100" fill="none">
      <circle class="sun-core" cx="50" cy="50" r="22"/>
      <g class="sun-rays" stroke-width="3.5" stroke-linecap="round">
        <line x1="50" y1="8" x2="50" y2="18"/>
        <line x1="50" y1="82" x2="50" y2="92"/>
        <line x1="8" y1="50" x2="18" y2="50"/>
        <line x1="82" y1="50" x2="92" y2="50"/>
        <line x1="20" y1="20" x2="27" y2="27"/>
        <line x1="73" y1="73" x2="80" y2="80"/>
        <line x1="20" y1="80" x2="27" y2="73"/>
        <line x1="73" y1="27" x2="80" y2="20"/>
      </g>
    </svg>`,
  moon: `
    <svg class="weather-icon moon-icon" viewBox="0 0 100 100" fill="none">
      <path class="moon-shape" d="M65 18 A 35 35 0 1 0 82 65 A 28 28 0 0 1 65 18 Z"/>
      <circle class="moon-crater" cx="72" cy="48" r="4"/>
      <circle class="moon-crater" cx="60" cy="62" r="3"/>
      <circle class="moon-crater" cx="78" cy="58" r="2.5"/>
    </svg>`,
  cloudDay: `
    <svg class="weather-icon cloud-icon" viewBox="0 0 100 100" fill="none">
      <circle cx="32" cy="32" r="14" fill="#fde047" opacity="0.95"/>
      <path class="cloud-shape" d="M28 60 Q 18 60 18 70 Q 18 80 30 80 L 72 80 Q 84 80 84 70 Q 84 60 72 58 Q 70 46 56 46 Q 42 46 40 58 Q 32 58 28 60 Z"/>
    </svg>`,
  cloudNight: `
    <svg class="weather-icon cloud-icon" viewBox="0 0 100 100" fill="none">
      <path d="M40 28 A 14 14 0 1 0 30 40 A 11 11 0 0 1 40 28 Z" fill="#e2e8f0" opacity="0.9"/>
      <path class="cloud-shape" d="M28 60 Q 18 60 18 70 Q 18 80 30 80 L 72 80 Q 84 80 84 70 Q 84 60 72 58 Q 70 46 56 46 Q 42 46 40 58 Q 32 58 28 60 Z"/>
    </svg>`,
  rain: `
    <svg class="weather-icon rain-icon" viewBox="0 0 100 100" fill="none">
      <path class="cloud-shape" d="M25 45 Q 15 45 15 55 Q 15 65 27 65 L 73 65 Q 85 65 85 55 Q 85 45 73 43 Q 71 32 56 32 Q 41 32 39 43 Q 30 43 25 45 Z"/>
      <ellipse class="rain-drop" cx="32" cy="78" rx="2.5" ry="5"/>
      <ellipse class="rain-drop" cx="50" cy="78" rx="2.5" ry="5"/>
      <ellipse class="rain-drop" cx="68" cy="78" rx="2.5" ry="5"/>
      <ellipse class="rain-drop" cx="41" cy="85" rx="2.5" ry="5"/>
    </svg>`,
  storm: `
    <svg class="weather-icon storm-icon" viewBox="0 0 100 100" fill="none">
      <path class="cloud-shape" d="M25 40 Q 15 40 15 50 Q 15 60 27 60 L 73 60 Q 85 60 85 50 Q 85 40 73 38 Q 71 27 56 27 Q 41 27 39 38 Q 30 38 25 40 Z"/>
      <path class="bolt" d="M52 60 L 38 80 L 48 80 L 42 95 L 60 72 L 50 72 L 56 60 Z"/>
    </svg>`,
  fog: `
    <svg class="weather-icon fog-icon" viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-width="5">
      <line class="fog-line" x1="15" y1="35" x2="85" y2="35"/>
      <line class="fog-line" x1="20" y1="50" x2="80" y2="50"/>
      <line class="fog-line" x1="15" y1="65" x2="85" y2="65"/>
      <line class="fog-line" x1="25" y1="80" x2="75" y2="80"/>
    </svg>`
};

/* === Escolhe ícone + classe do card === */
function pickWeatherStyle(condicao) {
  const cat = getWeatherCategory(condicao);
  const day = isDaytime();

  let icon, cardClass;
  if (cat === "storm") { icon = WEATHER_ICONS.storm; cardClass = "is-day-storm"; }
  else if (cat === "rain") { icon = WEATHER_ICONS.rain; cardClass = day ? "is-day-rain" : "is-night-rain"; }
  else if (cat === "fog") { icon = WEATHER_ICONS.fog; cardClass = day ? "is-day-cloudy" : "is-night-cloudy"; }
  else if (cat === "cloudy") {
    icon = day ? WEATHER_ICONS.cloudDay : WEATHER_ICONS.cloudNight;
    cardClass = day ? "is-day-cloudy" : "is-night-cloudy";
  } else {
    icon = day ? WEATHER_ICONS.sun : WEATHER_ICONS.moon;
    cardClass = day ? "is-day-clear" : "is-night-clear";
  }
  return { icon, cardClass };
}

/* === Tema === */
const themeToggle = $("themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.documentElement.setAttribute("data-theme", "light");

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  if (current === "light") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
});

/* === Health === */
$("btnHealth").addEventListener("click", async () => {
  const out = $("healthResult");
  out.innerHTML = loadingHTML("Verificando serviço...");
  try {
    const res = await fetch(API + "/health");
    const data = await res.json();
    incrementCounter();
    out.innerHTML = `
      <div class="health-success">
        <div class="pulse-dot"></div>
        <div class="health-info">
          <strong>Serviço Operacional</strong>
          <span>versão ${escapeHtml(data.versao)} · ${escapeHtml(new Date(data.timestamp).toLocaleString("pt-BR"))}</span>
        </div>
      </div>
      ${jsonViewer(data)}`;
  } catch (err) {
    out.innerHTML = erroHTML({ codigo: "FALHA_CONEXAO", mensagem: err.message });
  }
});

/* === Clima === */
$("btnClima").addEventListener("click", buscarClima);
$("inputCidade").addEventListener("keypress", (e) => { if (e.key === "Enter") buscarClima(); });

document.querySelectorAll(".chip[data-cidade]").forEach(chip => {
  chip.addEventListener("click", () => {
    $("inputCidade").value = chip.dataset.cidade;
    buscarClima();
  });
});

async function buscarClima() {
  const cidade = $("inputCidade").value.trim();
  const out = $("climaResult");

  if (!cidade) {
    out.innerHTML = erroHTML({ codigo: "ENTRADA_VAZIA", mensagem: "Digite o nome de uma cidade." });
    return;
  }

  out.innerHTML = loadingHTML("Buscando dados climáticos...");

  try {
    const res = await fetch(API + "/clima/" + encodeURIComponent(cidade));
    const data = await res.json();
    incrementCounter();

    if (!res.ok) {
      out.innerHTML = erroHTML(data) + jsonViewer(data);
      return;
    }

    const coords = (data.latitude && data.longitude)
      ? `${data.latitude.toFixed(3)}, ${data.longitude.toFixed(3)}`
      : "";

    const unidade = (data.clima.unidades && data.clima.unidades.temperatura) || "C";
    const { icon, cardClass } = pickWeatherStyle(data.clima.condicao);

    out.innerHTML = `
      <div class="weather-card ${cardClass}">
        <div class="weather-top">
          <div class="weather-location">
            <h3>${escapeHtml(data.nome)}${data.estado ? " · " + escapeHtml(data.estado) : ""}</h3>
            <div class="weather-coords">${escapeHtml(coords)}</div>
            <div class="weather-condition">${escapeHtml(data.clima.condicao)}</div>
          </div>
          ${icon}
        </div>
        <div class="weather-temps">
          <div class="temp-box">
            <div class="temp-icon cold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M5 12h14M6 6l12 12M18 6L6 18"/>
              </svg>
            </div>
            <div class="temp-content">
              <div class="temp-label">Mínima</div>
              <div class="temp-value">${data.clima.temperatura_min}<sup>°${escapeHtml(unidade)}</sup></div>
            </div>
          </div>
          <div class="temp-box">
            <div class="temp-icon hot">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
              </svg>
            </div>
            <div class="temp-content">
              <div class="temp-label">Máxima</div>
              <div class="temp-value">${data.clima.temperatura_max}<sup>°${escapeHtml(unidade)}</sup></div>
            </div>
          </div>
        </div>
      </div>
      ${jsonViewer(data)}`;
  } catch (err) {
    out.innerHTML = erroHTML({ codigo: "FALHA_CONEXAO", mensagem: err.message });
  }
}

/* === Cidades por UF === */
$("btnCidades").addEventListener("click", listarCidades);
$("inputUF").addEventListener("keypress", (e) => { if (e.key === "Enter") listarCidades(); });
$("inputLimite").addEventListener("keypress", (e) => { if (e.key === "Enter") listarCidades(); });

document.querySelectorAll(".chip[data-uf]").forEach(chip => {
  chip.addEventListener("click", () => {
    $("inputUF").value = chip.dataset.uf;
    listarCidades();
  });
});

async function listarCidades() {
  const uf = $("inputUF").value.trim();
  const limite = $("inputLimite").value || 10;
  const out = $("cidadesResult");

  if (!uf) {
    out.innerHTML = erroHTML({ codigo: "ENTRADA_VAZIA", mensagem: "Digite a sigla do estado." });
    return;
  }

  out.innerHTML = loadingHTML("Carregando cidades...");

  try {
    const res = await fetch(API + "/cidades/" + encodeURIComponent(uf) + "?limite=" + limite);
    const data = await res.json();
    incrementCounter();

    if (!res.ok) {
      out.innerHTML = erroHTML(data) + jsonViewer(data);
      return;
    }

    const items = data.cidades.map(c => `<div class="cidade-item"><span>${escapeHtml(c.nome)}</span></div>`).join("");

    out.innerHTML = `
      <div class="cidades-header">
        <span class="success-badge">${data.quantidade_retornada} cidades</span>
        <span class="uf-info">Estado: <strong>${escapeHtml(data.uf)}</strong></span>
      </div>
      <div class="cidades-grid">${items}</div>
      ${jsonViewer(data)}`;
  } catch (err) {
    out.innerHTML = erroHTML({ codigo: "FALHA_CONEXAO", mensagem: err.message });
  }
}