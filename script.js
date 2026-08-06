script>
  /* ---------- MODELO ---------- */
  class Voo {
    constructor(codigo, origem, destino, horario, status) {
      this.id = Voo.gerarId();
      this.codigo = codigo.toUpperCase();
      this.origem = origem;
      this.destino = destino;
      this.horario = horario;
      this.status = status || "No Solo";
    }
    static gerarId(){
      return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
    }
    decolar(){ this.status = "Em Voo"; }
    pousar(){ this.status = "Pousado"; }
    atrasar(){ this.status = "Atrasado"; }
    liberar(){ this.status = "No Solo"; }
  }

  const STORAGE_KEY = "aeroporto_inteligente_logbook";
  let voos = [];

  /* ---------- PERSISTÊNCIA (com re-hidratação) ---------- */
  function salvar(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(voos));
  }

  function carregar(){
    const cru = localStorage.getItem(STORAGE_KEY);
    if(!cru){
      voos = seedInicial();
      salvar();
      return;
    }
    const dadosCrus = JSON.parse(cru);
    // re-hidratação: recria instâncias reais da classe Voo a partir do JSON puro
    voos = dadosCrus.map(d => {
      const v = new Voo(d.codigo, d.origem, d.destino, d.horario, d.status);
      v.id = d.id;
      return v;
    });
  }

  function seedInicial(){
    return [
      new Voo("G3-777", "Curitiba", "Guarulhos", "08:15", "No Solo"),
      new Voo("AD-4521", "Assis Chateaubriand", "Congonhas", "09:40", "Em Voo"),
      new Voo("LA-1090", "Foz do Iguaçu", "Brasília", "10:05", "Atrasado"),
    ];
  }

  /* ---------- RENDER ---------- */
  const boardBody = document.getElementById("boardBody");

  function statusMeta(status){
    const map = {
      "No Solo":  { classe: "no-solo" },
      "Em Voo":   { classe: "em-voo" },
      "Pousado":  { classe: "pousado" },
      "Atrasado": { classe: "atrasado" },
    };
    return map[status] || map["No Solo"];
  }

  function acoesPara(voo){
    const botoes = [];
    if(voo.status === "No Solo"){
      botoes.push(`<button data-action="decolar" data-id="${voo.id}">Decolar</button>`);
      botoes.push(`<button data-action="atrasar" data-id="${voo.id}" class="danger">Atrasar</button>`);
    } else if(voo.status === "Em Voo"){
      botoes.push(`<button data-action="pousar" data-id="${voo.id}">Pousar</button>`);
    } else if(voo.status === "Atrasado"){
      botoes.push(`<button data-action="liberar" data-id="${voo.id}">Liberar</button>`);
      botoes.push(`<button data-action="decolar" data-id="${voo.id}">Decolar</button>`);
    } else if(voo.status === "Pousado"){
      botoes.push(`<button data-action="liberar" data-id="${voo.id}">Reiniciar</button>`);
    }
    botoes.push(`<button data-action="remover" data-id="${voo.id}" class="remove" aria-label="Remover voo ${voo.codigo}">✕</button>`);
    return botoes.join("");
  }

  function render(idParaFlip){
    if(voos.length === 0){
      boardBody.innerHTML = `<div class="empty-msg">Nenhum voo cadastrado. Adicione um voo abaixo para começar.</div>`;
    } else {
      boardBody.innerHTML = voos.map(voo => {
        const meta = statusMeta(voo.status);
        const flip = voo.id === idParaFlip ? "flip" : "";
        return `
        <div class="row ${flip}">
          <div class="tile col-codigo">${voo.horario}</div>
          <div class="tile col-origem"><span>Origem</span>${voo.origem}</div>
          <div class="tile col-destino"><span>Destino</span>${voo.destino}</div>
          <div class="tile">
            <span class="badge ${meta.classe}"><span class="dot"></span>${voo.status}</span>
          </div>
          <div class="actions">${acoesPara(voo)}</div>
        </div>`;
      }).join("");
    }
    atualizarContadores();
  }

  function atualizarContadores(){
    const cont = { "No Solo":0, "Em Voo":0, "Pousado":0, "Atrasado":0 };
    voos.forEach(v => { if(cont[v.status] !== undefined) cont[v.status]++; });
    document.getElementById("cNoSolo").textContent = cont["No Solo"];
    document.getElementById("cEmVoo").textContent = cont["Em Voo"];
    document.getElementById("cPousado").textContent = cont["Pousado"];
    document.getElementById("cAtrasado").textContent = cont["Atrasado"];
  }

  /* ---------- AÇÕES ---------- */
  boardBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if(!btn) return;
    const { action, id } = btn.dataset;
    if(action === "remover"){
      voos = voos.filter(v => v.id !== id);
      salvar();
      render();
      return;
    }
    const voo = voos.find(v => v.id === id);
    if(!voo) return;
    if(action === "decolar") voo.decolar();
    if(action === "pousar") voo.pousar();
    if(action === "atrasar") voo.atrasar();
    if(action === "liberar") voo.liberar();
    salvar();
    render(id);
  });

  document.getElementById("addFlightForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const codigo = document.getElementById("codigo").value.trim();
    const origem = document.getElementById("origem").value.trim();
    const destino = document.getElementById("destino").value.trim();
    const horario = document.getElementById("horario").value;
    if(!codigo || !origem || !destino || !horario) return;

    const novoVoo = new Voo(codigo, origem, destino, horario);
    voos.push(novoVoo);
    voos.sort((a,b) => a.horario.localeCompare(b.horario));
    salvar();
    render(novoVoo.id);
    e.target.reset();
    document.getElementById("codigo").focus();
  });

  /* ---------- RELÓGIO ---------- */
  function atualizarRelogio(){
    const agora = new Date();
    document.getElementById("clock").textContent = agora.toLocaleTimeString("pt-BR");
    document.getElementById("dateLine").textContent = agora.toLocaleDateString("pt-BR", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric"
    }).toUpperCase();
  }
  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);

  /* ---------- INICIALIZAÇÃO ---------- */
  carregar();
  render();
