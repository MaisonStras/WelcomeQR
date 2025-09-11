(function(){
  // ---------- CONFIG ----------
  const DEMO_URL = './demo.html';
  const CONTACT_EMAIL = 'contact@maisonstras.github.io';
  const WA_NUMBER = '33600000000';
  // ----------------------------

  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));

  // year
  $('#year') && ($('#year').textContent = new Date().getFullYear());

  // demo links
  [$('#hero-demo'), $('#bottom-demo')].forEach(el=>{
    if(!el) return;
    el.href = DEMO_URL;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  // quick contact
  $('#quick-wa') && ($('#quick-wa').href = `https://wa.me/${WA_NUMBER}`);
  $('#quick-mail') && ($('#quick-mail').href = `mailto:${CONTACT_EMAIL}`);

  // modal
  const modal = $('#modal');
  function openModal(pack){
    if(!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden','false');
    setTimeout(()=>$('#name')?.focus(),60);
    if(pack && $('#pack')){
      Array.from($('#pack').options).forEach(o=>{
        if(o.textContent.toLowerCase().startsWith(pack.toLowerCase())) $('#pack').value = o.textContent;
      });
    }
  }

$$('.cta-test').forEach(b=>{
  b.addEventListener('click', ()=> openModal('Starter'));
});




  function closeModal(){
    if(!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden','true');
  }
  $('.open-modal') && $$('.open-modal').forEach(b=>b.addEventListener('click', e=>{
    e.preventDefault(); openModal(b.dataset.pack||'');
  }));
  $('#modal-close')?.addEventListener('click', closeModal);
  window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });
  modal?.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });

  // demo/test buttons
  $('#bottom-test')?.addEventListener('click', ()=> openModal('Starter'));
  $('#hero-test')?.addEventListener('click', ()=> openModal('Starter'));

  // mini QR
  $('#mini-qr') && ($('#mini-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(DEMO_URL)}`);

  // mailto fallback
  function updateMailto(){
    const vals = ['#name','#email','#phone','#listing','#pack'].map(sel => ($(sel)?.value||'').trim());
    const [name,email,phone,listing,pack] = vals;
    const sub = encodeURIComponent('Demande — WelcomeQR');
    const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\nTel: ${phone}\nAnnonce: ${listing}\nPack: ${pack}`);
    $('#mailto-fallback') && ($('#mailto-fallback').href = `mailto:${CONTACT_EMAIL}?subject=${sub}&body=${body}`);
  }
  ['#name','#email','#phone','#listing','#pack'].forEach(s=> $(s)?.addEventListener('input', updateMailto));
  updateMailto();

  // form
  const form = $('#lead-form'), formMsg = $('#form-msg');
  form && form.addEventListener('submit', ()=>{
    formMsg.textContent = 'Envoi en cours…';
    setTimeout(()=> formMsg.textContent = 'Envoi effectué — nous vous contactons sous 24h.',900);
  });

  // bottom nav active
  $$('.bottom-nav .item').forEach(it=>{
    it.addEventListener('click', ()=>{
      $$('.bottom-nav .item').forEach(a=>a.classList.remove('active'));
      it.classList.add('active');
    });
  });

  // ---------------- NAV MENU ----------------
  const openBtn = $('#open-menu') || $('#menu-toggle');
  const closeBtn = $('#close-menu');
  const sideMenu = $('#side-menu');
  const backdrop = $('#menu-backdrop');

  function setOpenState(isOpen){
    if(!sideMenu || !openBtn) return;
    if(isOpen){
      sideMenu.hidden=false; 
      backdrop && (backdrop.hidden=false);
      requestAnimationFrame(()=>{
        sideMenu.classList.add('is-open');
        backdrop && backdrop.classList.add('is-open');
      });
      openBtn.setAttribute('aria-expanded','true');
      document.body.style.overflow='hidden';
    }else{
      sideMenu.classList.remove('is-open');
      backdrop && backdrop.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded','false');
      document.body.style.overflow='';
      setTimeout(()=>{
        sideMenu.hidden=true; 
        backdrop && (backdrop.hidden=true);
      },240);
    }
  }

  openBtn?.addEventListener('click', ()=>setOpenState(true));
  closeBtn?.addEventListener('click', ()=>setOpenState(false));
  backdrop?.addEventListener('click', ()=>setOpenState(false));
  window.addEventListener('keydown', e=>{ if(e.key==='Escape' && !sideMenu.hidden) setOpenState(false); });

  // ---------------- SCROLL TO SECTION ----------------
  // Tous les liens avec data-scroll-to
  $$('a[data-scroll-to]').forEach(link => {
    link.addEventListener('click', e => {
      const selector = link.getAttribute('data-scroll-to');
      const target = document.querySelector(selector);
      if(target){
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setOpenState(false); // fermeture menu
        e.preventDefault();
      }
    });
  });

})();


(function(){
  const slider = document.getElementById('review-slider');
  if(!slider) return;

  const reviews = [
    {text:"Depuis que j'affiche le QR WelcomeQR, j'ai beaucoup moins d'appels pour des questions basiques et je gagne du temps.", author:"Claire D., hôte Airbnb — Strasbourg", date:"Août 2025"},
    {text:"Les voyageurs mentionnent désormais dans leurs commentaires la clarté des instructions, ce qui améliore mes notes.", author:"Julien M., propriétaire de gîte — Colmar", date:"Juil 2025"},
    {text:"Plusieurs clients m'ont dit qu'ils avaient préféré réserver car tout était expliqué avant l'arrivée.", author:"Nathalie R., chambres d'hôtes — Lyon", date:"Juin 2025"},
    {text:"Mes clients internationaux apprécient d'avoir les infos traduites via le QR, moins de confusion et plus de satisfaction.", author:"Sophie L., meublé touristique — Reims", date:"Mars 2025"}
  ];

  let i = 0;
  function render(){
    slider.innerHTML = reviews.map((r, idx) => `
      <div class="review-card ${idx === i ? 'active' : ''}">
        <p>« ${r.text} »</p>
        <div class="review-meta">— ${r.author} · ${r.date}</div>
      </div>
    `).join('');
  }

  function next(){ 
    i = (i + 1) % reviews.length; 
    render(); 
  }

  render(); // affichage initial
  setInterval(next, 6000); // change d’avis toutes les 5s
})();



