

class Voo {
    constructor(codigo, origem, destino, horario) {
        this.codigo = codigo;
        this.origem = origem;
        this.destino = destino;
        this.horario = horario;
        this.status = "Aguardando";
        this.altitude = 0;
        this.velocidade = 0;
        this.temperatura = 15;
        this.combustivel = 100;
        this.maxAltitude = 12500;
        this.isFlying = false;
    }

    atualizarInterface() {
        document.getElementById("txt-codigo").innerText = this.codigo;
        document.getElementById("txt-origem").innerText = this.origem;
        document.getElementById("txt-destino").innerText = this.destino;
        document.getElementById("txt-horario").innerText = this.horario;
        document.getElementById("txt-altitude").innerText = this.altitude.toLocaleString();
        
        const badge = document.getElementById("txt-status");
        badge.className = 'badge';
        
        if (this.status === "Em Voo") {
            badge.innerText = "EM VOO";
            badge.classList.add("badge-flying");
        } else if (this.status === "Pousado") {
            badge.innerText = "POUSADO";
            badge.classList.add("badge-ground");
        } else {
            badge.innerText = "AGUARDANDO";
            badge.classList.add("badge-waiting");
        }

        const altitudePercent = Math.min((this.altitude / this.maxAltitude) * 100, 100);
        document.getElementById("altitude-fill").style.width = altitudePercent + "%";
        document.getElementById("altitude-percent").innerText = Math.round(altitudePercent) + "%";

        const imgAviao = document.getElementById("aviao");
        const glowAviao = document.querySelector(".airplane-glow");
        
        if (this.isFlying) {
            imgAviao.classList.add("flying");
            glowAviao.classList.add("flying");
        } else {
            imgAviao.classList.remove("flying");
            glowAviao.classList.remove("flying");
        }

        this.log(`Interface atualizada - Altitude: ${this.altitude}m`);
    }

    decolar() {
        if (this.status === "Aguardando" || this.status === "Pousado") {
            this.status = "Em Voo";
            this.altitude = 1000;
            this.velocidade = 250;
            this.isFlying = true;
            
            this.log("🚀 DECOLAGEM INICIADA!", "success");
            this.log(`✈️ Voo ${this.codigo} decolou de ${this.origem}`, "success");
            this.log(`📍 Rumo a ${this.destino}`, "info");
            this.log(`🛫 Velocidade: ${this.velocidade} km/h`, "info");
            
            this.atualizarInterface();
            this.criarExplosaoParticulas();
        } else {
            this.log("⚠️ Avião já está em voo!", "warning");
        }
    }

    pousar() {
        if (this.status === "Em Voo") {
            this.status = "Pousado";
            this.altitude = 0;
            this.velocidade = 0;
            this.isFlying = false;
            
            this.log("🛬 PROCEDIMENTO DE POUSO INICIADO", "warning");
            this.log("⬇️ Descendendo...", "info");
            this.log("✈️ Pouso realizado com sucesso!", "success");
            this.log(`🏁 Voo ${this.codigo} encerrado em ${this.destino}`, "success");
            
            this.atualizarInterface();
        } else {
            this.log("⚠️ Avião está no solo!", "warning");
        }
    }

    ganharAltitude() {
        if (this.status === "Em Voo") {
            if (this.altitude < this.maxAltitude) {
                this.altitude += 1500;
                this.velocidade += 50;
                this.combustivel -= 2;
                
                this.log(`⬆️ Subindo para ${this.altitude}m`, "info");
                this.log(`🚀 Velocidade: ${this.velocidade} km/h`, "info");
                this.log(`⛽ Combustível: ${this.combustivel}%`, "warning");
                
                this.atualizarInterface();
            } else {
                this.log("⚠️ Altitude máxima atingida!", "danger");
            }
        } else {
            this.log("🚫 Não é possível subir! Avião no solo.", "danger");
        }
    }

