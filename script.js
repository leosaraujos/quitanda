// 1) Defina os itens diretamente (antes usávamos items.json)
const items = [
    { title: "Banana", price: 4.00, unit: "kg" },
    { title: "Maçã", price: 6.50, unit: "kg" },
    { title: "Laranja", price: 3.20, unit: "kg" },
    { title: "Tomate", price: 7.00, unit: "kg" },
    { title: "Alface", price: 2.50, unit: "und" },
    { title: "Cenoura", price: 5.00, unit: "kg" },
    { title: "Batata", price: 3.00, unit: "kg" },
    { title: "Pepino", price: 4.50, unit: "kg" },
    { title: "Abacaxi", price: 7.50, unit: "und" },
    { title: "Pimentão", price: 8.00, unit: "kg" }
];

// 2) Cria dinamicamente os cards dos itens
function init(items) {
    const container = document.getElementById('itemsContainer');
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card flex justify-between items-center border border-gray-300 rounded p-4';
        card.dataset.title = item.title;
        card.dataset.price = item.price;
        card.dataset.unit = item.unit;
        card.innerHTML = `
      <div>
        <h3 class="text-lg font-semibold">${item.title}</h3>
        <p class="text-gray-700 text-sm">R$${item.price.toFixed(2)} / ${item.unit}</p>
      </div>
      <div class="quantity-selector flex items-center border border-yellow-400 rounded-full overflow-hidden">
        <button class="minus px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed" disabled>-</button>
        <span class="qty-value px-3 font-bold">0</span>
        <button class="plus px-3 py-1">+</button>
      </div>`;
        container.append(card);
    });
    bindEvents();
}

// 3) Toda a lógica de evento (igual ao script.js)
function bindEvents() {
    let showList = false;
    const userNameInput = document.getElementById('userName');
    const continueBtn = document.getElementById('continueBtn');
    const promotions = document.getElementById('promotionsCheckbox');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const footer = document.getElementById('footer');
    const greeting = document.getElementById('greeting');
    const itemCards = document.querySelectorAll('.item-card');
    const totalSpan = document.getElementById('totalValue');
    const listEl = document.getElementById('selectedItemsList');
    const sendBtn = document.getElementById('sendProposal');
    const collapseCt = document.getElementById('collapseContainer');

    userNameInput.addEventListener('input', () => {
        continueBtn.disabled = !userNameInput.value.trim();
    });
    continueBtn.addEventListener('click', () => {
        window._user = {
            name: userNameInput.value.trim(),
            wantsPromos: promotions.checked
        };
        greeting.textContent = `Olá, ${window._user.name}!`;
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        footer.classList.remove('hidden');
    });

    function updateTotals() {
        let total = 0;
        const selected = [];
        itemCards.forEach(card => {
            const qty = +card.querySelector('.qty-value').textContent;
            const price = +card.dataset.price;
            const unit = card.dataset.unit;
            if (qty > 0) {
                total += price * qty;
                selected.push({ title: card.dataset.title, qty, unit, subtotal: price * qty });
                card.classList.add('bg-green-100', 'border-green-500');
            } else {
                card.classList.remove('bg-green-100', 'border-green-500');
            }
        });
        totalSpan.textContent = total.toFixed(2);
        sendBtn.disabled = selected.length === 0;

        collapseCt.innerHTML = '';
        if (selected.length > 2) {
            const span = document.createElement('span');
            span.textContent = `Quantidade Itens selecionados (${selected.length})`;
            const btn = document.createElement('button');
            btn.textContent = showList ? 'Ocultar itens' : 'Mostrar itens';
            btn.className = 'text-blue-600';
            btn.addEventListener('click', () => {
                showList = !showList;
                updateTotals();
            });
            collapseCt.append(span, btn);
            listEl.style.display = showList ? 'block' : 'none';
        } else {
            listEl.style.display = 'block';
        }

        listEl.innerHTML = '';
        selected.forEach(i => {
            const li = document.createElement('li');
            li.textContent = `${i.title} (x${i.qty} ${i.unit}) – R$${i.subtotal.toFixed(2)}`;
            listEl.append(li);
        });
    }

    itemCards.forEach(card => {
        const minus = card.querySelector('.minus');
        const plus = card.querySelector('.plus');
        const val = card.querySelector('.qty-value');
        plus.addEventListener('click', () => {
            val.textContent = +val.textContent + 1;
            minus.disabled = false;
            updateTotals();
        });
        minus.addEventListener('click', () => {
            let q = +val.textContent - 1;
            if (q < 0) q = 0;
            val.textContent = q;
            minus.disabled = q === 0;
            updateTotals();
        });
    });

    sendBtn.addEventListener('click', () => {
        // 👇 Aqui removemos completamente o alerta/prompt de telefone
        let msg = `Olá, meu nome é ${window._user.name}.\n\nEstou interessado nos itens:\n`;
        listEl.querySelectorAll('li').forEach(li => {
            msg += `- ${li.textContent}\n`;
        });
        msg += `\n-------------------\n*Valor Total: R$${totalSpan.textContent}*`;

        window.open(
            `https://api.whatsapp.com/send?phone=5581996590370&text=${encodeURIComponent(msg)}`,
            '_blank'
        );
    });
}

// 4) Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => init(items));
