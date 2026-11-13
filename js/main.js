(() => {
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  if (!toggle || !navigation) return;

  document.documentElement.classList.add('nav-ready');
  const mobile = window.matchMedia('(max-width: 720px)');

  function closeMenu(restoreFocus = false) {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    navigation.inert = mobile.matches;
    toggle.querySelector('span').textContent = '+';
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    navigation.inert = !open;
    toggle.querySelector('span').textContent = open ? '-' : '+';
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a') && mobile.matches) closeMenu(true);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  mobile.addEventListener('change', () => {
    const focusWillBeHidden = mobile.matches && navigation.contains(document.activeElement);
    closeMenu(focusWillBeHidden);
  });
  closeMenu();
})();