    descer() {
        if (this.status === "Em Voo") {
            if (this.altitude > 1000) {
                this.altitude -= 1500;
                this.velocidade -= 30;
                
                this.log(`⬇️ Descendo para ${this.altitude}m`, "info");
                this.log(`🚀 Velocidade: ${this.velocidade} km/h`, "info");
                
                this.atualizarInterface();
            } else {
                this.log("⚠️ Para pousar, use o botão POUSAR!", "warning");
            }
        } else {
            this.log("🚫 Não é possível descer! Avião no solo.", "danger");
        }
    }

    log(mensagem, tipo = "info") {
        const consoleOutput = document.getElementById("console-output");
        const entry = document.createElement("div");
        entry.className = `log-entry ${tipo}`;
        
        const agora = new Date();
        const hora = agora.toLocaleTimeString("pt-BR", { hour12: false });
        
        entry.innerHTML = `> [${hora}] ${mensagem}`;
        consoleOutput.appendChild(entry);

        consoleOutput.scrollTop = consoleOutput.scrollHeight;
        
        if (consoleOutput.children.length > 50) {
            consoleOutput.removeChild(consoleOutput.firstChild);
        }
    }

    criarExplosaoParticulas() {
        const skyView = document.querySelector(".sky-view");
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement("div");
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: #00f2fe;
                border-radius: 50%;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 0 0 10px #00f2fe, 0 0 20px #00f2fe;
                animation: explode ${1 + Math.random()}s ease-out forwards;
                animation-delay: ${Math.random() * 0.3}s;
            `;
                    if (!document.getElementById("dynamic-styles")) {
                const style = document.createElement("style");
                style.id = "dynamic-styles";
                style.textContent = `
                    @keyframes explode {
                        0% { transform: translateX(-50%) scale(1); opacity: 1; }
                        100% { 
                            transform: translateX(${(-100 - Math.random() * 100) + "px"}) 
                                     translateY(${-50 - Math.random() * 100 + "px"}) 
                                     scale(0); 
                            opacity: 0; 
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            skyView.appendChild(particle);
            
 
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }
}


class ParticleSystem {
    constructor() {
        this.container = document.getElementById("particles");
        this.particles = [];
        this.quantidade = 50;
        this.criarParticulas();
    }

    criarParticulas() {
        for (let i = 0; i < this.quantidade; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";
            

            particle.style.left = Math.random() * 100 + "%";
            particle.style.animationDelay = Math.random() * 15 + "s";
            particle.style.animationDuration = (15 + Math.random() * 10) + "s";
            
            // Tamanho aleatório
            const size = 2 + Math.random() * 4;
            particle.style.width = size + "px";
            particle.style.height = size + "px";
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }
}



class StarSystem {
    constructor() {
        this.container = document.getElementById("stars");
        this.criarEstrelas();
    }

    criarEstrelas() {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement("div");
            star.className = "star";
            star.style.left = Math.random() * 100 + "%";
            star.style.top = Math.random() * 100 + "%";
            
            const size = 1 + Math.random() * 2;
            star.style.width = size + "px";
            star.style.height = size + "px";
            star.style.animationDelay = Math.random() * 2 + "s";
            
            this.container.appendChild(star);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const particles = new ParticleSystem();
    const stars = new StarSystem();
    

    const meuVoo = new Voo("SKY-777", "São Paulo (GRU)", "Maldivas (MLE)", "22:45");
    

    meuVoo.atualizarInterface();
    

    setTimeout(() => {
        meuVoo.log("=" .repeat(30), "system");
        meuVoo.log("🌟 BEM-VINDO AO SKYCONTROL V-MAGIC!", "success");
        meuVoo.log("=" .repeat(30), "system");
        meuVoo.log(`✈️ Voo ${meuVoo.codigo} pronto para decolagem`, "info");
        meuVoo.log(`📍 Rota: ${meuVoo.origem} → ${meuVoo.destino}`, "info");
        meuVoo.log(`🕐 Horário: ${meuVoo.horario}`, "info");
        meuVoo.log("💡 Use os botões para controlar o voo", "system");
    }, 500);

    window.meuVoo = meuVoo;
});
