document.addEventListener('DOMContentLoaded', () => {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.main-nav a');

  // Przygotowujemy listę i szablon Handlebars
  const productList = document.querySelector('.product-list');
  const templateSource = document.querySelector('#template-product').innerHTML;
  const productTemplate = Handlebars.compile(templateSource);

  function activatePage(id) {
    // 1) Pokaż/ukryj sekcje .page
    pages.forEach(page => {
      page.classList.toggle('active', page.id === id);
    });

    // 2) Podświetl aktywny link
    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + id
      );
    });

    // 3) Jeśli to strona #products – pobierz i wyrenderuj produkty
    if (id === 'products') {
      productList.innerHTML = ''; // czyścimy listę

      fetch('http://localhost:3131/products')
        .then(res => res.json())
        .then(data => {
          console.log('Otrzymane data:', data);

          data.forEach(product => {
            const html = productTemplate(product);
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            productList.appendChild(wrapper.firstElementChild);
          });
        })
        .catch(err => {
          console.error('Błąd podczas pobierania produktów:', err);
        });
    }
  }

  // 4) Wybierz stronę startową (hash lub 'home')
  const startPage = window.location.hash.replace('#', '') || 'home';
  activatePage(startPage);

  // 5) Obsługa kliknięć w menu
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');
      activatePage(targetId);
      window.location.hash = '#' + targetId;
    });
  });
});
