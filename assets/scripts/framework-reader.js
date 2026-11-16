(() => {
  const toc=document.getElementById('reader-toc'), title=document.getElementById('reader-title');
  const meta=document.getElementById('reader-meta'), partLabel=document.getElementById('reader-part');
  const body=document.getElementById('reader-body');
  if(!toc||!title||!meta||!partLabel||!body)return;
  const groups=new Map();
  const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const citations=t=>escapeHtml(t).replace(/\[(\d+(?:,\s*\d+)*)\]/g,(m,ns)=>'['+ns.split(/,\s*/).map(n=>'<a class="citation" href="references.html#ref-'+n+'" aria-label="Reference '+n+'">'+n+'</a>').join(', ')+']');
  async function getJson(path){
    const response=await fetch(new URL(path,document.baseURI).href,{cache:'no-store',headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error('Could not load '+path+' ('+response.status+')');
    return response.json();
  }
  function showError(message){
    let box=document.getElementById('reader-status');
    if(!box){box=document.createElement('p');box.id='reader-status';box.className='reader-status';box.setAttribute('role','status');body.appendChild(box);}
    box.textContent=message;
  }
  let index;
  async function loadArticle(id,scroll=false){
    const entry=index?.entries?.[id];
    if(!entry){showError('This reading could not be found. Please choose another section.');return;}
    try{
      const data=await getJson(entry.source),article={...entry,...data};
      document.title=article.title+' | The Framework | Beautiful Souls';
      const partTitles={'Part I':'The Creator: Ultimate Ground, Origin, and Cause','Part II':'Humanity: Heaven’s Breath in Earthly Clay'};
      partLabel.textContent=article.part+' — '+(partTitles[article.part]||article.part);
      meta.textContent=article.part.toUpperCase();
      title.textContent=article.title;
      body.replaceChildren();
      (article.paragraphs||[]).forEach(text=>{const p=document.createElement('p');p.innerHTML=citations(text);body.appendChild(p);});
      toc.querySelectorAll('a[data-article-id]').forEach(a=>{
        const active=a.dataset.articleId===id;a.classList.toggle('current',active);
        if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
      });
      const group=groups.get(article.part);
      if(group){group.button.setAttribute('aria-expanded','true');group.list.hidden=false;}
      document.getElementById('reader-status')?.remove();
      if(scroll&&matchMedia('(max-width: 850px)').matches)document.querySelector('.reader-article').scrollIntoView({behavior:'smooth',block:'start'});
    }catch(error){console.error('Framework essay load failed:',error);showError('The selected essay could not be loaded. The previous reading is still shown; please try again.');}
  }
  function buildContents(){
    const byPart=new Map();
    index.order.forEach(id=>{const e=index.entries[id];if(!e)return;if(!byPart.has(e.part))byPart.set(e.part,[]);byPart.get(e.part).push(id);});
    [...byPart.entries()].forEach(([part,ids],groupIndex)=>{
      const group=document.createElement('section');group.className='toc-part-group';
      const button=document.createElement('button');button.type='button';button.className='toc-part-toggle';
      button.setAttribute('aria-expanded','true');button.setAttribute('aria-controls','toc-items-'+groupIndex);
      const arrow=document.createElement('span');arrow.className='toc-chevron';arrow.setAttribute('aria-hidden','true');arrow.textContent='⌄';
      const name=document.createElement('span');name.className='toc-part-name';
      name.textContent=part==='Part I'?'Part I — The Creator: Ultimate Ground, Origin, and Cause':'Part II — Humanity: Heaven’s Breath in Earthly Clay';
      button.append(arrow,name);
      const list=document.createElement('div');list.className='toc-part-items';list.id='toc-items-'+groupIndex;list.hidden=false;
      ids.forEach(id=>{
        const e=index.entries[id],a=document.createElement('a');a.href='framework.html?article='+encodeURIComponent(id);
        a.dataset.articleId=id;a.textContent=e.title;
        if(e.label==='Part opening')a.classList.add('toc-opening');
        a.addEventListener('click',event=>{event.preventDefault();const url=new URL(location.href);url.searchParams.set('article',id);history.pushState({article:id},'',url);loadArticle(id,true);});
        list.appendChild(a);
      });
      button.addEventListener('click',()=>{const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));list.hidden=expanded;});
      group.append(button,list);toc.appendChild(group);groups.set(part,{button,list});
    });
  }
  async function initialize(){
    try{
      index=await getJson('content/framework-index.json');
      if(!Array.isArray(index.order)||!index.entries)throw new Error('Unexpected essay index structure');
      buildContents();
      addEventListener('popstate',event=>loadArticle(event.state?.article||new URLSearchParams(location.search).get('article')||'part1'));
      const requested=new URLSearchParams(location.search).get('article')||'part1';
      await loadArticle(index.entries[requested]?requested:'part1');
    }catch(error){console.error('Framework contents load failed:',error);showError('The contents could not be loaded. The opening essay is shown above. Please refresh the page or try again later.');}
  }
  initialize();
})();