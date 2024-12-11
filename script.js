let cart = [];
let modalQt = 1;
let modalKey = 0;

const qs = (el)=>document.querySelector(el);
const qsa = (el)=>document.querySelectorAll(el);
const categoriasDiv = document.querySelector(".categorias");
const carrossel = document.getElementById("carrossel");

let itensFiltrados = [];
let indiceAtual = 0;
let carrinho = [];


// Listagem dos menus
const categorias = [...new Set(menuJson.map(item => item.categoria))];
    
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


// Função para atualizar a categoria selecionada
function selecionarCategoria(categoriaSelecionada, index) {
    // Atualiza botões ativos
    document.querySelectorAll(".categorias button").forEach(btn => btn.classList.remove("ativo"));
    document.querySelectorAll(".categorias button")[index].classList.add("ativo");

    // Filtra itens pela categoria
    itensFiltrados = menuJson.filter(item => item.categoria === categoriaSelecionada);
    indiceAtual = 0; // Reseta índice

    // Limpa o modalKey quando mudar a categoria
    modalKey = 0;

    // Renderiza os itens no carrossel
    renderizarCarrossel();
}

// Renderiza os itens no carrossel
function renderizarCarrossel() {
    carrossel.innerHTML = ""; // Limpa o carrossel

    itensFiltrados.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        // Imagem do item
        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.name;

        // Conteúdo do item
        const conteudoDiv = document.createElement("div");
        conteudoDiv.classList.add("conteudo");

        const nomeH2 = document.createElement("h2");
        nomeH2.textContent = item.name;

        const descricaoP = document.createElement("p");
        descricaoP.textContent = item.description;

        const precoSpan = document.createElement("span");
        precoSpan.textContent = item.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        // Botão para adicionar ao carrinho
        const botaoAdicionar = document.createElement("button");
        botaoAdicionar.textContent = "ADICIONAR AO CARRINHO";
        botaoAdicionar.setAttribute('data-key', index); // Atribui um índice único ao botão
        botaoAdicionar.addEventListener('click', (e) => {
            e.preventDefault();

            let key = e.target.getAttribute('data-key'); // Obtém o índice do botão
            modalQt = 1;  // Define a quantidade do item
            modalKey = key; // Atribui o índice ao modalKey

            // Atualiza os elementos do modal com os dados do item
            document.querySelector('.menuBig img').src = itensFiltrados[key].img;
            document.querySelector('.menuInfo h1').innerHTML = itensFiltrados[key].name;
            document.querySelector('.menuInfo--desc').innerHTML = itensFiltrados[key].description;
            document.querySelector('.menuInfo--actualPrice').innerHTML = `R$ ${itensFiltrados[key].price.toFixed(2)}`;

            document.querySelector('.menuInfo--qt').innerHTML = modalQt;

            document.querySelector('.menuWindowArea').style.opacity = 0;
            document.querySelector('.menuWindowArea').style.display = 'flex';
            setTimeout(()=>{
                qs('.menuWindowArea').style.opacity = 1;
            }, 200);
        });

        // Monta o conteúdo
        conteudoDiv.appendChild(nomeH2);
        conteudoDiv.appendChild(descricaoP);
        conteudoDiv.appendChild(precoSpan);
        conteudoDiv.appendChild(botaoAdicionar); // Adiciona o botão ao conteúdo

        // Monta o item completo
        itemDiv.appendChild(img);
        itemDiv.appendChild(conteudoDiv);

        // Adiciona ao carrossel
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

// Eventos do MODAL
function closeModal() {
    qs('.menuWindowArea').style.opacity = 0;
    setTimeout(() => {
        qs('.menuWindowArea').style.display = 'none';
    }, 500);
}

qsa('.menuInfo--cancelButton, .menuInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

qs('.menuInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        qs('.menuInfo--qt').innerHTML = modalQt;
    }
});

qs('.menuInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    qs('.menuInfo--qt').innerHTML = modalQt;
});

qs('.menuInfo--addButton').addEventListener('click', () => {
    let identifier = itensFiltrados[modalKey].id + '@';  // Alterado para itensFiltrados
    let key = cart.findIndex((item) => item.identifier == identifier);
    
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: itensFiltrados[modalKey].id,  // Alterado para itensFiltrados
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});


qs('.menu-openner span').addEventListener('click', () =>{
    if(cart.length > 0){
        qs('aside').style.left = 0;
    }
});
qs('.menu-closer').addEventListener('click', ()=>{
    qs('aside').style.left = '100vw';
});

function updateCart() {
    qs('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';

        let subtotal = 0;
        let total = 0;

        for(let i in cart) {
            let menuItem = menuJson.find((item)=>item.id == cart[i].id);
            subtotal += menuItem.price *cart[i].qt;

            let cartItem = qs('.models .cart--item').cloneNode(true);

            let menuSizeName;
            switch(cart[i].size) {
                case 0:
                    menuSizeName = 'Pequeno';
                    break;
                case 1:
                    menuSizeName = 'Médio';
                    break;
                case 2:
                    menuSizeName = 'Grande';
                    break;
            }

            let menuName = `${menuItem.name}`;

            cartItem.querySelector('img').src = menuItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = menuName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            qs('.cart').append(cartItem);
        }
        total = subtotal;

        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }
}

// Função para compartilhar o carrinho no WhatsApp
window.compartilharWhatsApp = function () {
    // Verifica se o carrinho está vazio
    if (cart.length === 0) {
        alert('Carrinho vazio!');
        return;
    }

    // Monta a mensagem com os itens do carrinho
    const mensagem = cart.map(item => {
        const menuItem = menuJson.find((menu) => menu.id === item.id);
        return `${menuItem.name} - R$ ${menuItem.price.toFixed(2)} x ${item.qt}`;
    }).join("\n");

    // Calcula o total do carrinho
    let total = 0;
    cart.forEach(item => {
        const menuItem = menuJson.find((menu) => menu.id === item.id);
        total += menuItem.price * item.qt;
    });

    // Cria a URL do WhatsApp com a mensagem e o total
    const url = `https://wa.me/5511944926534?text=${encodeURIComponent(`Segue meu pedido:\n\n${mensagem}\n\nTotal: R$ ${total.toFixed(2)}`)}`;
    
    // Abre o link do WhatsApp
    window.open(url, "_blank");
};

// Vincula o botão de "finalizar" para chamar a função de compartilhar
const finalizar = document.getElementById("cart--finalizar");
finalizar.addEventListener("click", compartilharWhatsApp);


