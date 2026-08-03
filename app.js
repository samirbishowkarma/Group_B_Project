(function ($) {
  "use strict";

  var CURRENCY = "\u00a3";
  var SHIP = 4.99;
  var KEY = { cart: "tg_cart", listings: "tg_listings", users: "tg_users", session: "tg_session", wish: "tg_wish", posts: "tg_posts" };

  var TONE = {
    Sensors: ["#2dd4ff", "#1e3a5f"],
    Mechanical: ["#ff9d5c", "#5f3a1e"],
    Gadgets: ["#22f5c8", "#1e5f4f"],
    IoT: ["#8b5cff", "#3a1e5f"]
  };

  function photo(kw, seed, w, h) {
    w = w || 640; h = h || 480;
    return "https://loremflickr.com/" + w + "/" + h + "/" + encodeURIComponent(kw) + "?lock=" + seed;
  }

  function seedOf(id) {
    var n = 0;
    for (var i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) % 100000;
    return n + 7;
  }

  function fallbackURI(cat) {
    var t = TONE[cat] || TONE.Sensors;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + t[1] + '"/><stop offset="1" stop-color="#0b0e17"/></linearGradient></defs>' +
      '<rect width="640" height="480" fill="url(#g)"/>' +
      '<g fill="none" stroke="' + t[0] + '" stroke-opacity="0.5" stroke-width="3">' +
      '<circle cx="320" cy="230" r="70"/><circle cx="320" cy="230" r="30"/>' +
      '<path d="M320 130 v40 M320 290 v40 M220 230 h40 M380 230 h40" stroke-linecap="round"/>' +
      '<path d="M150 120 h80 v40 M490 360 h-80 v-40" stroke-opacity="0.3"/></g>' +
      '<circle cx="320" cy="230" r="9" fill="' + t[0] + '"/>' +
      '<text x="320" y="420" fill="' + t[0] + '" fill-opacity="0.75" font-family="Segoe UI,Arial" font-size="26" font-weight="700" text-anchor="middle" letter-spacing="2">TECHNOLOGIA</text>' +
      '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  window.tgImgErr = function (el) {
    el.onerror = null;
    el.src = fallbackURI(el.getAttribute("data-cat") || "Sensors");
  };

  var CATALOG = [
    { id: "s1", name: "DHT22 Temp & Humidity Sensor", cat: "Sensors", img: "temperature,sensor,electronics", price: 12.99, old: 16.99, rating: 4.7, cond: "New", brand: "Aosong", desc: "Digital temperature and humidity sensor with calibrated output and wide operating range, ideal for weather stations and smart-home builds." },
    { id: "s2", name: "HC-SR04 Ultrasonic Distance", cat: "Sensors", img: "arduino,sensor,module", price: 4.49, old: 6.49, rating: 4.5, cond: "New", brand: "Generic", desc: "Non-contact ultrasonic ranging module measuring 2cm to 4m, perfect for obstacle-avoidance robots and level detection." },
    { id: "s3", name: "MPU-6050 Gyro + Accelerometer", cat: "Sensors", img: "microchip,circuit", price: 8.99, old: 0, rating: 4.8, cond: "New", brand: "InvenSense", desc: "Six-axis motion tracking device combining a gyroscope and accelerometer over I2C for drones, gimbals and gesture control." },
    { id: "s4", name: "BMP280 Barometric Pressure", cat: "Sensors", img: "electronics,sensor,chip", price: 7.49, old: 0, rating: 4.6, cond: "New", brand: "Bosch", desc: "High-precision barometric pressure and altitude sensor with tiny footprint and low power draw." },
    { id: "m1", name: "NEMA 17 Stepper Motor", cat: "Mechanical", img: "stepper,motor", price: 19.99, old: 24.99, rating: 4.9, cond: "New", brand: "StepLine", desc: "1.8-degree bipolar stepper delivering strong holding torque for 3D printers, CNC and precise positioning rigs." },
    { id: "m2", name: "Aluminium Gear Set (20T)", cat: "Mechanical", img: "gears,metal,machine", price: 10.99, old: 0, rating: 4.4, cond: "New", brand: "MechCore", desc: "CNC-machined aluminium spur gears with hardened teeth for smooth, backlash-free power transmission." },
    { id: "m3", name: "SG90 Micro Servo Motor", cat: "Mechanical", img: "servo,motor,robotics", price: 5.49, old: 7.49, rating: 4.6, cond: "New", brand: "TowerPro", desc: "Lightweight 9g servo with 180-degree rotation, great for robotic arms, RC steering and animatronics." },
    { id: "m4", name: "Linear Rail & Bearing Kit", cat: "Mechanical", img: "cnc,machine,rail", price: 32.99, old: 0, rating: 4.7, cond: "New", brand: "SlideTech", desc: "Hardened linear rail with recirculating ball bearing block for stable, low-friction motion on custom machines." },
    { id: "g1", name: "Smart Fitness Watch Pro", cat: "Gadgets", img: "smartwatch,wearable", price: 69.99, old: 89.99, rating: 4.5, cond: "New", brand: "Pulse", desc: "AMOLED smartwatch with heart-rate, SpO2, GPS and a 10-day battery, water resistant to 50 metres." },
    { id: "g2", name: "Action Camera 4K", cat: "Gadgets", img: "action,camera,gopro", price: 124.99, old: 154.99, rating: 4.6, cond: "New", brand: "GoView", desc: "Rugged 4K/60fps action camera with electronic stabilisation, waterproof housing and touchscreen." },
    { id: "g3", name: "Wireless Mechanical Keyboard", cat: "Gadgets", img: "mechanical,keyboard", price: 48.99, old: 0, rating: 4.8, cond: "New", brand: "KeyForge", desc: "Hot-swappable 75% mechanical keyboard with tactile switches, RGB backlight and tri-mode connectivity." },
    { id: "g4", name: "Power Bank 20000mAh", cat: "Gadgets", img: "powerbank,charger", price: 29.99, old: 38.99, rating: 4.4, cond: "New", brand: "Voltix", desc: "High-capacity power bank with 22.5W fast charging, USB-C PD and a slim aluminium body." },
    { id: "i1", name: "ESP32 Wi-Fi + BLE Dev Board", cat: "IoT", img: "microcontroller,circuit,board", price: 13.99, old: 17.99, rating: 4.9, cond: "New", brand: "Espressif", desc: "Dual-core microcontroller with Wi-Fi and Bluetooth, the go-to brain for connected IoT projects." },
    { id: "i2", name: "Raspberry Pi 4 (4GB)", cat: "IoT", img: "raspberry,pi,computer", price: 134.99, old: 0, rating: 4.9, cond: "New", brand: "Raspberry Pi", desc: "Quad-core single-board computer with 4GB RAM, dual HDMI and gigabit ethernet for edge and home-server builds." },
    { id: "i3", name: "Smart Wi-Fi Plug", cat: "IoT", img: "smart,home,plug", price: 15.99, old: 20.99, rating: 4.3, cond: "New", brand: "HomeLink", desc: "App-controlled smart plug with energy monitoring, scheduling and voice-assistant support." },
    { id: "i4", name: "Mini Surveillance Drone", cat: "IoT", img: "drone,quadcopter", price: 109.99, old: 129.99, rating: 4.5, cond: "New", brand: "SkyByte", desc: "Compact quadcopter with FPV camera, altitude hold and one-key return for aerial monitoring." }
  ];

  function read(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
  function write(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  var TG = {
    CURRENCY: CURRENCY,
    SHIP: SHIP,
    photo: photo,
    fallbackURI: fallbackURI,
    money: function (n) { return CURRENCY + Number(n).toFixed(2); },
    catalog: function () { return CATALOG.slice(); },
    listings: function () { return read(KEY.listings, []); },
    all: function () { return CATALOG.concat(read(KEY.listings, [])); },
    find: function (id) { return TG.all().filter(function (p) { return p.id === id; })[0]; },
    cart: function () { return read(KEY.cart, []); },
    wish: function () { return read(KEY.wish, []); },
    users: function () { return read(KEY.users, []); },
    session: function () { try { return JSON.parse(sessionStorage.getItem(KEY.session)); } catch (e) { return null; } },
    posts: function () { return read(KEY.posts, []); },

    imgFor: function (p, w, h) {
      if (p.photos && p.photos.length) return p.photos[0];
      if (p.img) return photo(p.img, seedOf(p.id), w, h);
      return fallbackURI(p.cat);
    },
    imgTag: function (p, w, h, cls) {
      var src = TG.imgFor(p, w, h);
      var isData = src.indexOf("data:") === 0;
      return '<img class="' + (cls || "") + '" src="' + src + '" alt="' + (p.name || "product") + '" loading="lazy" data-cat="' + p.cat + '"' + (isData ? "" : ' onerror="tgImgErr(this)"') + '>';
    },

    saveListing: function (item) { var list = read(KEY.listings, []); list.unshift(item); write(KEY.listings, list); },
    cartCount: function () { return TG.cart().reduce(function (s, i) { return s + i.qty; }, 0); },
    cartTotal: function () { return TG.cart().reduce(function (s, i) { return s + i.qty * i.price; }, 0); },
    addToCart: function (id, qty) {
      qty = qty || 1;
      var p = TG.find(id); if (!p) return;
      var cart = TG.cart();
      var row = cart.filter(function (i) { return i.id === id; })[0];
      if (row) { row.qty += qty; } else {
        cart.push({ id: p.id, name: p.name, price: p.price, cat: p.cat, img: p.img, photos: p.photos, cond: p.cond, qty: qty });
      }
      write(KEY.cart, cart); TG.refreshBadge(true);
    },
    setQty: function (id, qty) { write(KEY.cart, TG.cart().map(function (i) { if (i.id === id) i.qty = Math.max(1, qty); return i; })); TG.refreshBadge(); },
    removeFromCart: function (id) { write(KEY.cart, TG.cart().filter(function (i) { return i.id !== id; })); TG.refreshBadge(); },
    clearCart: function () { write(KEY.cart, []); TG.refreshBadge(); },

    toggleWish: function (id) {
      var w = TG.wish();
      if (w.indexOf(id) > -1) w = w.filter(function (x) { return x !== id; }); else w.push(id);
      write(KEY.wish, w); return w.indexOf(id) > -1;
    },
    inWish: function (id) { return TG.wish().indexOf(id) > -1; },

    registerUser: function (u) {
      var users = read(KEY.users, []);
      if (users.some(function (x) { return x.email === u.email; })) return false;
      users.push(u); write(KEY.users, users); return true;
    },
    login: function (email, pass) {
      var u = read(KEY.users, []).filter(function (x) { return x.email === email && x.pass === pass; })[0];
      if (u) { sessionStorage.setItem(KEY.session, JSON.stringify({ name: u.name, email: u.email })); return true; }
      return false;
    },
    logout: function () { sessionStorage.removeItem(KEY.session); },

    savePost: function (post) {
      var posts = TG.posts();
      post.id = "p" + Date.now();
      post.time = Date.now();
      post.replies = [];
      posts.unshift(post);
      write(KEY.posts, posts);
      return post;
    },
    saveReply: function (postId, reply) {
      var posts = TG.posts();
      var post = posts.filter(function (p) { return p.id === postId; })[0];
      if (post) {
        reply.time = Date.now();
        post.replies.push(reply);
        write(KEY.posts, posts);
      }
    },
    deletePost: function (postId) {
      write(KEY.posts, TG.posts().filter(function (p) { return p.id !== postId; }));
    },

    refreshBadge: function (bump) {
      var n = TG.cartCount();
      var $b = $(".cart-badge");
      $b.text(n).toggleClass("show", n > 0);
      if (bump && n > 0 && $b.length) { $b.removeClass("bump"); void $b[0].offsetWidth; $b.addClass("bump"); }
    },

    toast: function (msg, kind) {
      var $host = $(".toast-host");
      if (!$host.length) $host = $('<div class="toast-host"></div>').appendTo("body");
      var $t = $('<div class="toast ' + (kind || "") + '">' + msg + "</div>").appendTo($host);
      requestAnimationFrame(function () { $t.addClass("show"); });
      setTimeout(function () { $t.removeClass("show"); setTimeout(function () { $t.remove(); }, 400); }, 2600);
    }
  };
}
)