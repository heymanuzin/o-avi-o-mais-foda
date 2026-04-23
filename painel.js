
import Voo from './Voo.js';


let meuVoo = null;

const mensagemTela = document.getElementById("avisoSistema");

function registrarNovoVoo() {
    const cod = document.getElementById("input-codigo").value;
    const ori = document.getElementById("input-origem").value;
    const des = document.getElementById("input-destino").value;


    try {
        console.log("Tentando validar plano de voo...");
        
      
        meuVoo = new Voo(cod, ori, des, "Imediato");

        mensagemTela.innerText = "✅ Voo validado e registrado com sucesso!";
        mensagemTela.style.color = "var(--success)";
        
        document.getElementById("txt-codigo").innerText = meuVoo.codigo;
        document.getElementById("txt-origem").innerText = meuVoo.origem;
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


window.meuVooController = {
    decolar: () => {
        if(meuVoo) {
            meuVoo.decolar();
            document.getElementById("txt-status").innerText = "EM VOO";
            document.getElementById("txt-status").className = "badge badge-flying";
            document.getElementById("aviao").classList.add("flying");
        } else {
            alert("Registre um voo primeiro!");
        }
    }
};