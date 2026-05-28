import Aeroporto from './Aeroporto.js';
import Voo from './Voo.js';

const aeroporto = new Aeroporto('TORRE-1');

const createMockVoos = () => {
  const exemplos = [
    { codigo: 'SKY-777', origem: 'São Paulo (GRU)', destino: 'Maldivas (MLE)' },
    { codigo: 'NEO-204', origem: 'Rio de Janeiro (GIG)', destino: 'Lisboa (LIS)' },
    { codigo: 'AUR-618', origem: 'Belo Horizonte (CNF)', destino: 'Miami (MIA)' },
    { codigo: 'ION-901', origem: 'Curitiba (CWB)', destino: 'Buenos Aires (EZE)' },
  ];

  return exemplos.map((e, idx) => {
    const voo = new Voo(e.codigo, e.destino);
    voo.origem = e.origem;
    voo.destino = e.destino;
    voo.horario = idx % 2 === 0 ? '22:45' : '23:10';
    return voo;
  });
};

export const bootstrapVoos = () => {
  const voos = createMockVoos();
  voos.forEach((v) => aeroporto.adicionarVooNoRadar(v));
  return { aeroporto, voos };
};

