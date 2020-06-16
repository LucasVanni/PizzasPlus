let cart = [];
let modalKey = 0;
let modalQt = 1;

const elementSelector = (e) => document.querySelector(e);
const elementSelectorAll = (e) => document.querySelectorAll(e);


pizzaJson.map((item, index) => {
    let pizzaItem = elementSelector('.models .pizza-item').cloneNode(true);

    // Preencher as informações
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;

        modalKey = key;

        elementSelector('.pizzaBig img').src = pizzaJson[key].img;
        elementSelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        elementSelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        elementSelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
        elementSelector('.pizzaInfo--size.selected').classList.remove('selected');
        elementSelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex === 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        });

        elementSelector('.pizzaInfo--qt').innerHTML = modalQt;

        elementSelector('.pizzaWindowArea').style.opacity = `0`;
        elementSelector('.pizzaWindowArea').style.display = 'flex';

        setTimeout(() => {
            elementSelector('.pizzaWindowArea').style.opacity = `1`;
        }, 200)

    })

    // Adicionar na tela
    elementSelector('.pizza-area').append( pizzaItem );
});

// Eventos do modal
const closeModal = () => {
    elementSelector('.pizzaWindowArea').style.opacity = `0`;

    setTimeout(()=> {
        elementSelector('.pizzaWindowArea').style.display = 'none';
    } , 200)
};

elementSelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item => {
    item.addEventListener('click', closeModal)
});

elementSelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) {
        modalQt--;
        elementSelector('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

elementSelector('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    elementSelector('.pizzaInfo--qt').innerHTML = modalQt;
});

elementSelectorAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', ()=>{
        elementSelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

elementSelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(elementSelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;

    // Identificando se já tenho o mesmo valor do identifier no carrinho
    let key = cart.findIndex(item => item.identifier === identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
});

elementSelector('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        elementSelector('aside').style.left = '0';
    }
});

elementSelector('.menu-closer').addEventListener('click', ()=>{
    elementSelector('aside').style.left = '100vw';
});

const updateCart = () => {

    elementSelector('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        elementSelector('aside').classList.add('show');

        elementSelector('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find(item =>
                item.id === cart[i].id
            );

            subtotal +=  pizzaItem.price * cart[i].qt;


            let cartItem = elementSelector('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} {${pizzaSizeName}}`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
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

            elementSelector('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        elementSelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        elementSelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        elementSelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

    } else  {
        elementSelector('aside').classList.remove('show');
        elementSelector('aside').style.left = '100vw';
    }
};
