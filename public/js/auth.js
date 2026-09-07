/**
 * Global Authentication & Session Management Utility
 * PortfolioTracker
 */

/**
 * Logout the current user and safely redirect to the login page
 */
function logout() {
  localStorage.removeItem('portfolio_token');
  localStorage.removeItem('portfolio_user');
  window.location.replace('/');
}

/**
 * Validate token and role. Redirect to login if invalid.
 * @param {string} [requiredRole] - Optional role ('admin' | 'client')
 * @returns {{token: string, user: object} | null}
 */
function checkAuth(requiredRole) {
  const token = localStorage.getItem('portfolio_token');
  const user = JSON.parse(localStorage.getItem('portfolio_user') || 'null');

  if (!token || !user || (requiredRole && requiredRole !== 'any' && user.role !== requiredRole)) {
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_user');
    window.location.replace('/');
    return null;
  }
  return { token, user };
}

/**
 * Automatically highlight active link in navigation
 */
function highlightActiveNavLinks() {
  const normalize = (path) => {
    if (!path) return '';
    let p = path.toLowerCase().split('?')[0].split('#')[0];
    p = p.replace(/\.html$/, '');
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p;
  };

  const currentPath = normalize(window.location.pathname);
  
  document.querySelectorAll('nav a, #mobile-menu a, #admin-mobile-menu a, #client-mobile-menu a').forEach(link => {
    const href = normalize(link.getAttribute('href'));
    if (!href) return;

    if (currentPath === href) {
      link.classList.add('bg-gray-100', 'text-gray-900', 'font-bold');
      link.classList.remove('text-gray-600', 'text-gray-700');
    } else {
      link.classList.remove('bg-gray-100', 'text-gray-900', 'font-bold');
      link.classList.add('text-gray-600');
    }
  });
}

/**
 * Initialize automatic auth guard on page load and back/forward navigation
 * @param {'admin' | 'client' | 'any'} [role]
 */
function initAuthGuard(role = 'any') {
  function verify() {
    const auth = checkAuth(role);
    if (auth && auth.user) {
      const userRole = auth.user.role;

      // Update email/username labels
      const desktopEl = document.getElementById('user-email-desktop');
      if (desktopEl) desktopEl.innerText = auth.user.username;

      const mobileEl = document.getElementById('user-email-mobile');
      if (mobileEl) mobileEl.innerText = auth.user.username;

      const generalEl = document.getElementById('user-email');
      if (generalEl) generalEl.innerText = auth.user.username;

      // Dynamic shared header role switching
      if (userRole === 'admin') {
        const logoAdmin = document.getElementById('nav-logo-admin');
        if (logoAdmin) logoAdmin.classList.remove('hidden');
        const linksDesktopAdmin = document.getElementById('admin-links-desktop');
        if (linksDesktopAdmin) linksDesktopAdmin.classList.remove('hidden');
        const linksMobileAdmin = document.getElementById('admin-links-mobile');
        if (linksMobileAdmin) linksMobileAdmin.classList.remove('hidden');
        const badgeAdmin = document.getElementById('role-badge-admin');
        if (badgeAdmin) badgeAdmin.classList.remove('hidden');
        const badgeMobileAdmin = document.getElementById('role-badge-mobile-admin');
        if (badgeMobileAdmin) badgeMobileAdmin.classList.remove('hidden');

        // Hide client elements
        const logoClient = document.getElementById('nav-logo-client');
        if (logoClient) logoClient.classList.add('hidden');
        const linksDesktopClient = document.getElementById('client-links-desktop');
        if (linksDesktopClient) linksDesktopClient.classList.add('hidden');
        const linksMobileClient = document.getElementById('client-links-mobile');
        if (linksMobileClient) linksMobileClient.classList.add('hidden');
        const badgeClient = document.getElementById('role-badge-client');
        if (badgeClient) badgeClient.classList.add('hidden');
        const badgeMobileClient = document.getElementById('role-badge-mobile-client');
        if (badgeMobileClient) badgeMobileClient.classList.add('hidden');
      } else {
        const logoClient = document.getElementById('nav-logo-client');
        if (logoClient) logoClient.classList.remove('hidden');
        const linksDesktopClient = document.getElementById('client-links-desktop');
        if (linksDesktopClient) linksDesktopClient.classList.remove('hidden');
        const linksMobileClient = document.getElementById('client-links-mobile');
        if (linksMobileClient) linksMobileClient.classList.remove('hidden');
        const badgeClient = document.getElementById('role-badge-client');
        if (badgeClient) badgeClient.classList.remove('hidden');
        const badgeMobileClient = document.getElementById('role-badge-mobile-client');
        if (badgeMobileClient) badgeMobileClient.classList.add('hidden');

        // Hide admin elements
        const logoAdmin = document.getElementById('nav-logo-admin');
        if (logoAdmin) logoAdmin.classList.add('hidden');
        const linksDesktopAdmin = document.getElementById('admin-links-desktop');
        if (linksDesktopAdmin) linksDesktopAdmin.classList.add('hidden');
        const linksMobileAdmin = document.getElementById('admin-links-mobile');
        if (linksMobileAdmin) linksMobileAdmin.classList.add('hidden');
        const badgeAdmin = document.getElementById('role-badge-admin');
        if (badgeAdmin) badgeAdmin.classList.add('hidden');
        const badgeMobileAdmin = document.getElementById('role-badge-mobile-admin');
        if (badgeMobileAdmin) badgeMobileAdmin.classList.add('hidden');
      }

      highlightActiveNavLinks();
    }
  }

  // Execute verification immediately
  verify();

  // Listen for bfcache and popstate events (Back / Forward browser buttons)
  window.addEventListener('pageshow', verify);
  window.addEventListener('popstate', verify);
}
