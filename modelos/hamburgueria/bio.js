(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactMotion = matchMedia('(max-width: 560px)').matches;
  const root = document.documentElement;
  const progress = document.createElement('span');
  progress.className = 'bio-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const items = [
    document.querySelector('.bio-header'),
    document.querySelector('.bio-media'),
    document.querySelector('.quick-note'),
    document.querySelector('.scroll-cue'),
    ...document.querySelectorAll('.bio-link'),
    document.querySelector('.bio-footer')
  ].filter(Boolean);

  items.forEach((item, index) => {
    item.classList.add('bio-reveal');
    item.style.setProperty('--bio-delay', `${Math.min(index * 55, 220)}ms`);
    if (item.matches('.bio-link:nth-child(even)')) item.classList.add('from-right');
  });

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    root.classList.add('motion-reduced');
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.04, rootMargin: '0px 0px 48px' });
  items.forEach(item => observer.observe(item));

  let ticking = false;
  const updateMotion = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;
    const media = compactMotion ? null : document.querySelector('.bio-media img');
    const rect = document.querySelector('.bio-media')?.getBoundingClientRect();
    if (media && rect) {
      const offset = Math.max(-12, Math.min(12, (innerHeight * .5 - (rect.top + rect.height * .5)) * .025));
      media.style.setProperty('--bio-parallax', `${offset}px`);
    }
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateMotion);
      ticking = true;
    }
  }, { passive: true });
  updateMotion();
})();

(() => {
  const products=[{"id":"classico","name":"Clássico da Brasa"},{"id":"duplo","name":"Duplo Cheddar"},{"id":"combo","name":"Combo Burger + Fritas"}];
  const quantity=Object.fromEntries(products.map(p=>[p.id,0]));
  const dialog=document.querySelector('#food-dialog');
  const feedback=document.querySelector('#food-feedback');
  let message='';
  function update(){
    const total=products.reduce((n,p)=>n+quantity[p.id],0);
    products.forEach(p=>document.querySelector('#qty-'+p.id).textContent=quantity[p.id]);
    const lines=products.filter(p=>quantity[p.id]>0).map(p=>quantity[p.id]+'x '+p.name);
    document.querySelector('#order-count').textContent=total?total+' '+(total===1?'item selecionado':'itens selecionados'):'Escolha os itens do pedido.';
    document.querySelector('#order-lines').textContent=lines.join('\n');
    message='Olá! Gostaria de consultar este pedido:\n\n'+lines.join('\n')+'\n\nPodem confirmar os valores e a disponibilidade?';
    const share=document.querySelector('#order-share');share.setAttribute('aria-disabled',String(!total));share.href=total?'https://wa.me/?text='+encodeURIComponent(message):'#';
    document.querySelector('#order-copy').disabled=!total;feedback.textContent='';
  }
  function open(mode){
    const about=mode==='about';document.querySelector('#food-about').hidden=!about;document.querySelector('#food-products').hidden=about;document.querySelector('#food-summary').hidden=about;
    document.querySelector('#food-dialog-title').textContent=about?'Conheça a Brasa Burger':mode==='combos'?'Seu combo favorito':mode==='order'?'Monte seu pedido':'Escolha seu favorito';
    document.querySelectorAll('[data-product]').forEach(el=>el.hidden=mode==='combos'&&el.dataset.product!=='combo');
    update();if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
  }
  document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.open)));
  dialog.querySelector('.food-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.food-about-menu').addEventListener('click',()=>open('menu'));
  document.querySelectorAll('[data-qty]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.qty;quantity[id]=Math.max(0,Math.min(10,quantity[id]+Number(b.dataset.delta)));update()}));
  document.querySelector('#order-clear').addEventListener('click',()=>{products.forEach(p=>quantity[p.id]=0);update()});
  document.querySelector('#order-share').addEventListener('click',e=>{if(e.currentTarget.getAttribute('aria-disabled')==='true')e.preventDefault()});
  document.querySelector('#order-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message);feedback.textContent='Pedido copiado!'}catch{feedback.textContent='Você pode compartilhar o resumo pelo botão do WhatsApp.'}});
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close()});
  update();
})();
