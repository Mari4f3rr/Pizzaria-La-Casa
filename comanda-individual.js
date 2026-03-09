let total = 0;
let tipoSelecionado = null;
let temRodizio = false; // Variável para controlar se o rodízio já foi adicionado

/* ========================= */
/* SABORES E DADOS DA PIZZA */
/* ========================= */

const pizzas = {
    salgada: [
        "Calabresa","Mussarela","Portuguesa","Frango com Catupiry","Marguerita",
        "Napolitana","Baiana","Quatro Queijos","Atum","Palmito",
        "Milho","Brócolis com Bacon","Toscana","Pepperoni","Lombo Canadense",
        "Carne Seca","Bacon","Alho e Óleo","Escarola","Rúcula com Tomate Seco",
        "Camarão","Mexicana","Filé com Cheddar","Strogonoff","Costela",
        "Carbonara","Caipira","Vegetariana","Parmegiana","Suprema",
        "Italiana","Frango com Milho","Calabresa Especial","Nordestina","Picanha",
        "Sertaneja","Catupiry Especial","Atum com Cebola","Moda da Casa","Cinco Queijos"
    ],
    doce: [
        "Chocolate","Chocolate com Morango","Prestígio","Banana com Canela","Romeu e Julieta",
        "Brigadeiro","Oreo","KitKat","M&M","Doce de Leite"
    ]
};

function carregarSabores() {
    let categoria = document.getElementById("categoriaPizza").value;
    let select1 = document.getElementById("sabor1");
    let select2 = document.getElementById("sabor2");

    select1.innerHTML = "";
    select2.innerHTML = "";

    pizzas[categoria].forEach(sabor => {
        select1.innerHTML += `<option>${sabor}</option>`;
        select2.innerHTML += `<option>${sabor}</option>`;
    });
}

carregarSabores();

function toggleMeioMeio() {
    document.getElementById("sabor2").classList.toggle("hidden");
}

/* ========================= */
/* LÓGICA DE SELEÇÃO E CÁLCULO */
/* ========================= */

// Função unificada para remover QUALQUER item da lista
function removerItem(botao, valorDoItem, isRodizio = false) {
    // Remove o 'li' inteiro que envolve o botão
    botao.parentElement.remove();
    
    // Subtrai o valor do item do total geral
    total -= valorDoItem;
    
    // Se o item removido for o rodízio, libera para adicionar de novo e volta o card de pizza
    if (isRodizio) {
        temRodizio = false;
        document.getElementById("cardPizzas").classList.remove("hidden");
    }

    // Prevenção extra para o total não ficar negativo por erro de float
    if (total < 0) total = 0;

    atualizarValores();
}

function selecionarTipo(tipo) {
    tipoSelecionado = tipo;
    document.getElementById("areaPedidos").classList.remove("hidden");
    document.getElementById("rodapeResultado").classList.remove("hidden");

    let cardPizzas = document.getElementById("cardPizzas");

    if (tipo === "rodizio") {
        if (temRodizio) {
            alert("O Rodízio já está no seu pedido!");
            return; // Impede que adicione outro
        }

        cardPizzas.classList.add("hidden"); // Esconde as pizzas avulsas
        temRodizio = true;
        total += 70; // Soma ao total (não zera mais as bebidas já pedidas!)
        
        let item = document.createElement("li");
        item.innerHTML = `
            <span><strong>1x Rodízio Individual</strong><br> R$70.00</span>
            <button class="btn-remover" onclick="removerItem(this, 70, true)">Remover</button>
        `;
        document.getElementById("listaPedidos").appendChild(item);
        
        atualizarValores();
    } else {
        // Se clicar em avulsa, garante que o card de pizzas está visível
        cardPizzas.classList.remove("hidden");
    }
}

