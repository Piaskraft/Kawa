import { settings } from './settings.js';

const app = {
  data: {},

  init: function () {
    this.initPages();
    this.initData();
  },

  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelectorAll(settings.selectors.pages);
    thisApp.navLinks = document.querySelectorAll(settings.selectors.navLinks);

    // aktywuj od razu tę stronę, którą wyczytasz z hash lub pierwszą
    const initialId = window.location.hash.replace('#', '') || thisApp.pages[0].id;
    thisApp.activatePage(initialId);

    // jeśli to products, to wyrenderuj produkty teraz
    if (initialId === 'products') {
      thisApp.renderProducts();
    }

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const id = this.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);
        window.location.hash = '#' + id;

        // wywołaj renderProducts tylko gdy przełączyliśmy się na Products
        if (id === 'products') {
          thisApp.renderProducts();
        }
      });
    }
  },

  activatePage: function (pageId) {
    for (let page of this.pages) {
      page.classList.toggle('active', page.id === pageId);
    }
    for (let link of this.navLinks) {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + pageId
      );
    }
  },

  initData: function () {
    const thisApp = this;
    const url = `${settings.db.url}/${settings.db.products}`;

    fetch(url)
      .then((res) => res.json())
      .then((products) => {
        thisApp.data.products = products;
        // UWAGA: nie wywołujemy tu renderProducts(), bo kontener może nie istnieć
      });
  },

  renderProducts: function () {
    const thisApp = this;
    const container = document.querySelector(settings.selectors.productList);

    if (!container) {
      console.warn('Brak kontenera products__grid – pomijam renderProducts');
      return;
    }

    container.innerHTML = ''; // wyczyść poprzednie

    for (let product of thisApp.data.products) {
      const html = `
        <div class="product">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <img src="${product.image}" alt="${product.title}" />
        </div>
      `;
      container.innerHTML += html;
    }
  },
};

app.init();
