
//======== Carregar resumo do pedido ========= //
document.addEventListener("DOMContentLoaded", () => {
    const resumo = document.getElementById("resumo");
    const totalEl = document.getElementById("total");

    const itens = JSON.parse(localStorage.getItem("carrinho")) || [];
    const total = localStorage.getItem("totalCarrinho") || "0.00";

    if (itens.length === 0) {
        resumo.innerHTML = "<p>Nenhum item no carrinho.</p>";
        return;
    }

    let texto = "";
    itens.forEach((item) => {
        texto += `<p class="lista-pagamento">• ${item.nome} ${item.sabor ? `- ${item.sabor}` : ""} (${item.quantidade}x) — R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")
            }<br></p>`;

    });

    resumo.innerHTML = texto;
    totalEl.innerText = "R$ " + total.replace(".", ",");
});

// ========= Enviar pedido e abrir WhatsApp ========= //

function finalizarPedido() { // Pega valores do formulário
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const rua = document.getElementById("rua").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const complemento = document.getElementById("complemento").value.trim();
    const pagamento = document.getElementById("pagamento").value.trim();
    const obs = document.getElementById("observacoes").value.trim();

    if (!nome || !telefone || !rua || !numero || !bairro || !pagamento) {
        mostrarNotificacaopg("Por favor, preencha todos os campos obrigatórios antes de finalizar o pedido.");
        return;
    }

    if (telefone.length < 8) {// Validação simples de telefone
        mostrarNotificacaopg("Por favor, informe um telefone válido.");
        return;
    }

    const itens = JSON.parse(localStorage.getItem("carrinho")) || [];

    if (itens.length === 0) {// Verifica se o carrinho está vazio
        mostrarNotificacaopg("Seu carrinho está vazio.");
        return;
    }

    let lista = "";// Lista de itens do pedido
    itens.forEach((item) => {
        lista += `${item.nome}${item.sabor ? ` - ${item.sabor}` : ""} (${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });
    const total = localStorage.getItem("totalCarrinho");

    // Monta a mensagem para o WhatsApp
    const mensagem = `NOVO PEDIDO

    *Itens:*
    ${lista}

    *Total:* R$ ${total}

    *Cliente:* ${nome}
    *Telefone:* ${telefone}

    *Endereço*
    Rua: ${rua}, Nº: ${numero}
    Bairro: ${bairro}
    Complemento: ${complemento || "Nenhum"}

    *Pagamento:* ${pagamento}

    *Observações:* ${obs || "Nenhuma"}`;

    const texto = encodeURIComponent(mensagem);
    const telefoneLoja = "5548992324437";
    document.getElementById("sucesso").style.display = "flex";
    setTimeout(() => {
        window.open(`https://wa.me/${telefoneLoja}?text=${texto}`, "_blank");
        localStorage.removeItem("carrinho");
        localStorage.removeItem("totalCarrinho");
        window.location.href = "index.html"; // redireciona após fechar
    }, 3500);
}

// ======= Notificação ======= //
function mostrarNotificacaopg(texto = "") {
    const notif = document.getElementById("notificacaopg");

    notif.textContent = texto;
    notif.classList.remove("hidden");

    // Reinicia animação
    void notif.offsetWidth;

    notif.classList.add("mostrar");

    setTimeout(() => {
        notif.classList.remove("mostrar");
        setTimeout(() => notif.classList.add("hidden"), 300);
    }, 3000);
}
