// =========================================
// Shared Layout — Sidebar & Mobile Nav
// =========================================

const LAYOUT_CONFIG = {
  admin: {
    brand: 'PMS',
    brandSub: 'Admin Panel',
    basePath: '',
    items: [
      { id: 'dashboard', href: 'dashboard.html', icon: 'fa-gauge-high', label: 'Dashboard' },
      { id: 'categories', href: 'categories.html', icon: 'fa-layer-group', label: 'Categories' },
      { id: 'products', href: 'products.html', icon: 'fa-box', label: 'Products' },
      { id: 'vendors', href: 'vendors.html', icon: 'fa-store', label: 'Vendors' },
      { id: 'approvals', href: 'approvals.html', icon: 'fa-circle-check', label: 'Approvals' }
    ]
  },
  vendor: {
    brand: 'PMS',
    brandSub: 'Vendor Portal',
    basePath: '',
    items: [
      { id: 'dashboard', href: 'dashboard.html', icon: 'fa-gauge-high', label: 'Dashboard' },
      { id: 'products', href: 'products.html', icon: 'fa-box', label: 'My Products' },
      { id: 'inventory', href: 'inventory.html', icon: 'fa-boxes-stacked', label: 'Inventory' },
      { id: 'profile', href: 'profile.html', icon: 'fa-user', label: 'Profile' }
    ]
  }
};

function renderSidebar(role, activePage) {
  const config = LAYOUT_CONFIG[role];
  if (!config) return '';

  const navItems = config.items.map(item => {
    const active = item.id === activePage ? ' class="active"' : '';
    return `<li${active}>
      <a href="${config.basePath}${item.href}">
        <i class="fas ${item.icon}"></i>
        ${item.label}
      </a>
    </li>`;
  }).join('');

  return `
    <div class="logo">
      <h3>${config.brand}</h3>
      <span>${config.brandSub}</span>
    </div>
    <ul>${navItems}
      <li>
        <a href="#" id="logoutBtn">
          <i class="fas fa-right-from-bracket"></i>
          Logout
        </a>
      </li>
    </ul>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-user-avatar" id="sidebarAvatar">?</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name" id="sidebarUserName">User</div>
          <div class="sidebar-user-role" id="sidebarUserRole">${role}</div>
        </div>
      </div>
    </div>`;
}

function initLayout() {
  const body = document.body;
  const role = body.dataset.layout;
  const activePage = body.dataset.page;

  if (!role || !LAYOUT_CONFIG[role]) return;

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.innerHTML = renderSidebar(role, activePage);
  }

  const overlay = document.getElementById('sidebarOverlay');
  const toggle = document.getElementById('sidebarToggle');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay?.classList.toggle('active');
    });
  }

  if (overlay && sidebar) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  populateUserInfo();
  wireLogoutButton();
}

function wireLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn && !logoutBtn.dataset.wired) {
    logoutBtn.dataset.wired = 'true';
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
}

function populateUserInfo() {
  if (typeof API === 'undefined' || !API.isAuthenticated()) return;

  const user = API.getUser();
  if (!user) return;

  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const nameEl = document.getElementById('sidebarUserName');
  const avatarEl = document.getElementById('sidebarAvatar');
  const vendorNameEl = document.getElementById('vendorName');

  if (nameEl) nameEl.textContent = name;
  if (avatarEl) avatarEl.textContent = initials;
  if (vendorNameEl) vendorNameEl.textContent = name;
}

document.addEventListener('DOMContentLoaded', initLayout);
