/* global Handlebars */
import { settings } from './settings.js';


const app = {
  data: {},

  init: function () {
    this.initPages();
    this.setRandomHeader();
    this.initData();
  },
   setRandomHeader: function () {
    const texts = settings.headerTexts;
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const el = document.getElementById('random-header');
    if (el) el.textContent = randomText;
  },

  initPages: function () {
    const thisApp = this;
    thisApp.pages = document.querySelectorAll(settings.selectors.pages);
    thisApp.navLinks = document.querySelectorAll(settings.selectors.navLinks);

    const initialId = window.location.hash.replace('#', '') || thisApp.pages[0].id;
    thisApp.activatePage(initialId);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const id = this.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        window.location.hash = '#' + id;

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
        const currentId = window.location.hash.replace('#', '') || thisApp.pages[0].id;
        if (currentId === 'products') {
          thisApp.renderProducts();
        }
      });
  },

  renderProducts: function () {
    const thisApp = this;
    const container = document.querySelector(settings.selectors.productList);
    if (!container) return;

    // kompilacja Handlebars
    const source = document.getElementById('template-product').innerHTML;
    const template = Handlebars.compile(source);

    container.innerHTML = '';
    for (let product of thisApp.data.products) {
      const html = template(product);
      container.innerHTML += html;
    }
  }  // <-- tutaj nie ma przecinka!
};  // <-- zamyka obiekt `app`

// A dopiero po obiekcie wywołujemy metodę init:
app.init();
