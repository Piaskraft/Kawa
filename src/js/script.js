document.addEventListener('DOMContentLoaded', function () {
  var pages = document.querySelectorAll('.page');
  var navLinks = document.querySelectorAll('.main-nav a');

  // Przygotowujemy szablon Handlebars i kontener
  var productGrid = document.querySelector('.products__grid');
  var templateSource = document.querySelector('#template-product').innerHTML;
  var productTemplate = Handlebars.compile(templateSource);

  function activatePage(id) {
    // 1) Pokaż/ukryj sekcje .page
    pages.forEach(function (page) {
      page.classList.toggle('active', page.id === id);
    });

    // 2) Podświetl aktywny link
    navLinks.forEach(function (link) {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + id
      );
    });

    // 3) Jeśli to strona #products – pobierz i wyrenderuj produkty
    if (id === 'products') {
      productGrid.innerHTML = ''; // czyścimy siatkę

      fetch('http://localhost:3131/products')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          console.log('Otrzymane data:', data);
          data.forEach(function (product, index) {
            var html = productTemplate(product);
            var wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            var card = wrapper.firstElementChild;
            // opcjonalnie: co drugi element obróć układ
            if (index % 2 === 1) {
              card.classList.add('odd');
            }
            productGrid.appendChild(card);
          });
        })
        .catch(function (err) {
          console.error('Błąd podczas pobierania produktów:', err);
        });
    }
  }

  // 4) Wybierz stronę startową (hash lub 'home')
  var startPage = window.location.hash.replace('#', '') || 'home';
  activatePage(startPage);

  // 5) Obsługa kliknięć w menu
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = link.getAttribute('href').replace('#', '');
      activatePage(targetId);
      window.location.hash = '#' + targetId;
    });
  });
});
