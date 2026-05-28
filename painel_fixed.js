import Voo from './Voo.js';
import { bootstrapVoos } from './AeroportoController.js';

let meuVoo = null;
let listaVoos = [];


const mensagemTela = document.getElementById("avisoSistema");

function registrarNovoVoo() {
    const cod = document.getElementById("input-codigo").value;
    const ori = document.getElementById("input-origem").value;
    const des = document.getElementById("input-destino").value;

    try {
        console.log("Tentando validar plano de voo...");




        meuVoo = new Voo(cod, des);

        mensagemTela.innerText = "✅ Voo validado e registrado com sucesso!";
        mensagemTela.style.color = "var(--success)";

        document.getElementById("txt-codigo").innerText = meuVoo.codigo;


        document.getElementById("txt-origem").innerText = ori;
        document.getElementById("txt-destino").innerText = meuVoo.destino;

        document.getElementById("txt-status").innerText = "AGUARDANDO";
    } catch (erro) {
        console.error("Resgate acionado: Interrompendo criação de voo inválido.");

        mensagemTela.innerText = erro.message;
        mensagemTela.style.color = "var(--danger)";

        document.querySelector('.dashboard-card').style.animation = 'none';
        setTimeout(() => {
            document.querySelector('.dashboard-card').style.animation = 'cardEntrance 0.5s';
        }, 10);
    } finally {
        console.log("Protocolo de verificação de registro finalizado.");
    }
}

document.getElementById("btn-registrar").addEventListener("click", registrarNovoVoo);

function atualizarStatusUI(texto, classe) {
    const el = document.getElementById("txt-status");
    el.innerText = texto;
    if (classe) el.className = `badge ${classe}`;
}

function atualizarAltitudeUI(altitude) {
    document.getElementById("txt-altitude").innerText = altitude.toString();
}


function bindBotoes() {
    document.getElementById("btn-decolar").addEventListener("click", () => {
        if (!meuVoo) return alert("Registre um voo primeiro!");
        meuVoo.decolar();
        atualizarStatusUI("EM VOO", "badge-flying");
        atualizarAltitudeUI(meuVoo.altitude ?? 1000);
        document.getElementById("aviao").classList.add("flying");
    });

    document.getElementById("btn-subir").addEventListener("click", () => {
        if (!meuVoo) return alert("Registre um voo primeiro!");
        if (typeof meuVoo.ganharAltitude !== 'function') return;

        meuVoo.ganharAltitude();
        atualizarAltitudeUI(meuVoo.altitude);
    });

    document.getElementById("btn-descer").addEventListener("click", () => {
        if (!meuVoo) return alert("Registre um voo primeiro!");
        if (typeof meuVoo.descer !== 'function') return;

        meuVoo.descer();
        atualizarAltitudeUI(meuVoo.altitude);
    });

    document.getElementById("btn-pousar").addEventListener("click", () => {
        if (!meuVoo) return alert("Registre um voo primeiro!");
        if (typeof meuVoo.pousar !== 'function') return;

        meuVoo.pousar();
        atualizarStatusUI("POUSADO", "badge-ground");
        atualizarAltitudeUI(meuVoo.altitude ?? 0);
        document.getElementById("aviao").classList.remove("flying");
    });
}

function renderizarVoosNaLista(voos) {
    const container = document.getElementById('lista-voos');
    if (!container) return;

    container.innerHTML = '';

    voos.forEach((v) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'voo-btn';
        btn.innerText = `${v.codigo} - ${v.destino}`;
        btn.addEventListener('click', () => {
            meuVoo = v;
            document.getElementById('txt-codigo').innerText = meuVoo.codigo;
            document.getElementById('txt-origem').innerText = meuVoo.origem ?? '--';
            document.getElementById('txt-destino').innerText = meuVoo.destino;
            document.getElementById('txt-status').innerText = 'AGUARDANDO';
            document.getElementById('txt-altitude').innerText = String(meuVoo.altitude ?? 0);
            document.getElementById('avisoSistema').innerText = '✅ Voo selecionado';
            document.getElementById('avisoSistema').style.color = 'var(--success)';
            document.getElementById('aviao').classList.remove('flying');
        });
        container.appendChild(btn);
    });
}

listaVoos = bootstrapVoos().voos;
renderizarVoosNaLista(listaVoos);

bindBotoes();



