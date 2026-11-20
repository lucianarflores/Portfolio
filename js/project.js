(() => {
  const requested = new URLSearchParams(window.location.search).get('project');
  const number = ['01', '02'].includes(requested) ? requested : '01';
  document.querySelector('#project-title').textContent = `[Project title ${number}]`;
  document.title = `Project ${number} Placeholder | Luciana`;

  if (number !== '01') {
    setupCaseNavigation();
    return;
  }

  document.body.classList.add('wing-snob-project');
  document.querySelector('.site-header nav a[href="index.html#work"]').setAttribute('aria-current', 'location');
  const title = 'Wing Snob Mobile Ordering Redesign';
  const summary = "Redesigning Wing Snob's mobile ordering flow to let customers browse the menu before selecting a location or choosing pickup or delivery.";
  const titleAccent = document.createElement('span');
  titleAccent.className = 'name-accent case-title-subtitle';
  titleAccent.textContent = 'Mobile Ordering Redesign';
  document.querySelector('#project-title').replaceChildren('Wing Snob ', titleAccent);
  document.querySelector('#project-summary').textContent = summary;
  document.title = `${title} | Luciana Flores`;
  document.querySelector('meta[name="description"]').content = summary;

  document.querySelector('#project-meta').remove();

  const coverImage = document.createElement('img');
  coverImage.src = 'wing-snob-case.png';
  coverImage.alt = 'Wing Snob tools and methods alongside the serving-options screen, skip confirmation, and menu categories';
  coverImage.width = 2172;
  coverImage.height = 724;
  const cover = document.querySelector('#project-cover');
  cover.classList.remove('image-placeholder');
  cover.classList.add('case-cover-featured', 'case-media');
  cover.replaceChildren(coverImage);

  const content = document.querySelector('#wing-snob-case').content.cloneNode(true);
  const navigation = document.querySelector('#project-navigation');
  navigation.querySelectorAll('a').forEach((link) => link.remove());
  content.querySelectorAll('section').forEach((section, index) => {
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = `${String(index + 1).padStart(2, '0')}: ${section.dataset.navTitle}`;
    navigation.append(link);
  });
  document.querySelector('#project-content').replaceChildren(content);
  setupCaseNavigation();

  function setupCaseNavigation() {
    const navigation = document.querySelector('#project-navigation');
    const header = document.querySelector('.site-header');
    const mobile = window.matchMedia('(max-width: 720px)');
    const links = Array.from(navigation.querySelectorAll('a'));
    const sections = links.map((link) => document.getElementById(link.hash.slice(1)));
    links.forEach((link) => {
      link.textContent = link.textContent.replace(/^(\d+)\s*\/\s*/, '$1: ');
    });
    let activeIndex = -1;
    let queued = false;

    function update() {
      queued = false;
      const readingLine = (mobile.matches
        ? navigation.getBoundingClientRect().bottom
        : header.offsetHeight) + 40;
      let current = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= readingLine + 2) current = index;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections.length - 1;
      }
      if (current === activeIndex) return;
      activeIndex = current;
      links.forEach((link, index) => {
        if (index === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      if (mobile.matches) {
        const link = links[current];
        navigation.scrollLeft = current === 0 ? 0 : link.offsetLeft - (navigation.clientWidth - link.offsetWidth) / 2;
      }
    }

    function scheduleUpdate() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('load', scheduleUpdate);
    update();
  }
})();
