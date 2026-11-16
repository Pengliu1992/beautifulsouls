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
      partLabel.textContent=article.part;meta.textContent=article.label==='Part opening'?article.part.toUpperCase()+' · OVERVIEW':article.part.toUpperCase()+' · SECTION '+article.label;title.textContent=article.title;
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
  function appendNumberedLabel(link,number,label){
    const numberSpan=document.createElement('span');
    numberSpan.className='toc-number';
    numberSpan.textContent=number;
    const titleSpan=document.createElement('span');
    titleSpan.className='toc-link-title';
    titleSpan.textContent=label;
    link.append(numberSpan,document.createTextNode(' '),titleSpan);
  }

  function buildContents(){
    const byPart=new Map();
    index.order.forEach(id=>{
      const entry=index.entries[id];
      if(!entry)return;
      if(!byPart.has(entry.part))byPart.set(entry.part,[]);
      byPart.get(entry.part).push(id);
    });
    [...byPart.entries()].forEach(([part,ids],groupIndex)=>{
      const openingId=ids.find(id=>index.entries[id].label==='Part opening');
      const opening=openingId?index.entries[openingId]:null;
      const partNumber=String(groupIndex+1);
      const group=document.createElement('section');
      group.className='toc-part-group';

      const heading=document.createElement('div');
      heading.className='toc-part-heading';
      if(opening){
        const overview=document.createElement('a');
        overview.className='toc-part-overview';
        overview.href='framework.html?article='+encodeURIComponent(openingId);
        overview.dataset.articleId=openingId;
        appendNumberedLabel(overview,partNumber,opening.title);
        overview.addEventListener('click',event=>{
          event.preventDefault();
          const url=new URL(location.href);
          url.searchParams.set('article',openingId);
          history.pushState({article:openingId},'',url);
          loadArticle(openingId,true);
        });
        heading.appendChild(overview);
      }

      const button=document.createElement('button');
      button.type='button';
      button.className='toc-part-toggle';
      button.setAttribute('aria-expanded',groupIndex===0?'true':'false');
      button.setAttribute('aria-controls','toc-items-'+groupIndex);
      button.setAttribute('aria-label',(groupIndex===0?'Collapse ':'Expand ')+(opening?.title||part));
      const arrow=document.createElement('span');
      arrow.className='toc-chevron';
      arrow.setAttribute('aria-hidden','true');
      arrow.textContent='⌄';
      button.appendChild(arrow);

      const list=document.createElement('div');
      list.className='toc-part-items';
      list.id='toc-items-'+groupIndex;
      list.hidden=groupIndex!==0;
      ids.filter(id=>id!==openingId && index.entries[id].label!=='Part opening').forEach(id=>{
        const entry=index.entries[id];
        const link=document.createElement('a');
        link.href='framework.html?article='+encodeURIComponent(id);
        link.dataset.articleId=id;
        appendNumberedLabel(link,entry.label,entry.title);
        link.addEventListener('click',event=>{
          event.preventDefault();
          const url=new URL(location.href);
          url.searchParams.set('article',id);
          history.pushState({article:id},'',url);
          loadArticle(id,true);
        });
        list.appendChild(link);
      });
      button.addEventListener('click',()=>{
        const expanded=button.getAttribute('aria-expanded')==='true';
        button.setAttribute('aria-expanded',String(!expanded));
        button.setAttribute('aria-label',(expanded?'Expand ':'Collapse ')+(opening?.title||part));
        list.hidden=expanded;
      });
      heading.appendChild(button);
      group.append(heading,list);
      toc.appendChild(group);
      groups.set(part,{button,list});
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