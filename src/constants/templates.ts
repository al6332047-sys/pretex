export interface TemplateApp {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  code: string;
}

export const TEMPLATES: TemplateApp[] = [
  {
    id: 'perfume-store',
    title: 'متجر عطور فاخرة (Luxe Oud & Perfumes)',
    description: 'متجر إلكتروني بتصميم عصري مع سلة تسوق حية، تصفية حسب الفئة، وتفاصيل المنتجات.',
    icon: 'ShoppingBag',
    category: 'تجارة إلكترونية',
    code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>متجر عطور الأندلس | Luxe Perfumery</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; }
  </style>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen">
  <!-- Header -->
  <header class="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
          <i data-lucide="sparkles" class="w-5 h-5"></i>
        </span>
        <h1 class="text-xl font-bold tracking-wide text-amber-400">عطور الأندلس</h1>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
          <input type="text" id="searchInput" placeholder="ابحث عن عطرك المفضل..." 
            class="bg-neutral-800 border border-neutral-700 text-sm px-4 py-2 pr-9 rounded-full w-48 md:w-64 focus:outline-none focus:border-amber-500">
          <i data-lucide="search" class="w-4 h-4 text-neutral-400 absolute right-3 top-2.5"></i>
        </div>
        <button onclick="toggleCart()" class="relative p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition">
          <i data-lucide="shopping-cart" class="w-5 h-5 text-neutral-200"></i>
          <span id="cartCount" class="absolute -top-1 -left-1 bg-amber-500 text-neutral-950 text-xs font-bold px-1.5 py-0.2 rounded-full">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Categories -->
  <div class="max-w-6xl mx-auto px-4 py-6 flex gap-2 overflow-x-auto pb-2">
    <button onclick="filterCategory('الكل')" class="category-btn active px-4 py-1.5 rounded-lg text-sm font-semibold bg-amber-500 text-neutral-950">الكل</button>
    <button onclick="filterCategory('العود')" class="category-btn px-4 py-1.5 rounded-lg text-sm font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-700">عطور العود</button>
    <button onclick="filterCategory('المسك')" class="category-btn px-4 py-1.5 rounded-lg text-sm font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-700">المسك والعنبر</button>
    <button onclick="filterCategory('الزهور')" class="category-btn px-4 py-1.5 rounded-lg text-sm font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-700">عطور فرنسية</button>
  </div>

  <!-- Products Grid -->
  <main class="max-w-6xl mx-auto px-4 pb-16">
    <div id="productsGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      <!-- Injected by JS -->
    </div>
  </main>

  <!-- Cart Drawer -->
  <div id="cartModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden flex justify-end">
    <div class="bg-neutral-900 border-r border-neutral-800 w-full max-w-md h-full flex flex-col p-6 shadow-2xl">
      <div class="flex items-center justify-between pb-4 border-b border-neutral-800">
        <h3 class="text-lg font-bold flex items-center gap-2">
          <i data-lucide="shopping-bag" class="w-5 h-5 text-amber-400"></i>
          سلة المشتريات
        </h3>
        <button onclick="toggleCart()" class="text-neutral-400 hover:text-white p-1">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>
      </div>

      <div id="cartItemsList" class="flex-1 overflow-y-auto py-4 space-y-3">
        <p class="text-neutral-500 text-center py-10">السلة فارغة حالياً</p>
      </div>

      <div class="pt-4 border-t border-neutral-800 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-neutral-400">المجموع الكلي:</span>
          <span id="cartTotal" class="font-bold text-amber-400 text-lg">0 ر.س</span>
        </div>
        <button onclick="checkout()" class="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 rounded-xl transition">
          إتمام الطلب الآن
        </button>
      </div>
    </div>
  </div>

  <script>
    const products = [
      { id: 1, name: 'عود الملوك الملكي', category: 'العود', price: 420, rating: 4.9, desc: 'عود كمبودي معتق مع نفحات الهيل والزعفران' },
      { id: 2, name: 'مسك الحرير الصافي', category: 'المسك', price: 290, rating: 4.8, desc: 'مسك أبيض مخملي بارد يدوم أكثر من 24 ساعة' },
      { id: 3, name: 'سلطان الليل', category: 'العود', price: 550, rating: 5.0, desc: 'مزيج فاخر من خشب الصندل والعنبر والعود الأسود' },
      { id: 4, name: 'زهرة باريس المتألقة', category: 'الزهور', price: 340, rating: 4.7, desc: 'نفحات من الياسمين الدمشقي والبرغموت المنعش' },
      { id: 5, name: 'عنبر الصحراء الذهبي', category: 'المسك', price: 380, rating: 4.8, desc: 'دفء العنبر الأصيل الممزوج بنفحات الفانيلا النقية' },
      { id: 6, name: 'ليالي طليطلة', category: 'الزهور', price: 410, rating: 4.9, desc: 'عطر زهري شرقي يجمع بين زهر البرتقال والباتشولي' }
    ];

    let cart = [];
    let currentCategory = 'الكل';
    let searchQuery = '';

    function renderProducts() {
      const grid = document.getElementById('productsGrid');
      const filtered = products.filter(p => {
        const matchesCat = currentCategory === 'الكل' || p.category === currentCategory;
        const matchesSearch = p.name.includes(searchQuery) || p.desc.includes(searchQuery);
        return matchesCat && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-neutral-500">لا توجد منتجات مطابقة للبحث</div>';
        return;
      }

      grid.innerHTML = filtered.map(p => \`
        <div class="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition group">
          <div>
            <div class="h-40 bg-neutral-800/80 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <i data-lucide="spray-can" class="w-12 h-12 text-amber-400/80"></i>
            </div>
            <div class="flex items-center justify-between text-xs text-neutral-400 mb-1">
              <span>\${p.category}</span>
              <span class="flex items-center gap-1 text-amber-400 font-semibold">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i> \${p.rating}
              </span>
            </div>
            <h4 class="font-bold text-white text-base mb-1">\${p.name}</h4>
            <p class="text-xs text-neutral-400 line-clamp-2 mb-3">\${p.desc}</p>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-neutral-800">
            <span class="font-bold text-amber-400 text-base">\${p.price} ر.س</span>
            <button onclick="addToCart(\${p.id})" class="p-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg font-semibold transition">
              <i data-lucide="plus" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      \`).join('');
      lucide.createIcons();
    }

    function addToCart(id) {
      const item = products.find(p => p.id === id);
      const existing = cart.find(c => c.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...item, qty: 1 });
      }
      updateCartUI();
    }

    function updateCartUI() {
      const count = cart.reduce((sum, item) => sum + item.qty, 0);
      const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      document.getElementById('cartCount').textContent = count;
      document.getElementById('cartTotal').textContent = total + ' ر.س';

      const list = document.getElementById('cartItemsList');
      if (cart.length === 0) {
        list.innerHTML = '<p class="text-neutral-500 text-center py-10">السلة فارغة حالياً</p>';
      } else {
        list.innerHTML = cart.map(item => \`
          <div class="flex items-center justify-between bg-neutral-800/60 p-3 rounded-lg border border-neutral-800">
            <div>
              <h5 class="text-sm font-semibold text-white">\${item.name}</h5>
              <span class="text-xs text-amber-400">\${item.price} ر.س × \${item.qty}</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="changeQty(\${item.id}, -1)" class="w-6 h-6 bg-neutral-700 hover:bg-neutral-600 rounded text-xs flex items-center justify-center">-</button>
              <span class="text-xs font-bold">\${item.qty}</span>
              <button onclick="changeQty(\${item.id}, 1)" class="w-6 h-6 bg-neutral-700 hover:bg-neutral-600 rounded text-xs flex items-center justify-center">+</button>
            </div>
          </div>
        \`).join('');
      }
    }

    function changeQty(id, delta) {
      const item = cart.find(c => c.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== id);
      }
      updateCartUI();
    }

    function toggleCart() {
      const modal = document.getElementById('cartModal');
      modal.classList.toggle('hidden');
    }

    function filterCategory(cat) {
      currentCategory = cat;
      document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.textContent.includes(cat) || (cat === 'الكل' && btn.textContent === 'الكل')) {
          btn.className = 'category-btn active px-4 py-1.5 rounded-lg text-sm font-semibold bg-amber-500 text-neutral-950';
        } else {
          btn.className = 'category-btn px-4 py-1.5 rounded-lg text-sm font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-700';
        }
      });
      renderProducts();
    }

    function checkout() {
      if (cart.length === 0) {
        alert('سلة المشتريات فارغة!');
        return;
      }
      alert('تم تأكيد طلبك بنجاح! شكراً لتسوقك من عطور الأندلس.');
      cart = [];
      updateCartUI();
      toggleCart();
    }

    document.getElementById('searchInput').addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderProducts();
    });

    renderProducts();
    lucide.createIcons();
  </script>
</body>
</html>`
  },
  {
    id: 'kanban-flow',
    title: 'لوحة مهام تفاعلية (Kanban Task Flow)',
    description: 'تطبيق إدارة مشاريع مرن بنظام كانبان، يدعم إضافة المهام، تغيير الحالة، والفلاتر.',
    icon: 'Columns3',
    category: 'إنتاجية وإدارة',
    code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>لوحة إنجاز | TaskFlow</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Cairo', sans-serif; } </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
  <!-- Header -->
  <header class="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
        <i data-lucide="trello" class="w-5 h-5"></i>
      </div>
      <div>
        <h1 class="text-lg font-bold text-white leading-tight">لوحة إنجاز الذكية</h1>
        <p class="text-xs text-slate-400">إدارة المهام وتتبع المشاريع اليومية</p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button onclick="openNewTaskModal()" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-md shadow-blue-600/30">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>مهمة جديدة</span>
      </button>
    </div>
  </header>

  <!-- Board Container -->
  <main class="flex-1 p-6 overflow-x-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto min-w-[750px]">
      
      <!-- Todo Column -->
      <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h3 class="font-bold text-sm text-slate-200">قيد الانتظار</h3>
          </div>
          <span id="todoCount" class="text-xs bg-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-400">0</span>
        </div>
        <div id="col-todo" class="space-y-3 flex-1"></div>
      </div>

      <!-- In Progress Column -->
      <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <h3 class="font-bold text-sm text-slate-200">جاري العمل عليها</h3>
          </div>
          <span id="progressCount" class="text-xs bg-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-400">0</span>
        </div>
        <div id="col-progress" class="space-y-3 flex-1"></div>
      </div>

      <!-- Done Column -->
      <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 class="font-bold text-sm text-slate-200">تم إنجازها بنجاح</h3>
          </div>
          <span id="doneCount" class="text-xs bg-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-400">0</span>
        </div>
        <div id="col-done" class="space-y-3 flex-1"></div>
      </div>

    </div>
  </main>

  <!-- Modal -->
  <div id="taskModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
      <h3 class="text-lg font-bold text-white mb-4">إضافة مهمة جديدة</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">عنوان المهمة</label>
          <input type="text" id="taskTitle" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">وصف موجز</label>
          <textarea id="taskDesc" rows="3" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"></textarea>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">مستوى الأولوية</label>
          <select id="taskPriority" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
            <option value="عالية">عالية 🔴</option>
            <option value="متوسطة" selected>متوسطة 🟡</option>
            <option value="عادية">عادية 🟢</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button onclick="closeTaskModal()" class="px-4 py-2 text-xs text-slate-400 hover:text-white">إلغاء</button>
        <button onclick="saveTask()" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold">حفظ المهمة</button>
      </div>
    </div>
  </div>

  <script>
    let tasks = [
      { id: 1, title: 'تصميم واجهة تسجيل الدخول', desc: 'استخدام ألوان العلامة التجارية والتأكد من التجاوب', status: 'done', priority: 'عالية' },
      { id: 2, title: 'ربط واجهة برمجة التطبيقات API', desc: 'إعداد نقاط الاتصال والتحقق من الأخطاء', status: 'progress', priority: 'عالية' },
      { id: 3, title: 'إضافة إشعارات البريد', desc: 'إرسال تأكيد الحساب عند التسجيل الجديد', status: 'todo', priority: 'متوسطة' },
      { id: 4, title: 'اختبار تجربة المستخدم UX', desc: 'تجربة التطبيق على مختلف أحجام الشاشات', status: 'todo', priority: 'عادية' },
    ];

    function renderTasks() {
      const todoCol = document.getElementById('col-todo');
      const progressCol = document.getElementById('col-progress');
      const doneCol = document.getElementById('col-done');

      todoCol.innerHTML = '';
      progressCol.innerHTML = '';
      doneCol.innerHTML = '';

      const counts = { todo: 0, progress: 0, done: 0 };

      tasks.forEach(t => {
        counts[t.status]++;
        const card = document.createElement('div');
        card.className = 'bg-slate-800/90 border border-slate-700/80 rounded-lg p-3 hover:border-slate-500 transition shadow-sm';
        
        let priorityColor = 'text-slate-400 bg-slate-700/50';
        if (t.priority === 'عالية') priorityColor = 'text-red-400 bg-red-950/40 border border-red-800/50';
        else if (t.priority === 'متوسطة') priorityColor = 'text-amber-400 bg-amber-950/40 border border-amber-800/50';

        card.innerHTML = \`
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <h4 class="font-bold text-sm text-white">\${t.title}</h4>
            <button onclick="deleteTask(\${t.id})" class="text-slate-500 hover:text-red-400 text-xs p-0.5">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <p class="text-xs text-slate-400 mb-3 leading-relaxed">\${t.desc}</p>
          <div class="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <span class="text-[11px] px-2 py-0.5 rounded font-semibold \${priorityColor}">\${t.priority}</span>
            <div class="flex items-center gap-1">
              \${t.status !== 'todo' ? \`<button onclick="moveTask(\${t.id}, 'prev')" class="text-xs p-1 text-slate-400 hover:text-white" title="السابق"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></button>\` : ''}
              \${t.status !== 'done' ? \`<button onclick="moveTask(\${t.id}, 'next')" class="text-xs p-1 text-slate-400 hover:text-white" title="التالي"><i data-lucide="chevron-left" class="w-3.5 h-3.5"></i></button>\` : ''}
            </div>
          </div>
        \`;

        if (t.status === 'todo') todoCol.appendChild(card);
        else if (t.status === 'progress') progressCol.appendChild(card);
        else if (t.status === 'done') doneCol.appendChild(card);
      });

      document.getElementById('todoCount').textContent = counts.todo;
      document.getElementById('progressCount').textContent = counts.progress;
      document.getElementById('doneCount').textContent = counts.done;

      lucide.createIcons();
    }

    function moveTask(id, dir) {
      const order = ['todo', 'progress', 'done'];
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      let idx = order.indexOf(task.status);
      if (dir === 'next' && idx < 2) idx++;
      if (dir === 'prev' && idx > 0) idx--;
      task.status = order[idx];
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    }

    function openNewTaskModal() {
      document.getElementById('taskTitle').value = '';
      document.getElementById('taskDesc').value = '';
      document.getElementById('taskModal').classList.remove('hidden');
    }

    function closeTaskModal() {
      document.getElementById('taskModal').classList.add('hidden');
    }

    function saveTask() {
      const title = document.getElementById('taskTitle').value.trim();
      const desc = document.getElementById('taskDesc').value.trim();
      const priority = document.getElementById('taskPriority').value;
      if (!title) {
        alert('يرجى كتابة عنوان المهمة!');
        return;
      }
      tasks.push({
        id: Date.now(),
        title,
        desc: desc || 'لا يوجد وصف إضافي',
        status: 'todo',
        priority
      });
      closeTaskModal();
      renderTasks();
    }

    renderTasks();
  </script>
</body>
</html>`
  },
  {
    id: 'finance-tracker',
    title: 'متتبع الميزانية والمصاريف (Smart Wallet)',
    description: 'لوحة تفاعلية لإدارة الدخل والمصاريف مع تصنيفات تفصيلية ومؤشرات مالية دقيقة.',
    icon: 'Wallet',
    category: 'مالية وحسابات',
    code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>محفظتي الذكية | Smart Wallet</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <style> body { font-family: 'Cairo', sans-serif; } .font-mono { font-family: 'JetBrains Mono', monospace; } </style>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen p-4 md:p-8">
  <div class="max-w-4xl mx-auto space-y-6">
    
    <!-- Top Bar -->
    <div class="flex items-center justify-between pb-4 border-b border-neutral-800">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
          <i data-lucide="wallet" class="w-6 h-6"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-white">المحفظة المالية الذكية</h1>
          <p class="text-xs text-neutral-400">إدارة المصاريف والمدخرات الشهرية</p>
        </div>
      </div>
      <span class="text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">سبتمبر 2026</span>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <span class="text-xs text-neutral-400">الرصيد المتبقي</span>
        <div id="netBalance" class="text-2xl font-bold font-mono text-white mt-1">0.00 ر.س</div>
      </div>
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <span class="text-xs text-emerald-400 flex items-center gap-1"><i data-lucide="arrow-down-left" class="w-3.5 h-3.5"></i> إجمالي الدخل</span>
        <div id="totalIncome" class="text-2xl font-bold font-mono text-emerald-400 mt-1">0.00 ر.س</div>
      </div>
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <span class="text-xs text-rose-400 flex items-center gap-1"><i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i> إجمالي المصاريف</span>
        <div id="totalExpense" class="text-2xl font-bold font-mono text-rose-400 mt-1">0.00 ر.س</div>
      </div>
    </div>

    <!-- Add Transaction Box -->
    <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <h3 class="text-sm font-bold text-white mb-3 flex items-center gap-2">
        <i data-lucide="plus-circle" class="w-4 h-4 text-emerald-400"></i> تسجيل حركة مالية جديدة
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input type="text" id="txTitle" placeholder="بيان الحركة (مثال: راتب، بقالة...)" class="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
        <input type="number" id="txAmount" placeholder="المبلغ (ر.س)" class="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500">
        <select id="txType" class="bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white">
          <option value="expense">مصروف (-)</option>
          <option value="income">دخل (+)</option>
        </select>
        <button onclick="addTransaction()" class="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl px-4 py-2 text-sm transition">
          إضافة الحركة
        </button>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-white">سجل العمليات الأخيرة</h3>
        <span id="txCount" class="text-xs text-neutral-500">0 عمليات</span>
      </div>
      <div id="txList" class="space-y-2"></div>
    </div>

  </div>

  <script>
    let transactions = [
      { id: 1, title: 'راتب شهري', amount: 9500, type: 'income', date: '2026-09-25' },
      { id: 2, title: 'تسوق تموينات سوبرماركت', amount: 480, type: 'expense', date: '2026-09-24' },
      { id: 3, title: 'اشتراك إنترنت فايبر', amount: 287.5, type: 'expense', date: '2026-09-22' },
      { id: 4, title: 'مشروع تصميم حر', amount: 1800, type: 'income', date: '2026-09-20' },
    ];

    function renderWallet() {
      let income = 0;
      let expense = 0;
      transactions.forEach(t => {
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
      });

      const net = income - expense;
      document.getElementById('netBalance').textContent = net.toLocaleString('ar-SA') + ' ر.س';
      document.getElementById('totalIncome').textContent = income.toLocaleString('ar-SA') + ' ر.س';
      document.getElementById('totalExpense').textContent = expense.toLocaleString('ar-SA') + ' ر.س';
      document.getElementById('txCount').textContent = transactions.length + ' عمليات';

      const list = document.getElementById('txList');
      if (transactions.length === 0) {
        list.innerHTML = '<p class="text-neutral-500 text-center py-6 text-sm">لا توجد عمليات مسجلة</p>';
        return;
      }

      list.innerHTML = transactions.map(t => \`
        <div class="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50 border border-neutral-800 hover:bg-neutral-800 transition">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center \${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}">
              <i data-lucide="\${t.type === 'income' ? 'arrow-down-left' : 'arrow-up-right'}" class="w-4 h-4"></i>
            </div>
            <div>
              <h5 class="text-sm font-semibold text-white">\${t.title}</h5>
              <span class="text-xs text-neutral-500 font-mono">\${t.date}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-mono font-bold text-sm \${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}">
              \${t.type === 'income' ? '+' : '-'}\${t.amount.toLocaleString('ar-SA')} ر.س
            </span>
            <button onclick="removeTx(\${t.id})" class="text-neutral-500 hover:text-rose-400 p-1">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      \`).join('');

      lucide.createIcons();
    }

    function addTransaction() {
      const title = document.getElementById('txTitle').value.trim();
      const amount = parseFloat(document.getElementById('txAmount').value);
      const type = document.getElementById('txType').value;

      if (!title || isNaN(amount) || amount <= 0) {
        alert('يرجى إدخال بيان الحركة ومبلغ صحيح أكبر من الصفر');
        return;
      }

      transactions.unshift({
        id: Date.now(),
        title,
        amount,
        type,
        date: new Date().toISOString().split('T')[0]
      });

      document.getElementById('txTitle').value = '';
      document.getElementById('txAmount').value = '';
      renderWallet();
    }

    function removeTx(id) {
      transactions = transactions.filter(t => t.id !== id);
      renderWallet();
    }

    renderWallet();
  </script>
</body>
</html>`
  }
];