function adicionarPizza() {
    if (tipoSelecionado === "rodizio" && temRodizio) {
        alert("Você está no modo Rodízio! As pizzas já estão inclusas no valor.");
        return;
    }

    let sabor1 = document.getElementById("sabor1").value;
    let meio = document.getElementById("meioMeio").checked;
    let saborFinal = sabor1;

    if (meio) {
        let sabor2 = document.getElementById("sabor2").value;
        saborFinal += " / " + sabor2;
    }

    let tamanho = parseFloat(document.getElementById("tamanho").value);
    let quantidade = parseInt(document.getElementById("quantidadePizza").value);
    let comentario = document.getElementById("comentario").value;

    let valorTotalPizza = tamanho * quantidade;
    total += valorTotalPizza;

    let item = document.createElement("li");
    item.innerHTML = `
        <span><strong>${quantidade}x ${saborFinal}</strong> <br> R$${valorTotalPizza.toFixed(2)} <em>${comentario ? "("+comentario+")" : ""}</em></span>
        <button class="btn-remover" onclick="removerItem(this, ${valorTotalPizza}, false)">Remover</button>
    `;
    document.getElementById("listaPedidos").appendChild(item);

    atualizarValores();
}

/* ========================= */
/* BEBIDAS */
/* ========================= */

const bebidas = {
    refrigerante: {
        "Coca-Cola": {350:8,220:6,"2L":15,"2.5L":18,"3L":20},
        "Fanta Laranja": {350:8,"2L":14},
        "Fanta Uva": {350:8,"2L":14},
        "Guaraná Antarctica": {350:8,"2L":14,"3L":18},
        "Sprite": {350:8,"2L":14}
    },
    agua: {
        "Com gás": {500:5,"1.5L":9},
        "Sem gás": {500:4,"1.5L":8}
    },
    suco: {
        "Laranja": {300:10,"1L":18},
        "Uva": {300:10,"1L":18},
        "Abacaxi": {300:10,"1L":18},
        "Maracujá": {300:10,"1L":18}
    }
};

function carregarBebidas() {
    let tipo = document.getElementById("tipoBebida").value;
    let marcaSelect = document.getElementById("marcaBebida");

    marcaSelect.innerHTML = "";
    
    if(tipo !== "") {
        marcaSelect.classList.remove("hidden");
        for (let marca in bebidas[tipo]) {
            marcaSelect.innerHTML += `<option>${marca}</option>`;
        }
        carregarTamanhos();
    } else {
        marcaSelect.classList.add("hidden");
        document.getElementById("tamanhoBebida").classList.add("hidden");
    }
}

function carregarTamanhos() {
    let tipo = document.getElementById("tipoBebida").value;
    let marca = document.getElementById("marcaBebida").value;
    let tamanhoSelect = document.getElementById("tamanhoBebida");

    tamanhoSelect.innerHTML = "";
    tamanhoSelect.classList.remove("hidden");

    for (let tam in bebidas[tipo][marca]) {
        tamanhoSelect.innerHTML += `<option value="${bebidas[tipo][marca][tam]}">${tam}</option>`;
    }
}

function adicionarBebida() {
    let marca = document.getElementById("marcaBebida").value;
    let tamanhoLabel = document.getElementById("tamanhoBebida").selectedOptions[0].text;
    let valor = parseFloat(document.getElementById("tamanhoBebida").value);

    let coposTotal = parseInt(document.getElementById("coposTotal").value) || 0;
    let coposGelo = parseInt(document.getElementById("coposGelo").value) || 0;

    total += valor;

    let infoCopos = coposTotal > 0 ? `<br><small>Copos: ${coposTotal} | Gelo: ${coposGelo}</small>` : "";

    let item = document.createElement("li");
    item.innerHTML = `
        <span><strong>1x ${marca} ${tamanhoLabel}</strong> <br> R$${valor.toFixed(2)} ${infoCopos}</span>
        <button class="btn-remover" onclick="removerItem(this, ${valor}, false)">Remover</button>
    `;

    document.getElementById("listaPedidos").appendChild(item);

    atualizarValores();
}

function atualizarValores() {
    document.getElementById("total").textContent = total.toFixed(2);
}