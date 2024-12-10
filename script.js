document.addEventListener("DOMContentLoaded", function () {
  const carrossel = document.getElementById("carrossel");
  const categoriasDiv = document.querySelector(".categorias");
  const qtdItensCarrinho = document.getElementById("qtdItensCarrinho");
  const itensCarrinho = document.getElementById("itensCarrinho");
  const totalCarrinho = document.getElementById("totalCarrinho");
  const carrinhoContainer = document.getElementById("carrinhoContainer");

  let dadosMenu = [];
  let itensFiltrados = [];
  let indiceAtual = 0;
  let carrinho = [];

  // Carrega o menu.json
  fetch("menu.json")
    .then(response => response.json())
    .then(data => {
        dadosMenu = data.itens;
        const categorias = [...new Set(dadosMenu.map(item => item.categoria))];
        
        // Gera os botões das categorias
        categorias.forEach((categoria, index) => {
            const botao = document.createElement("button");
            botao.textContent = categoria;
            botao.onclick = () => selecionarCategoria(categoria, index);
            if (index === 0) botao.classList.add("ativo"); // Primeira categoria ativa
            categoriasDiv.appendChild(botao);
        });

        // Carrega os itens da primeira categoria
        selecionarCategoria(categorias[0], 0);
    })
    .catch(error => console.error("Erro ao carregar o menu:", error));

  // Função para atualizar o carrossel com a categoria selecionada
  function selecionarCategoria(categoriaSelecionada, index) {
      // Atualiza botões ativos
      document.querySelectorAll(".categorias button").forEach(btn => btn.classList.remove("ativo"));
      document.querySelectorAll(".categorias button")[index].classList.add("ativo");

      // Filtra itens pela categoria
      itensFiltrados = dadosMenu.filter(item => item.categoria === categoriaSelecionada);
      indiceAtual = 0; // Reseta índice

      // Renderiza os itens no carrossel
      renderizarCarrossel();
  }

  // Renderiza os itens no carrossel
  function renderizarCarrossel() {
      carrossel.innerHTML = ""; // Limpa o carrossel

      itensFiltrados.forEach(item => {
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("item");

          const img = document.createElement("img");
          img.src = item.imagem;
          img.alt = item.nome;

          const conteudoDiv = document.createElement("div");
          conteudoDiv.classList.add("conteudo");

          const nomeH2 = document.createElement("h2");
          nomeH2.textContent = item.nome;

          const descricaoP = document.createElement("p");
          descricaoP.textContent = item.descricao;

          const precoSpan = document.createElement("span");
          precoSpan.textContent = item.preco;

          const botaoAdicionar = document.createElement("button");
          botaoAdicionar.textContent = "+";
          botaoAdicionar.onclick = () => adicionarAoCarrinho(item);

          const botaoRetirar = document.createElement("button");
          botaoRetirar.textContent = "-";
          botaoRetirar.onclick = () => removerDoCarrinho(item);

          conteudoDiv.appendChild(nomeH2);
          conteudoDiv.appendChild(descricaoP);
          conteudoDiv.appendChild(precoSpan);
          conteudoDiv.appendChild(botaoAdicionar);
          conteudoDiv.appendChild(botaoRetirar);

          itemDiv.appendChild(img);
          itemDiv.appendChild(conteudoDiv);

          carrossel.appendChild(itemDiv);
      });

      atualizarCarrossel();
  }

  // Atualiza a posição do carrossel
  function atualizarCarrossel() {
      const deslocamento = -indiceAtual * 100; // Move 100% da largura
      carrossel.style.transform = `translateX(${deslocamento}%)`;
  }

  // Navegação no carrossel
  window.moverCarrossel = function (direcao) {
      if (itensFiltrados.length === 0) return;

      indiceAtual += direcao;

      if (indiceAtual < 0) {
          indiceAtual = itensFiltrados.length - 1;
      } else if (indiceAtual >= itensFiltrados.length) {
          indiceAtual = 0;
      }

      atualizarCarrossel();
  };

  // Adiciona um item ao carrinho
  function adicionarAoCarrinho(item) {
      carrinho.push(item);
      atualizarCarrinho();
  }

  // Remover um item do carrinho
  function removerDoCarrinho(item) {
    carrinho.pop(item);
    atualizarCarrinho();
  }

  // Atualiza o carrinho na tela
  function atualizarCarrinho() {
      // Atualiza o contador de itens no carrinho
      qtdItensCarrinho.textContent = carrinho.length;

      // Renderiza os itens do carrinho
      itensCarrinho.innerHTML = "";
      let total = 0;
      carrinho.forEach(item => {
          const itemCarrinho = document.createElement("li");
          itemCarrinho.textContent = `${item.nome} - ${item.preco}`;
          itensCarrinho.appendChild(itemCarrinho);

          total += parseFloat(item.preco.replace('R$ ', '').replace(',', '.'));
      });

      totalCarrinho.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  // Mostra ou esconde o carrinho
  window.toggleCarrinho = function () {
      carrinhoContainer.classList.toggle("visivel");
  }

  // Compartilhar carrinho no WhatsApp
  window.compartilharWhatsApp = function () {
      const mensagem = carrinho.map(item => `${item.nome} - ${item.preco}`).join("\n");
      const total = totalCarrinho.textContent.replace("Total: ", "");
      const url = `https://wa.me/?text=${encodeURIComponent(`${mensagem}\n\n${total}`)}`;
      window.open(url, "_blank");
  };
});
