
(() => {
 const el=document.querySelector('#demo-config'),dialog=document.querySelector('#demo-dialog');if(!el||!dialog)return;
 const c=JSON.parse(el.textContent),barber=c.kind==='barber';let selected='';
 const by=id=>document.querySelector('#'+id);
 function update(){
   const item=c.items.find(x=>x.id===selected),day=by('demo-day')?.value,period=by('demo-period')?.value,size=by('demo-size')?.value;
   const ready=!!item&&(barber?!!day&&!!period:!!size);
   let lines=item?(barber?'Serviço: ':'Peça: ')+item.name:'';
   if(barber){if(day)lines+='\nDia preferido: '+day;if(period)lines+='\nPeríodo: '+period}else if(size)lines+='\nTamanho: '+size;
   by('demo-summary-title').textContent=ready?(barber?'Sua solicitação está pronta.':'Sua consulta está pronta.'):'Complete sua escolha.';
   by('demo-summary-text').textContent=lines;
   const message=(barber?'Olá! Gostaria de consultar um horário:\n\n':'Olá! Gostaria de consultar esta peça:\n\n')+lines+(barber?'\n\nPodem confirmar a disponibilidade e os valores?':'\n\nPodem confirmar a disponibilidade e os valores?');
   by('demo-share').href=ready?'https://wa.me/?text='+encodeURIComponent(message):'#';by('demo-share').setAttribute('aria-disabled',String(!ready));
 }
 function open(mode){
   const about=mode==='about',gallery=mode==='gallery';by('demo-about').hidden=!about;by('demo-gallery').hidden=!gallery;by('demo-catalog').hidden=about||gallery;
   by('demo-title').textContent=about?c.name:gallery?(barber?'Inspirações de estilo':'Inspirações da coleção'):barber?(mode==='request'?'Solicite seu horário':'Escolha seu cuidado'):(mode==='request'?'Peça e tamanho':'Conheça a coleção');
   if(!dialog.open)dialog.showModal();dialog.scrollTop=0;update();
 }
 document.querySelectorAll('[data-demo-open]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.demoOpen)));
 dialog.querySelector('.demo-close').addEventListener('click',()=>dialog.close());
 document.querySelectorAll('input[name="demo-item"]').forEach(i=>i.addEventListener('change',()=>{selected=i.value;update()}));
 document.querySelectorAll('.demo-fields select').forEach(s=>s.addEventListener('change',update));
 by('demo-share').addEventListener('click',e=>{if(e.currentTarget.getAttribute('aria-disabled')==='true')e.preventDefault()});
 dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close()});
 update();
})();
