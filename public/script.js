const API = "/api/v1";
let requestCount = 0;

const $ = (id) => document.getElementById(id);

function incrementCounter() {
  requestCount++;
  $("statRequests").textContent = requestCount;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
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

/* ===== Tema ===== */
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

/* ===== Health ===== */
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

/* ===== Clima ===== */
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

    out.innerHTML = `
      <div class="weather-card">
        <div class="weather-header">
          <div class="weather-location">
            <h3>${escapeHtml(data.nome)}${data.estado ? " · " + escapeHtml(data.estado) : ""}</h3>
            <div class="weather-coords">${escapeHtml(coords)}</div>
          </div>
          <div class="weather-condition">${escapeHtml(data.clima.condicao)}</div>
        </div>
        <div class="weather-temps">
          <div class="temp-box">
            <div class="temp-label">Mínima</div>
            <div class="temp-value">${data.clima.temperatura_min}<sup>°${escapeHtml(unidade)}</sup></div>
          </div>
          <div class="temp-box">
            <div class="temp-label">Máxima</div>
            <div class="temp-value">${data.clima.temperatura_max}<sup>°${escapeHtml(unidade)}</sup></div>
          </div>
        </div>
      </div>
      ${jsonViewer(data)}`;
  } catch (err) {
    out.innerHTML = erroHTML({ codigo: "FALHA_CONEXAO", mensagem: err.message });
  }
}

/* ===== Cidades por UF ===== */
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
