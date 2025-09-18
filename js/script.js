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

  // ---------------- form (VERSION HYBRIDE) ----------------
  const form = $('#lead-form'), formMsg = $('#form-msg');
  if (form) {
    const emailDisplay = document.getElementById('email-display');
    if(emailDisplay && typeof CONTACT_EMAIL !== 'undefined') emailDisplay.textContent = CONTACT_EMAIL;

    form.addEventListener('submit', async function(e){
      e.preventDefault();
      formMsg.style.color = ''; formMsg.textContent = '';




      const name = ($('#name')?.value || '').trim();
      const email = ($('#email')?.value || '').trim();
      const propTitle = ($('#prop-title')?.value || '').trim();
      const propertyType = ($('#property_type')?.value || '').trim();

      if(!name || !email || !propTitle || !propertyType){
        formMsg.textContent = 'Veuillez renseigner : nom, email, titre du logement et type de logement.';
        formMsg.style.color = '#9b1c1c';
        return;
      }

      const checkedSections = Array.from(form.querySelectorAll('input[name="sections"]:checked')).map(c=>c.value);
      if(checkedSections.length === 0){
        formMsg.textContent = 'Merci de cocher au moins une section à inclure dans la démo.';
        formMsg.style.color = '#9b1c1c';
        return;
      }

      const langs = Array.from(form.querySelectorAll('input[name="lang"]:checked')).map(c=>c.value);
      if(langs.length === 0){
        formMsg.textContent = 'Merci de sélectionner au moins une langue.';
        formMsg.style.color = '#9b1c1c';
        return;
      }

      const fileInput = document.getElementById('photos_file');
      const files = fileInput ? Array.from(fileInput.files) : [];
      if(files.length > 3){
        formMsg.textContent = 'Vous pouvez joindre jusqu’à 3 fichiers seulement.';
        formMsg.style.color = '#9b1c1c';
        return;
      }

      const bigFiles = files.filter(f => f.size > 3 * 1024 * 1024);
      const hasBigFiles = bigFiles.length > 0;

      const submitBtn = form.querySelector('button[type="submit"]');
      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Envoi…'; }

      const fd = new FormData(form);
      fd.set('sections_selected', checkedSections.join(' | '));
      fd.set('languages_selected', langs.join(' | '));
      fd.set('files_names', files.map(f=>f.name).join(', ') || '');
      const payload = Object.fromEntries(fd.entries());

      const endpoint = form.getAttribute('action') || 'https://formspree.io/f/xdkdvdgz';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if(!res.ok){
          console.warn('Formspree response not ok', res.status);
          formMsg.innerHTML = 'Impossible d’envoyer automatiquement — utilisez le lien <strong>Envoyer par email</strong> ci-dessous.';
          formMsg.style.color = '#9b1c1c';
          if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Demander ma démo 24h'; }
          return;
        }

        // ---------------- SUCCESS MESSAGE (NOUVEAU) ----------------
        let checkSvg = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:6px"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>`;
        let cameraSvg = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:6px"><path fill="currentColor" d="M9 7H7l-2 3H3v9a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-9h-2l-2-3h-2l-1-2H10l-1 2zM12 17a4 4 0 1 1 .001-8.001A4 4 0 0 1 12 17z"/></svg>`;
        let mailSvg = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:6px"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>`;
        let waSvg = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:6px"><path fill="currentColor" d="M20.5 3.5A11 11 0 0 0 3.5 20.5L2 22l1.6-4.5A11 11 0 1 0 20.5 3.5zM12 21a9 9 0 1 1 9-9 9 9 0 0 1-9 9zM16.2 14.1c-.2-.1-1.2-.6-1.4-.6s-.4-.1-.6.1-.7.6-.8.8-.3.2-.5.1c-.5-.2-1.7-.6-3.1-1.9-1.1-1-1.8-2.2-1.9-2.6-.1-.3 0-.4.1-.6.1-.1.2-.3.4-.5.1-.1.2-.2.3-.4.1-.1.1-.3 0-.5-.1-.2-.6-1.4-.9-1.9-.2-.4-.5-.4-.7-.4-.2 0-.5 0-.8 0-.3 0-.7.1-1 .5s-1.3 1.2-1.3 3.1 1.4 3.6 1.6 3.9 2.6 4 6.3 5.5c3.4 1.4 3.6 1.2 4.2 1.1.6-.1 1.9-.8 2.2-1.6s.3-1.5.2-1.6c-.1-.2-.3-.3-.5-.4z"/></svg>`;

        let message = `
          <div class="form-success">
            <p><strong>${checkSvg}Merci — votre demande de démo a bien été reçue</strong></p>
            <p>Nous préparons votre livret personnalisé. Vous le recevrez sous <strong>24 à 48 heures</strong>. La version d’essai restera active 24h.</p>
            <p>Nous adaptons la mise en page, les couleurs et les sections que vous avez choisies. Nous vous contacterons si nous avons besoin d’informations supplémentaires.</p>
          </div>
        `;

        if (files.length) {
          const subject = encodeURIComponent(`Photos pour démo — ${propTitle || 'démo'}`);
          const bodyLines = [
            `Bonjour,`,
            ``,
            `Voici les photos pour la démo du logement :`,
            `Nom du logement : ${propTitle || ''}`,
            `Adresse (si souhaité) : `,
            `Fichiers à joindre : ${files.map(f=>f.name).join(', ')}`,
            ``,
            `Merci,`,
            `${name} — ${email}`
          ];
          const body = encodeURIComponent(bodyLines.join('\n'));
          const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
          const waText = encodeURIComponent(`Bonjour, je vous envoie les photos pour la démo du logement "${propTitle || ''}". Fichiers: ${files.map(f=>f.name).join(', ')}.`);
          const waLink = (typeof WA_NUMBER !== 'undefined' && WA_NUMBER) ? `https://wa.me/${WA_NUMBER.replace(/\D/g,'')}?text=${waText}` : `https://wa.me/?text=${waText}`;

          message += `
            <div class="form-files">
              <p><strong>${cameraSvg}Vous avez joint ${files.length} fichier(s).</strong></p>
              <p>Pour garantir la meilleure qualité visuelle, merci d’envoyer vos photos en pièce jointe par email à <strong>${CONTACT_EMAIL}</strong> ou via WhatsApp.</p>
              <p class="form-links">
                <a href="${mailto}" target="_blank" rel="noopener noreferrer" class="form-link">${mailSvg}Envoyer par email</a>
                &nbsp;•&nbsp;
                <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="form-link">${waSvg}Envoyer via WhatsApp</a>
              </p>
            </div>
          `;
        }

        formMsg.innerHTML = message;
        formMsg.style.color = '';


        // scroll auto vers le message
        formMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });


        const keepName = form.querySelector('#name')?.value || '';
        const keepEmail = form.querySelector('#email')?.value || '';
        form.reset();
        if(form.querySelector('#name')) form.querySelector('#name').value = keepName;
        if(form.querySelector('#email')) form.querySelector('#email').value = keepEmail;

        if(typeof updateMailto === 'function') updateMailto();
      } catch (err) {
        console.error('Erreur envoi', err);
        formMsg.textContent = 'Erreur réseau — impossible d’envoyer. Utilisez les boutons Email / WhatsApp ci-dessous.';
        formMsg.style.color = '#9b1c1c';
      } finally {
        if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Demander ma démo 24h'; }
      }
    });

    ['#name','#email','#phone','#listing','#pack','#prop-title'].forEach(sel => $(sel)?.addEventListener('input', ()=>{ if(typeof updateMailto==='function') updateMailto(); }));
  }

  // facultatif : ouvrir details sur desktop, fermer sur mobile
  (function(){
    const adv = document.querySelector('details.advanced');
    if(!adv) return;
    function setState(){
      if(window.innerWidth > 900) adv.open = true;
      else adv.open = false;
    }
    setState();
    window.addEventListener('resize', setState);
  })();

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
  $$('a[data-scroll-to]').forEach(link => {
    link.addEventListener('click', e => {
      const selector = link.getAttribute('data-scroll-to');
      const target = document.querySelector(selector);
      if(target){
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setOpenState(false);
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

  render();
  setInterval(next, 6000);
})();
