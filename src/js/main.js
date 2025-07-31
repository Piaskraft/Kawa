/* global Handlebars */

document.addEventListener('DOMContentLoaded', () => {
  const source    = document.getElementById('product-template').innerHTML;
  const template  = Handlebars.compile(source);
  const container = document.getElementById('products-container');

  fetch('http://localhost:3131/products')
    .then(res => res.json())
    .then(products => {
      products.forEach(prod => {
        const context = {
          id: prod.id,
          image: prod.image,
          title: prod.name,
          description: prod.description,
          roasting: prod.roasting,
          intensity: prod.intensity,
          oldPrice: prod.oldPrice,
          newPrice: prod.newPrice,
          badge: prod.badge
        };
        const html = template(context);
        container.insertAdjacentHTML('beforeend', html);
      });
    })
    .catch(err => console.error('Błąd ładowania productów:', err));
});
