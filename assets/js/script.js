
// Carregar carrinho salvo ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
  itensCarrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  // Atualiza tudo normalmente
  atualizarCarrinho();

  // FORÇA O BADGE A APARECER NA INICIALIZAÇÃO
  const badge = document.getElementById("contador-carrinho");
  badge.style.transform = "scale(1)";
});



//Função de notificação (ADICIONADO AO CARRINHO COM SUCESSO)

function mostrarNotificacao(texto = "Produto adicionado ao carrinho!") {
  const notif = document.getElementById("notificacao");

  notif.textContent = texto;
  notif.classList.remove("hidden");

  // Reinicia animação
  void notif.offsetWidth;

  notif.classList.add("mostrar");

  setTimeout(() => {
    notif.classList.remove("mostrar");
    setTimeout(() => notif.classList.add("hidden"), 300);
  }, 1500);
}

// Contador Carrinho Cabeçalho

let totalItensCarrinho = 0;

function atualizarContadorCarrinho() {
  const badge = document.getElementById("contador-carrinho");

  badge.textContent = totalItensCarrinho;
  if (totalItensCarrinho > 0) {
    badge.style.transform = "scale(1)";
  } else {
    badge.style.transform = "scale(0)";
  }
  // Salva no localStorage sempre que o carrinho for atualizado
  localStorage.setItem("carrinho", JSON.stringify(itensCarrinho));
}

//Quando clicar em “Adicionar ao Carrinho”, somar 1

document.querySelectorAll(".adicionar-carrinho").forEach(btn => {
  btn.addEventListener("click", () => {

    // AQUI SOMA +1
    totalItensCarrinho++;
    atualizarContadorCarrinho();

    // notificação
    mostrarNotificacao();
  });
});

const iconeCarrinho = document.querySelector(".icone-carrinho");
const contadorCarrinho = document.getElementById("contador-carrinho");
const carrinhoLateral = document.getElementById("carrinho-lateral");
const fecharCarrinho = document.getElementById("fechar-carrinho");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalCarrinhoEl = document.getElementById("total-carrinho");

let itensCarrinho = [];

// ----------- ABRIR CARRINHO -----------
iconeCarrinho.addEventListener("click", (e) => {
  e.preventDefault();
  carrinhoLateral.classList.add("ativo");
});

// ----------- FECHAR CARRINHO -----------
fecharCarrinho.addEventListener("click", () => {
  carrinhoLateral.classList.remove("ativo");
});

// ----------- ADICIONAR AO CARRINHO -----------
document.querySelectorAll(".adicionar-carrinho").forEach((btn) => {
  btn.addEventListener("click", () => {
    const produto = btn.closest(".produto");
    const nome = produto.querySelector("h3").innerText;
    const precoTexto = produto.querySelector(".preco").innerText;

    // Pega o sabor se houver SELECT
    const select = produto.querySelector(".selecionar-sabor");
    const sabor = select ? select.value : null;

    // Converte preço
    const preco = parseFloat(
      precoTexto.replace("R$", "").replace(".", "").replace(",", ".")
    );

    // Verifico se já existe incluso mesmo nome + mesmo sabor
    const existente = itensCarrinho.find(
      (item) => item.nome === nome && item.sabor === sabor
    );

    if (existente) {
      existente.quantidade++;
    } else {
      itensCarrinho.push({ nome, preco, quantidade: 1, sabor });
    }
    atualizarCarrinho();
  });
});


// ----------- FUNÇÃO DE ATUALIZAÇÃO -----------
function atualizarCarrinho() {
  // atualizar badge
  const totalItens = itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0);
  contadorCarrinho.textContent = totalItens;

  // atualizar lista
  listaCarrinho.innerHTML = "";

  let total = 0;

  itensCarrinho.forEach((item) => {
    total += item.preco * item.quantidade;

    const div = document.createElement("div");
    div.classList.add("item-carrinho");

    div.innerHTML = `
  <div>
<strong>${item.nome}${item.sabor ? " (" + item.sabor + ")" : ""}</strong>
    <div class="quantidade-controle">
      <button class="menos" data-nome="${item.nome}">−</button>
      <span class="qtd">${item.quantidade}</span>
      <button class="mais" data-nome="${item.nome}">+</button>
    </div>
  </div>

  <strong>R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}</strong>
`;
    document.getElementById("limpar-carrinho").addEventListener("click", () => {
      itensCarrinho = [];
      atualizarCarrinho();
    });
    listaCarrinho.appendChild(div);
  });

  totalCarrinhoEl.textContent = total.toFixed(2).replace(".", ",");
  // Salva no localStorage sempre que o carrinho for atualizado
  localStorage.setItem("carrinho", JSON.stringify(itensCarrinho));

}

listaCarrinho.addEventListener("click", (e) => {
  // BOTÃO "+"
  if (e.target.classList.contains("mais")) {
    const nome = e.target.dataset.nome;
    const item = itensCarrinho.find(x => x.nome === nome);

    item.quantidade++;
    atualizarCarrinho();
  }

  // BOTÃO "−"
  if (e.target.classList.contains("menos")) {
    const nome = e.target.dataset.nome;
    const item = itensCarrinho.find(x => x.nome === nome);

    if (item.quantidade > 1) {
      item.quantidade--;
    } else {
      itensCarrinho = itensCarrinho.filter(x => x.nome !== nome);
    }

    atualizarCarrinho();
  }
});

// ===============================
//   BOTÃO FINALIZAR -> PAGAMENTO
// ===============================
document.getElementById("finalizar-pedido").addEventListener("click", () => {

  if (itensCarrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  // Salva carrinho no localStorage
  localStorage.setItem("carrinho", JSON.stringify(itensCarrinho));

  // Salva o total
  const total = itensCarrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  localStorage.setItem("totalCarrinho", total.toFixed(2));

  // Redireciona para a página de pagamento
  window.location.href = "pagamento.html";
});
