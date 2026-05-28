import Voo from './Voo.js';

export default class Aeroporto {
    constructor(nomeDaBase) {
        this.nome = nomeDaBase;
        this.listaDeVoos = [];

    }


    adicionarVooNoRadar(novoVoo) {

        this.listaDeVoos.push(novoVoo);
        console.log(`Voo ${novoVoo.codigo} adicionado ao radar do aeroporto ${this.nome}.`);
    }


    buscarVoo(codigoProcurado) {

        const vooEncontrado = this.listaDeVoos.find((v) => v.codigo === codigoProcurado);
        
        if (!vooEncontrado) {
            return `Erro: Voo com código "${codigoProcurado}" não encontrado no aeroporto ${this.nome}.`;
        }

        return vooEncontrado;
    }
}

