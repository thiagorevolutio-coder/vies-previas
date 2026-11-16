(() => {
'use strict';
const config=window.BIO_CONFIG||{},root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)'),gate=document.querySelector('.gate'),shell=document.querySelector('.shell'),key='vies-orbita-age:'+location.pathname;
const validUrl=value=>{try{return ['https:','http:'].includes(new URL(value).protocol)}catch{return false}};
document.querySelectorAll('[data-name]').forEach(e=>e.textContent=config.name||'Sua marca');
document.querySelectorAll('[data-handle]').forEach(e=>e.textContent=config.handle||'@sua.marca');
document.querySelector('.orbit-text textPath').textContent=config.orbitText||('✦ '+(config.name||'SUA MARCA')+' ✦ LINKS OFICIAIS ').repeat(3);
document.querySelectorAll('[data-avatar]').forEach(e=>{if(config.avatar)e.src=config.avatar;e.alt=e.closest('.profile')?(config.name||'Foto de perfil'):''});
if(config.background)root.style.setProperty('--photo','url('+JSON.stringify(config.background)+')');
document.querySelector('[data-section-title]').textContent=config.sectionTitle||'Meus links';
document.querySelector('[data-footer]').textContent=config.footer||'Modelo demonstrativo';
const ageAllowed=()=>root.classList.contains('age-ok');
const setAccess=allowed=>{root.classList.toggle('age-ok',allowed);shell.inert=!allowed;gate.hidden=allowed;if(allowed){document.querySelector('h1').setAttribute('tabindex','-1');document.querySelector('h1').focus({preventScroll:true})}};
setAccess(ageAllowed());
if(!ageAllowed())requestAnimationFrame(()=>gate.querySelector('[data-age=yes]').focus({preventScroll:true}));
gate.addEventListener('click',e=>{const button=e.target.closest('[data-age]');if(!button)return;
 if(button.dataset.age==='yes'){if(config.rememberAge!==false)try{localStorage.setItem(key,'1')}catch{}setAccess(true)}
 else{gate.querySelector('.gate-ask').hidden=true;const text=gate.querySelector('.gate-denied');text.hidden=false;text.setAttribute('tabindex','-1');text.focus()}
});
gate.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const focusable=[...gate.querySelectorAll('button:not([disabled])')].filter(b=>b.offsetParent!==null);if(!focusable.length){e.preventDefault();return}const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
let seed=117;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296},sparkles=document.querySelector('.sparkles');
for(let i=0;i<42;i++){const dot=document.createElement('i'),star=i%3===0;if(star)dot.className='star';dot.style.left=random()*100+'%';dot.style.top=random()*100+'%';dot.style.setProperty('--size',(star?10+random()*12:2.5+random()*3).toFixed(1)+'px');dot.style.setProperty('--duration',(2.5+random()*3).toFixed(1)+'s');dot.style.setProperty('--delay',(-random()*5).toFixed(1)+'s');sparkles.append(dot)}
const track=document.querySelector('.track'),slides=[...track.children],dots=[...document.querySelectorAll('.dots button')],carousel=document.querySelector('.carousel'),viewport=document.querySelector('.viewport'),pause=document.querySelector('.pause');
let current=0,manualPause=false,hover=false,focused=false,touching=false,onScreen=true,startX=null;
function go(index){current=(index+slides.length)%slides.length;track.style.transform='translate3d(-'+current*100+'%,0,0)';slides.forEach((s,i)=>{s.setAttribute('aria-hidden',String(i!==current));s.inert=i!==current});dots.forEach((d,i)=>{d.classList.toggle('on',i===current);d.setAttribute('aria-current',String(i===current))})}
dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
pause.addEventListener('click',()=>{manualPause=!manualPause;pause.setAttribute('aria-pressed',String(manualPause));pause.setAttribute('aria-label',manualPause?'Retomar carrossel':'Pausar carrossel');pause.innerHTML=manualPause?'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 8 5-8 5z"/></svg>':'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 4v8M10.5 4v8"/></svg>'});
viewport.addEventListener('mouseenter',()=>hover=true);viewport.addEventListener('mouseleave',()=>hover=false);
carousel.addEventListener('focusin',()=>focused=true);carousel.addEventListener('focusout',e=>{focused=carousel.contains(e.relatedTarget)});
viewport.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;touching=true},{passive:true});
viewport.addEventListener('touchend',e=>{if(startX!==null){const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>40)go(current+(delta<0?1:-1))}startX=null;touching=false},{passive:true});
viewport.addEventListener('touchcancel',()=>{startX=null;touching=false},{passive:true});
carousel.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(current+(e.key==='ArrowRight'?1:-1))}});
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting}).observe(carousel);
const interval=setInterval(()=>{if(ageAllowed()&&!reduced.matches&&!manualPause&&!hover&&!focused&&!touching&&!document.hidden&&onScreen)go(current+1)},4500);
addEventListener('pagehide',()=>clearInterval(interval),{once:true});
document.addEventListener('visibilitychange',()=>root.classList.toggle('motion-paused',document.hidden));
go(0);
const dialog=document.querySelector('.preview-dialog'),title=dialog.querySelector('h2'),body=dialog.querySelector('.dialog-body'),close=dialog.querySelector('.dialog-close');
const messages={
 portfolio:{title:'Meu trabalho',text:'Uma Bio para apresentar quem você é e reunir os seus principais links.',banner:'assets/banner-2.svg'},
 novidades:{title:'Fique por dentro',text:'Conteúdos, lançamentos e novidades em um só lugar.',banner:'assets/banner-1.svg'},
 contato:{title:'Vamos conversar',text:'Este botão está em demonstração. Na Bio de cada cliente, o acesso leva ao contato escolhido.'},
 instagram:{title:'Meu Instagram',text:'Este acesso está em demonstração. O modelo permite conectar o perfil de cada cliente.'}
};
function openPreview(id){const m=messages[id]||messages.portfolio;title.textContent=m.title;body.replaceChildren();const p=document.createElement('p');p.textContent=m.text;body.append(p);if(m.banner){const img=document.createElement('img');img.src=m.banner;img.alt='';body.append(img)}const button=document.createElement('button');button.type='button';button.className='dialog-action';button.textContent='Voltar para a Bio';button.addEventListener('click',()=>dialog.close());body.append(button);dialog.showModal()}
for(const entry of config.links||[]){const link=document.querySelector('[data-link="'+entry.id+'"]');if(!link)continue;link.querySelector('small').textContent=entry.eyebrow;link.querySelector('strong').textContent=entry.title;if(entry.image)link.querySelector('img').src=entry.image;if(validUrl(entry.url)){link.href=entry.url;link.target='_blank';link.rel='noopener noreferrer'}else link.addEventListener('click',e=>{e.preventDefault();openPreview(entry.id)})}
const instagram=document.querySelector('[data-instagram]');if(validUrl(config.instagramUrl)){instagram.href=config.instagramUrl;instagram.target='_blank';instagram.rel='noopener noreferrer'}else instagram.addEventListener('click',e=>{e.preventDefault();openPreview('instagram')});
close.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close()});
})();
