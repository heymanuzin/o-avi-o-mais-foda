// Voo.js
class Voo {
    constructor(codigo, origem, destino, horario) {
    
        if (!codigo || codigo.trim() === "") {
            throw new Error("✈️ Erro Crítico: O voo precisa de um código de identificação.");
        }
        if (origem === destino) {
            throw new Error(`🚫 Operação Negada: Origem (${origem}) não pode ser igual ao destino!`);
        }

        this.codigo = codigo;
        this.origem = origem;
        this.destino = destino;
        this.horario = horario;
        this.status = "Aguardando";
        this.altitude = 0;
        this.isFlying = false;
    }

  
    decolar() {
        this.status = "Em Voo";
        this.altitude = 1000;
        this.isFlying = true;
    }
}

export default Voo;