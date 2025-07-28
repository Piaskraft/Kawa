document.addEventListener('DOMContentLoaded', () => {
  const productList = document.querySelector('.product-list');
  const templateSource = document.querySelector('#template-product').innerHTML;
  const productTemplate = Handlebars.compile(templateSource);

  fetch('/products')
    .then(response => response.json())
    .then(data => {
      data.forEach(product => {
        const generatedHTML = productTemplate(product);
        const element = document.createElement('div');
        element.innerHTML = generatedHTML;
        productList.appendChild(element.firstElementChild);
      });
    })
    .catch(error => {
      console.error('Błąd podczas pobierania produktów:', error);
    });

  function initPages() {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.main-nav a');

    function activatePage(id) {
      for (let page of pages) {
        page.classList.toggle('active', page.id === id);
      }

      for (let link of navLinks) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      }
    }

    const idFromHash = window.location.hash.replace('#', '') || 'home';
    activatePage(idFromHash);

    for (let link of navLinks) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const clickedId = link.getAttribute('href').replace('#', '');
        activatePage(clickedId);
        window.location.hash = '#' + clickedId;
      });
    }
  }

  initPages();
});
