(() => {
  const requested = new URLSearchParams(window.location.search).get('project');
  const number = ['01', '02'].includes(requested) ? requested : '01';
  document.querySelector('#project-number').textContent = number;
  document.querySelector('#project-title').textContent = `[Project title ${number}]`;
  document.title = `Project ${number} Placeholder | Luciana`;
})();
