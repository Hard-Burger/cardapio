document.addEventListener("DOMContentLoaded", function () {
    fetch("menu.json")
      .then(response => response.json())
      .then(data => {
        const menuItensContainer = document.querySelector(".menu-itens");
        let categoriasAdicionadas = [];
  
        data.itens.forEach(item => {
          if (!categoriasAdicionadas.includes(item.categoria)) {
            const categoriaH1 = document.createElement("h1");
            categoriaH1.textContent = item.categoria;
            menuItensContainer.appendChild(categoriaH1);
            categoriasAdicionadas.push(item.categoria);
          }
  
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("item", item.categoria.toLowerCase().replace(" ", "-"));
  
          const imgItemDiv = document.createElement("div");
          imgItemDiv.classList.add("img-item");
          const imgItem = document.createElement("img");
          imgItem.src = item.imagem;
          imgItem.alt = item.nome;
  
          const conteudoDiv = document.createElement("div");
          conteudoDiv.classList.add("conteudo");
  
          const nomeH2 = document.createElement("h2");
          nomeH2.textContent = item.nome;
  
          const descricaoP = document.createElement("p");
          descricaoP.textContent = item.descricao;
  
          const precoSpan = document.createElement("span");
          precoSpan.textContent = item.preco;
  
          imgItemDiv.appendChild(imgItem);
          conteudoDiv.appendChild(nomeH2);
          conteudoDiv.appendChild(descricaoP);
          conteudoDiv.appendChild(precoSpan);
  
          itemDiv.appendChild(imgItemDiv);
          itemDiv.appendChild(conteudoDiv);
  
          menuItensContainer.appendChild(itemDiv);
        });
      })
      .catch(error => console.error("Erro ao carregar o menu:", error));
  });
  