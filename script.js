document.addEventListener("DOMContentLoaded", function () {
  const carrossel = document.getElementById("carrossel");
  const categoriasDiv = document.querySelector(".categorias");

  let dadosMenu = [];
  let itensFiltrados = [];
  let indiceAtual = 0;

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

          conteudoDiv.appendChild(nomeH2);
          conteudoDiv.appendChild(descricaoP);
          conteudoDiv.appendChild(precoSpan);

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
});
