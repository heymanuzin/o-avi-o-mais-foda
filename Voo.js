export default class Voo {
    constructor(codigo, destino) {
        this.codigo = codigo;
        this.destino = destino;
        this.status = "No Solo";
        this.altitude = 0;
        this.isFlying = false;
    }

    decolar() {
        this.status = "Em Voo";
        this.altitude = 1000;
        this.isFlying = true;
    }

    ganharAltitude() {
        if (this.status !== "Em Voo") return;
        this.altitude += 1500;
    }

    descer() {
        if (this.status !== "Em Voo") return;
        this.altitude = Math.max(0, this.altitude - 1500);
    }

    pousar() {
        this.status = "Pousado";
        this.altitude = 0;
        this.isFlying = false;
    }
}


