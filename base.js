
(function ($) {
  "use strict";

  window.TG = window.TG || {};

  TG.toast = function (message, status) {
    var host = document.querySelector('.toast-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toast-host';
      document.body.appendChild(host);
    }

    var toast = document.createElement('div');
    toast.className = 'toast show ' + (status === 'err' ? 'err' : 'ok');
    toast.textContent = message;
    host.appendChild(toast);

    window.setTimeout(function () {
      toast.classList.remove('show');
      window.setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2800);
  };

  TG.cardHTML = function (p) {
    var tagClass = p.cond && p.cond.toLowerCase() === 'new' ? 'new' : 'used';
    var tagLabel = p.cond ? p.cond : 'Product';
    var oldPrice = p.old ? '<span class="old">$' + p.old.toFixed(2) + '</span>' : '';
    var rating = p.rating ? '<div class="rating">★ ' + p.rating.toFixed(1) + ' <span>(' + (Math.round(p.rating * 35) + 15) + ' reviews)</span></div>' : '';
    var imageLock = p.lock || Math.floor(Math.random() * 200 + 30);
    var imageUrl = 'https://loremflickr.com/500/400/' + encodeURIComponent(p.img) + '?lock=' + imageLock;
    return '<article class="card reveal">' +
      '<a class="thumb" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
        '<img src="' + imageUrl + '" alt="' + (p.name || 'Product image') + '">' +
      '</a>' +
      (p.cond ? '<span class="tag ' + tagClass + '">' + tagLabel + '</span>' : '') +
      '<button class="wish" type="button" aria-label="Add to wishlist">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"></path></svg>' +
      '</button>' +
      '<div class="body">' +
        '<div class="cat">' + (p.cat || 'General') + '</div>' +
        '<h3><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + (p.name || 'Untitled item') + '</a></h3>' +
        rating +
        '<div class="foot">' +
          '<div class="price">$' + (p.price ? p.price.toFixed(2) : '0.00') + oldPrice + '</div>' +
          '<button class="add-btn" type="button" aria-label="Add ' + (p.name || 'product') + ' to cart">+</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  };

  TG.catalog = function () {
    return [
      { id: 's1', name: 'Precision Temp Sensor', cat: 'Sensors', img: 'temperature,sensor', price: 14.99, old: 19.99, rating: 4.8, cond: 'New', lock: 72 },
      { id: 'm1', name: 'Stepper Motor Kit', cat: 'Mechanical', img: 'motor,gear', price: 34.99, old: 44.99, rating: 4.6, cond: 'New', lock: 27 },
      { id: 'g1', name: 'Smart Watch Module', cat: 'Gadgets', img: 'wearable,smartwatch', price: 59.99, old: 79.99, rating: 4.5, cond: 'New', lock: 33 },
      { id: 'i1', name: 'IoT Control Board', cat: 'IoT', img: 'iot,board', price: 24.99, old: 34.99, rating: 4.7, cond: 'New', lock: 12 },
      { id: 'g2', name: 'USB Camera Module', cat: 'Gadgets', img: 'camera,usb', price: 29.99, old: 39.99, rating: 4.4, cond: 'New', lock: 54 },
      { id: 's3', name: 'Proximity Sensor Pack', cat: 'Sensors', img: 'proximity,sensor', price: 22.99, old: 29.99, rating: 4.6, cond: 'New', lock: 87 },
      { id: 'i4', name: 'Smart Home Gateway', cat: 'IoT', img: 'home,automation', price: 49.99, old: 64.99, rating: 4.9, cond: 'New', lock: 101 },
      { id: 'm3', name: 'Metal Hardware Set', cat: 'Mechanical', img: 'hardware,nuts', price: 12.49, old: 18.99, rating: 4.3, cond: 'New', lock: 68 }
    ];
  };

  TG.listings = function () {
    return [
      { id: 'demo1', name: 'Used Arduino Uno R3', cat: 'IoT', img: 'arduino,board', price: 18.99, old: 29.99, rating: 4.2, cond: 'Good' },
      { id: 'demo2', name: 'Second-hand Servo Pack (x4)', cat: 'Mechanical', img: 'servo,motor', price: 12.99, old: 22.99, rating: 4.0, cond: 'Fair' },
      { id: 'demo3', name: 'Pre-owned Fitness Band', cat: 'Gadgets', img: 'fitness,band,watch', price: 19.99, old: 44.99, rating: 4.1, cond: 'Good' },
      { id: 'demo4', name: 'Used IR Sensor Bundle', cat: 'Sensors', img: 'infrared,sensor', price: 3.99, old: 7.49, rating: 4.3, cond: 'Good' },
      { id: 'demo5', name: 'Refurbished Robotics Kit', cat: 'IoT', img: 'robotics,kit', price: 54.99, old: 79.99, rating: 4.5, cond: 'Good' }
    ];
  };

  window.tgObserve = function () {
    var revealItems = document.querySelectorAll('.reveal');
    if (!revealItems.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach(function (item) { observer.observe(item); });
    } else {
      revealItems.forEach(function (item) { item.classList.add('in'); });
    }
  };

  $(function () {
    $('.nav-toggle').on('click', function () {
      $('.nav-links').toggleClass('open');
    });
    $('.nav-links a').on('click', function () {
      $('.nav-links').removeClass('open');
    });

    if (window.tgObserve) {
      window.tgObserve();
    }
  });
})(jQuery);
