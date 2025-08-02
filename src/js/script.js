/* global Handlebars */
import { settings } from './settings.js';
// w script.js

const app = {
  data: {},

  init: function () {
    this.initPages();
    this.setRandomHeader();
    this.initData();
    this.initContactForm();

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
    const source = document.getElementById('product-template').innerHTML;

    const template = Handlebars.compile(source);

    container.innerHTML = '';
    for (let product of thisApp.data.products) {
      const html = template(product);
      container.innerHTML += html;
    }
  },

  initContactForm: function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = form.querySelector('input[name="name"]').value;
      const title = form.querySelector('input[name="title"]').value;
      const message = form.querySelector('textarea[name="message"]').value;

      console.log('📨 Form submitted:');
      console.log('Name:', name);
      console.log('Title:', title);
      console.log('Message:', message);

      // Ewentualnie: form.reset(); // jeśli chcesz wyczyścić po wysłaniu
    });
  },



};

// A dopiero po obiekcie wywołujemy metodę init:
app.init();