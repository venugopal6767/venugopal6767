// script.js - render the project cards from projects.json, filter and modal

async function getProjects(){
  try {
    const res = await fetch('projects.json');
    if (!res.ok) throw new Error('projects.json not found');
    return await res.json();
  } catch (err) {
    console.error('Error loading projects.json', err);
    return [];
  }
}

function makeCard(item){
  const a = document.createElement('a');
  a.className = 'card';
  a.href = '#';
  a.dataset.id = item.id;
  a.innerHTML = `
    <div class="card-content">
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <span class="tech">${item.tech}</span>
    </div>
  `;
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    openModal(item);
  });
  return a;
}

function renderGrid(items){
  const grid = document.getElementById('projects');
  grid.innerHTML = '';
  if (!items.length) {
    grid.innerHTML = '<p>No projects yet. Add entries in <code>projects.json</code>.</p>';
    return;
  }
  items.forEach(it => grid.appendChild(makeCard(it)));
}

function openModal(item){
  const modal = document.getElementById('project-modal');
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <h2 id="modal-title">${item.title}</h2>
    <p><strong>Tech:</strong> ${item.tech}</p>
    ${ item.image ? `<img src="${item.image}" alt="${item.title}" style="max-width:100%;margin:12px 0;border-radius:6px"/>` : '' }
    <p>${item.details}</p>
    ${item.github?`<p><a href="${item.github}" target="_blank" rel="noopener">View repository</a></p>`:''}
    ${item.demo?`<p><a href="${item.demo}" target="_blank" rel="noopener">Live demo</a></p>`:''}
  `;
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  const modal = document.getElementById('project-modal');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'modal-close') closeModal();
});

// close modal when clicking outside content
document.getElementById('project-modal').addEventListener('click', (e)=>{
  if(e.target === e.currentTarget) closeModal();
});

// initialize
(async function init(){
  const projects = await getProjects();
  renderGrid(projects);

  const select = document.getElementById('category');
  select.addEventListener('change', e=>{
    const v = e.target.value;
    if(v === 'all') renderGrid(projects);
    else renderGrid(projects.filter(p=>p.category === v));
  });

  // keyboard: Esc closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('project-modal');
      if (modal.getAttribute('aria-hidden') === 'false') closeModal();
    }
  });

})();
