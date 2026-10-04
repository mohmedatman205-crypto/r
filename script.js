/* =========================================================
   SHOKA RESTAURANT — Cart + Orders + WhatsApp
   ========================================================= */

const CONFIG = {
  whatsapp: '201090835673',      // رقم واتساب المطعم (دولي بدون +)
  phone: '01007760265',
  deliveryFee: 15,
  currency: 'جنيه'
};

/* ---------- Menu Data (Demo — عدّلها ببياناتك) ---------- */
const CATEGORIES = [
  { id: 'all',        name: 'الكل',        icon: '✦' },
  { id: 'pizza',      name: 'البيتزا',     icon: '🍕' },
  { id: 'burger',     name: 'البرجر',      icon: '🍔' },
  { id: 'crepe',      name: 'الكريب',      icon: '🌯' },
  { id: 'appetizers', name: 'المقبلات',    icon: '🍟' },
  { id: 'drinks',     name: 'المشروبات',   icon: '🥤' }
];

const PRODUCTS = [
  { id:1,  name:'بيتزا ميكس جبن',   desc:'مزيج من أجود أنواع الجبن الطازجة',    price:180, category:'pizza',      popular:true,  isNew:true,  image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
  { id:2,  name:'بيتزا مارجريتا',   desc:'صلصة طماطم، موزاريلا، ريحان طازج',    price:150, category:'pizza',      popular:true,  isNew:false, image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80' },
  { id:3,  name:'بيتزا خضار',       desc:'خضروات طازجة مشكلة على العجينة',      price:160, category:'pizza',      popular:false, isNew:false, image:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80' },
  { id:4,  name:'بيتزا سجق',        desc:'سجق مشوي مع جبن موزاريلا',            price:190, category:'pizza',      popular:false, isNew:true,  image:'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&q=80' },
  { id:5,  name:'برجر لحم',         desc:'برجر لحم مشوي مع جبن وصوص خاص',       price:120, category:'burger',     popular:true,  isNew:false, image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { id:6,  name:'برجر دجاج مقرمش',  desc:'صدر دجاج مقرمش مع الخس والطماطم',     price:100, category:'burger',     popular:false, isNew:false, image:'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80' },
  { id:7,  name:'كريب فراخ',        desc:'كريب محشو بقطع الدجاج والجبن',         price:90,  category:'crepe',      popular:false, isNew:true,  image:'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80' },
  { id:8,  name:'كريب جبن',         desc:'كريب محشو بالجبن السائح',              price:75,  category:'crepe',      popular:false, isNew:false, image:'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80' },
  { id:9,  name:'بطاطس مقلية',      desc:'بطاطس مقرمشة مع توابل خاصة',           price:45,  category:'appetizers', popular:true,  isNew:false, image:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80' },
  { id:10, name:'أصابع موزاريلا',   desc:'أصابع جبن مقرمشة مع صوص',              price:65,  category:'appetizers', popular:false, isNew:false, image:'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&q=80' },
  { id:11, name:'بيبسي',            desc:'مشروب غازي مثلج 330 مل',               price:25,  category:'drinks',     popular:false, isNew:false, image:'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&q=80' },
  { id:12, name:'عصير برتقال',      desc:'عصير برتقال طازج طبيعي',               price:35,  category:'drinks',     popular:true,  isNew:false, image:'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80' }
];

/* =========================================================
   CART
   ========================================================= */
const Cart = {
  items: [],

  init(){
    try {
      const saved = JSON.parse(localStorage.getItem('shoka_cart') || '[]');
      this.items = Array.isArray(saved) ? saved : [];
    } catch { this.items = []; }
    this.updateUI();
  },

  save(){
    localStorage.setItem('shoka_cart', JSON.stringify(this.items));
  },

  add(product){
    const existing = this.items.find(i => i.id === product.id);
    if (existing){
      existing.qty += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }
    this.save();
    this.updateUI();
    Toast.show(`تمت إضافة "${product.name}" إلى السلة`, 'success');
    this.bumpBadge();
    // tiny feedback on the button itself
    const btn = document.querySelector(`.add-to-cart[data-id="${product.id}"]`);
    if (btn){
      btn.classList.add('added');
      btn.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = '<i class="fas fa-plus"></i> أضف للسلة';
      }, 1400);
    }
  },

  remove(id){
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    this.updateUI();
    Toast.show('تم حذف المنتج من السلة');
  },

  changeQty(id, delta){
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0){
      this.remove(id);
    } else {
      this.save();
      this.updateUI();
    }
  },

  clear(){
    this.items = [];
    this.save();
    this.updateUI();
  },

  count(){
    return this.items.reduce((s,i) => s + i.qty, 0);
  },

  subtotal(){
    return this.items.reduce((s,i) => s + i.price * i.qty, 0);
  },

  delivery(){
    return this.items.length === 0 ? 0 : CONFIG.deliveryFee;
  },

  total(){
    return this.subtotal() + this.delivery();
  },

  updateUI(){
    const badge = document.getElementById('cartBadge');
    if (badge){
      const n = this.count();
      badge.textContent = n;
      badge.style.display = n > 0 ? 'flex' : 'none';
    }

    const countLabel = document.getElementById('cartItemsCount');
    if (countLabel) countLabel.textContent = this.count() + ' منتج';

    const body = document.getElementById('cartBody');
    const footer = document.getElementById('cartFooter');
    if (!body) return;

    if (this.items.length === 0){
      body.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-bag"></i>
          <p>السلة فارغة</p>
          <span>أضف بعض الأطباق الشهية للبدء</span>
        </div>`;
      if (footer) footer.style.display = 'none';
      return;
    }

    body.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">${item.price} ${CONFIG.currency}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="Cart.changeQty(${item.id}, -1)" aria-label="ناقص">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.changeQty(${item.id}, 1)" aria-label="زائد">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="Cart.remove(${item.id})" aria-label="حذف">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join('');

    if (footer){
      footer.style.display = 'block';
      document.getElementById('cartSubtotal').textContent = this.subtotal() + ' ' + CONFIG.currency;
      document.getElementById('cartDelivery').textContent = this.delivery() + ' ' + CONFIG.currency;
      document.getElementById('cartTotal').textContent = this.total() + ' ' + CONFIG.currency;
    }
  },

  bumpBadge(){
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  }
};

/* =========================================================
   TOAST
   ========================================================= */
const Toast = {
  timer: null,
  show(msg, type = ''){
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast ' + type;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(this.timer);
    this.timer = setTimeout(() => el.classList.remove('show'), 2400);
  }
};

/* =========================================================
   MENU RENDERING
   ========================================================= */
const Menu = {
  activeCategory: 'all',

  init(){
    this.renderTabs();
    this.renderMenu();
    this.renderPopular();
    // feature dish also uses direct Cart.add()
  },

  renderTabs(){
    const el = document.getElementById('menuTabs');
    if (!el) return;
    el.innerHTML = CATEGORIES.map(c =>
      `<button class="tab-btn ${c.id === 'all' ? 'active' : ''}" data-cat="${c.id}">
        <span style="margin-left:6px">${c.icon}</span>${c.name}
      </button>`
    ).join('');
    el.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.dataset.cat;
        this.renderMenu();
      });
    });
  },

  renderMenu(){
    const el = document.getElementById('menuList');
    if (!el) return;
    const list = PRODUCTS.filter(p =>
      this.activeCategory === 'all' || p.category === this.activeCategory
    );
    if (!list.length){
      el.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-dim);padding:40px 0">لا توجد منتجات في هذا التصنيف حاليًا</p>`;
      return;
    }
    el.innerHTML = list.map(p => this.itemHTML(p)).join('');
  },

  renderPopular(){
    const el = document.getElementById('popularList');
    if (!el) return;
    const list = PRODUCTS.filter(p => p.popular);
    el.innerHTML = list.map(p => this.itemHTML(p, true)).join('');
  },

  itemHTML(p, showPopularBadge = false){
    return `
      <div class="menu-item">
        <div class="menu-item-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="menu-item-info">
          <div class="menu-item-head">
            <h4 class="menu-item-name">
              ${p.name}
              ${p.isNew ? '<span class="badge-new">جديد</span>' : ''}
              ${showPopularBadge ? '<span class="badge-popular">★ الأكثر طلبًا</span>' : ''}
            </h4>
            <span class="menu-item-line"></span>
            <span class="menu-item-price">${p.price} ${CONFIG.currency}</span>
          </div>
          <p class="menu-item-desc">${p.desc}</p>
          <div class="menu-item-actions">
            <button class="add-to-cart" data-id="${p.id}" onclick="Cart.add(${JSON.stringify(p).replace(/"/g,'&quot;')})">
              <i class="fas fa-plus"></i> أضف للسلة
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

/* =========================================================
   DRAWER + MODAL CONTROL
   ========================================================= */
const UI = {
  init(){
    // Open / close cart
    document.getElementById('openCartBtn')?.addEventListener('click', () => this.openCart());
    document.getElementById('closeCartBtn')?.addEventListener('click', () => this.closeCart());
    document.getElementById('cartOverlay')?.addEventListener('click', () => this.closeCart());

    // Checkout
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
      if (Cart.items.length === 0){
        Toast.show('السلة فارغة!', 'error');
        return;
      }
      this.closeCart();
      this.renderMiniSummary();
      this.openOrderModal();
    });

    // Close order modal
    document.getElementById('closeOrderModal')?.addEventListener('click', () => this.closeOrderModal());
    document.getElementById('orderModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'orderModal') this.closeOrderModal();
    });

    // Order type switch
    document.querySelectorAll('input[name="otype"]').forEach(r => {
      r.addEventListener('change', () => this.toggleOrderType());
    });

    // Submit order
    document.getElementById('orderForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitOrder();
    });

    // Navbar scroll
    window.addEventListener('scroll', () => {
      document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 40);
      document.getElementById('scrollTop')?.classList.toggle('show', window.scrollY > 400);
    });

    // Mobile menu
    const toggle = document.getElementById('menuToggle');
    const links = document.getElementById('navLinks');
    toggle?.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('active');
    });
    links?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('active');
      });
    });

    // Scroll top
    document.getElementById('scrollTop')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Reserve badge scroll to contact
    document.getElementById('reserveBadge')?.addEventListener('click', () => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape'){
        this.closeCart();
        this.closeOrderModal();
      }
    });
  },

  openCart(){
    document.getElementById('cartDrawer').classList.add('active');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
    document.getElementById('cartOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  },
  closeCart(){
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = '';
  },

  openOrderModal(){
    document.getElementById('orderModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  },
  closeOrderModal(){
    document.getElementById('orderModal').classList.remove('active');
    document.body.style.overflow = '';
  },

  toggleOrderType(){
    const type = document.querySelector('input[name="otype"]:checked').value;
    const delivery = document.getElementById('deliveryBlock');
    const dinein = document.getElementById('dineinBlock');
    if (type === 'توصيل'){
      delivery.style.display = 'block';
      dinein.style.display = 'none';
      document.getElementById('oAddress').required = true;
      document.getElementById('oArea').required = true;
      document.getElementById('oTable').required = false;
    } else if (type === 'داخل المطعم'){
      delivery.style.display = 'none';
      dinein.style.display = 'block';
      document.getElementById('oAddress').required = false;
      document.getElementById('oArea').required = false;
      document.getElementById('oTable').required = true;
    } else {
      delivery.style.display = 'none';
      dinein.style.display = 'none';
      document.getElementById('oAddress').required = false;
      document.getElementById('oArea').required = false;
      document.getElementById('oTable').required = false;
    }
    this.renderMiniSummary();
  },

  renderMiniSummary(){
    const el = document.getElementById('orderMiniSummary');
    if (!el) return;
    const type = document.querySelector('input[name="otype"]:checked')?.value || 'توصيل';
    const sub = Cart.subtotal();
    const delivery = type === 'توصيل' ? CONFIG.deliveryFee : 0;
    const total = sub + delivery;
    el.innerHTML = `
      <div class="row"><span>إجمالي المنتجات</span><span>${sub} ${CONFIG.currency}</span></div>
      ${type === 'توصيل' ? `<div class="row"><span>رسوم التوصيل</span><span>${delivery} ${CONFIG.currency}</span></div>` : ''}
      <div class="row total"><span>الإجمالي</span><span>${total} ${CONFIG.currency}</span></div>
    `;
  },

  submitOrder(){
    const name = document.getElementById('oName').value.trim();
    const phone = document.getElementById('oPhone').value.trim();
    if (!name || !phone){
      Toast.show('يرجى إكمال البيانات المطلوبة', 'error');
      return;
    }
    if (!/^01[0-9]{9}$/.test(phone)){
      Toast.show('رقم الهاتف غير صحيح', 'error');
      return;
    }

    const type = document.querySelector('input[name="otype"]:checked').value;
    const address = document.getElementById('oAddress').value.trim();
    const area = document.getElementById('oArea').value.trim();
    const table = document.getElementById('oTable').value;
    const notes = document.getElementById('oNotes').value.trim();

    if (type === 'توصيل' && (!address || !area)){
      Toast.show('يرجى إدخال العنوان والمنطقة', 'error');
      return;
    }
    if (type === 'داخل المطعم' && !table){
      Toast.show('يرجى إدخال رقم الطاولة', 'error');
      return;
    }

    const sub = Cart.subtotal();
    const delivery = type === 'توصيل' ? CONFIG.deliveryFee : 0;
    const total = sub + delivery;

    const orderId = 'SH' + Date.now().toString().slice(-6);

    let msg = `*طلب جديد من مطعم شوكة*\n`;
    msg += `رقم الطلب: ${orderId}\n`;
    msg += `----------------------\n`;
    msg += `*الأصناف:*\n`;
    Cart.items.forEach(i => {
      msg += `• ${i.qty} × ${i.name} — ${i.price * i.qty} ${CONFIG.currency}\n`;
    });
    msg += `----------------------\n`;
    msg += `نوع الطلب: ${type}\n`;
    msg += `الاسم: ${name}\n`;
    msg += `الهاتف: ${phone}\n`;
    if (type === 'توصيل'){
      msg += `العنوان: ${address}\n`;
      msg += `المنطقة: ${area}\n`;
    }
    if (type === 'داخل المطعم') msg += `رقم الطاولة: ${table}\n`;
    if (notes) msg += `ملاحظات: ${notes}\n`;
    msg += `----------------------\n`;
    msg += `المجموع الفرعي: ${sub} ${CONFIG.currency}\n`;
    if (delivery) msg += `رسوم التوصيل: ${delivery} ${CONFIG.currency}\n`;
    msg += `*الإجمالي: ${total} ${CONFIG.currency}*\n`;

    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    Toast.show('تم تجهيز طلبك على واتساب ✓', 'success');
    this.closeOrderModal();
    Cart.clear();
  }
};

/* =========================================================
   BOOT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  Menu.init();
  UI.init();
  UI.toggleOrderType();
});