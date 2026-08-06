/* 
=========================================================
RELATÓRIO DE AUDITORIA (SERIALIZAÇÃO E RE-HIDRATAÇÃO)
Auditores: [Nome do Aluno A] e [Nome do Aluno B]

1. Por que o formato JSON (JSON.stringify) não consegue salvar "métodos" (funções) de uma classe, salvando apenas os "atributos" (dados textuais)?
R: O formato JSON é um padrão de troca de dados que representa apenas informações estruturadas e textuais (objetos, arrays, strings, números, booleanos e null). Ele não possui uma representação para funções ou métodos. Quando o JSON.stringify() percorre o objeto, ele só serializa as propriedades que contêm dados (os atributos como código, origem e status). As funções não são dados serializáveis, então são simplesmente ignoradas no processo. Funcões pertencem ao mundo do código executável do JavaScript, não ao mundo dos dados puros representáveis em texto.

2. O que o JavaScript perde na memória quando converte um Objeto para JSON? (Explique o que é o Prototype).
R: O JavaScript perde o Prototype (o protótipo) do objeto na memória. O Prototype é o "modelo/planta" que define os métodos e propriedades compartilhados de uma classe — é nele que vivem métodos como o decolar(). Quando usamos JSON.parse(), o retorno é um "Objeto Literal" (POJO - Plain Old JavaScript Object), que é apenas um pacote de dados sem conexão com a classe Voo. Por isso o objeto "morto" tem os atributos (dados) mas não possui o Prototype, ficando sem o método decolar() e causando o erro "is not a function".

3. Defina o que é "Re-hidratar um Objeto". Como nós consertamos o código do Júnior aplicando essa técnica?
R: Re-hidratar um objeto é o processo de transformar dados crus (que vieram de uma fonte persistente como o JSON) de volta em uma instância "viva" de uma classe, reconstruindo seu Prototype e fazendo seus métodos voltarem a funcionar. Nós consertamos o código do Júnior usando o operador 'new' para recriar a instância da classe Voo a partir dos dados recuperados do disco: criamos um novo Voo passando os atributos lidos do JSON (vooRecuperado.codigo e vooRecuperado.origem) e restauramos o status. Assim, o objeto re-hidratado volta a ter o método decolar() funcionando.
=========================================================
*/

// SISTEMA DE LOGBOOK (PERSISTÊNCIA) - ESCRITO PELO DEV JÚNIOR
// Erro Crítico: Os objetos perdem seus métodos após passar pelo JSON!

class Voo {
    constructor(codigo, origem) {
        this.codigo = codigo;
        this.origem = origem;
        this.status = "No Solo";
    }

    decolar() {
        this.status = "Em Voo";
        console.log(`🛫 O voo ${this.codigo} acabou de decolar de ${this.origem}!`);
    }
}

console.log("=== SALVANDO O VOO NO DISCO ===");
// 1. O Júnior criou um Voo Rico (com métodos) e salvou no disco (Stringify)
let vooOriginal = new Voo("G3-777", "Curitiba");
console.log("Teste antes de salvar:");
vooOriginal.decolar(); // Aqui funciona perfeitamente!

// Salvando...
localStorage.setItem("meuLogbook", JSON.stringify(vooOriginal));
console.log("Voo salvo com sucesso no LocalStorage!");


console.log("\n=== LENDO O VOO NO DIA SEGUINTE ===");
// 2. No dia seguinte, ele leu do disco (Parse)
let dadosDoDisco = localStorage.getItem("meuLogbook");
let vooRecuperado = JSON.parse(dadosDoDisco);

console.log("Dados recuperados do disco:", vooRecuperado);
console.log("Código recuperado:", vooRecuperado.codigo); // Os atributos estão aí...

// 3. O DESASTRE ACONTECE AQUI!
console.log("Tentando decolar o voo recuperado...");
// vooRecuperado.decolar();
// ERRO CRÍTICO: TypeError: vooRecuperado.decolar is not a function
// Motivo: o JSON.parse devolveu um POJO sem o Prototype da classe Voo,
// portanto o método decolar() não existe no objeto recuperado.

console.log("\n=== APLICANDO A RE-HIDRATAÇÃO DO OBJETO ===");
// A CURA: Re-criamos a instância usando a "planta original" da classe (new Voo)
// 1. Ler o objeto cru do disco (já feito acima: vooRecuperado)
// 2. Criar uma nova instância usando a planta original da classe:
let vooHidratado = new Voo(vooRecuperado.codigo, vooRecuperado.origem);
// 3. Restaurar outros status que podem ter mudado:
vooHidratado.status = vooRecuperado.status;
// 4. Agora sim, mandar o vooHidratado decolar!
console.log("Voo re-hidratado (revivido com o Prototype):", vooHidratado);
vooHidratado.decolar();
console.log("✅ Objeto ressuscitado! O método decolar() voltou a funcionar.");
