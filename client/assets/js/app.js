// =========================================
// Product Management System
// Global JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  checkBackendStatus();
  initPasswordToggle();
});

async function checkBackendStatus() {
  const badge = document.getElementById('statusBadge');
  if (!badge) return;

  badge.className = 'status-badge checking';
  badge.innerHTML = '<span class="status-dot"></span> Checking...';

  try {
    const baseUrl = typeof CONFIG !== 'undefined'
      ? CONFIG.API.BASE_URL.replace('/api', '')
      : 'http://localhost:5000';

    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      badge.className = 'status-badge online';
      badge.innerHTML = '<span class="status-dot"></span> Backend Online';
    } else {
      throw new Error('Not OK');
    }
  } catch {
    badge.className = 'status-badge offline';
    badge.innerHTML = '<span class="status-dot"></span> Backend Offline';
  }
}

function initPasswordToggle() {
  const toggle = document.getElementById('togglePassword');
  const password = document.getElementById('password');
  if (!toggle || !password) return;

  toggle.addEventListener('click', () => {
    const isPassword = password.type === 'password';
    password.type = isPassword ? 'text' : 'password';
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
    }
  });
}
