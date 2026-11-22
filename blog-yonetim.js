import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.0';
const db=createClient('https://byqfkrjiwefdnhnvjrbq.supabase.co','sb_publishable_NmrNx9632u62947Hol3DTw_n89-DYP_');
const $=id=>document.getElementById(id);
let posts=[],categories=[],currentId=null,mode='visual',dirty=false,allowed=false;
const editable=['title','excerpt','slug','category','author','minutes','cover'];
const safeSlug=s=>String(s||'').toLocaleLowerCase('tr-TR').replaceAll('ı','i').replaceAll('ğ','g').replaceAll('ü','u').replaceAll('ş','s').replaceAll('ö','o').replaceAll('ç','c').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,95);
const alertMsg=(msg,error=false)=>{const a=$('alert');a.textContent=msg;a.classList.toggle('error',error);};
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isSafeUrl=(v,image=false)=>{try{const u=new URL(v,location.href);return image?u.protocol==='https:':u.protocol==='https:'||u.protocol==='http:'||u.protocol==='mailto:'}catch{return false}};
function cleanHtml(raw){
 const doc=new DOMParser().parseFromString('<div id="content-root">'+String(raw||'')+'</div>','text/html');
 const root=doc.getElementById('content-root');
 const allow=new Set(['P','H2','H3','H4','STRONG','B','EM','I','U','S','UL','OL','LI','BLOCKQUOTE','BR','HR','A','IMG','PRE','CODE','FIGURE','FIGCAPTION']);
 const strip=new Set(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','FORM','INPUT','BUTTON','SVG','MATH','VIDEO','AUDIO','LINK','META','BASE','TEMPLATE']);
 function scrub(parent){
  for(const child of [...parent.childNodes]){
   if(child.nodeType===8){child.remove();continue}
   if(child.nodeType!==1)continue;
   if(strip.has(child.tagName)){child.remove();continue}
   scrub(child);
   if(!allow.has(child.tagName)){child.replaceWith(...[...child.childNodes]);continue}
   for(const attr of [...child.attributes])child.removeAttribute(attr.name);
   if(child.tagName==='A'){const href=child.getAttribute('href');if(href&&isSafeUrl(href)){child.setAttribute('href',href);child.setAttribute('rel','noopener noreferrer');}else child.removeAttribute('href')}
   if(child.tagName==='IMG'){const src=child.getAttribute('src');if(src&&isSafeUrl(src,true)){child.setAttribute('src',src);child.setAttribute('loading','lazy');child.setAttribute('alt',child.getAttribute('alt')||'Yazı görseli')}else child.remove()}
  }
 }
 // Preserve permitted link and image attributes before stripping.
 function scrubSafe(parent){
  for(const child of [...parent.childNodes]){
   if(child.nodeType===8){child.remove();continue}
   if(child.nodeType!==1)continue;
   if(strip.has(child.tagName)){child.remove();continue}
   const href=child.getAttribute('href'),src=child.getAttribute('src'),alt=child.getAttribute('alt');
   scrubSafe(child);
   if(!allow.has(child.tagName)){child.replaceWith(...[...child.childNodes]);continue}
   for(const attr of [...child.attributes])child.removeAttribute(attr.name);
   if(child.tagName==='A'&&href&&isSafeUrl(href)){child.setAttribute('href',href);child.setAttribute('rel','noopener noreferrer')}
   if(child.tagName==='IMG'){if(src&&isSafeUrl(src,true)){child.setAttribute('src',src);child.setAttribute('alt',alt||'Yazı görseli');child.setAttribute('loading','lazy')}else child.remove()}
  }
 }
 scrubSafe(root);return root.innerHTML;
}
function content(){return cleanHtml(mode==='code'?$('code').value:$('visual').innerHTML)}
function switchMode(next){if(next===mode)return;if(next==='code')$('code').value=content();else $('visual').innerHTML=cleanHtml($('code').value);mode=next;$('visual').hidden=mode!=='visual';$('code').hidden=mode!=='code';$('toolbar').hidden=mode!=='visual';$('visual-tab').classList.toggle('active',mode==='visual');$('code-tab').classList.toggle('active',mode==='code')}
function markDirty(){dirty=true;$('save-status').textContent='Kaydedilmemiş değişiklikler'}
function setStatus(published){$('editor-state').textContent=published?'Yayında':'Taslak';$('editor-state').className='status '+(published?'published':'draft')}
function updateCover(){const url=$('cover').value.trim();const el=$('cover-preview');el.replaceChildren();el.style.backgroundImage='none';if(isSafeUrl(url,true)){const img=document.createElement('img');img.src=url;img.alt='Kapak önizlemesi';img.style.cssText='width:100%;height:160px;object-fit:cover;border-radius:9px';img.onerror=()=>{el.textContent='Kapak görseli yüklenemedi'};el.append(img)}else el.textContent='Kapak önizlemesi'}
function listView(){if(dirty&&!confirm('Kaydedilmemiş değişikliklerin var. Çıkmak istiyor musun?'))return;$('editor').hidden=true;$('listing').hidden=false;dirty=false;currentId=null;alertMsg('');render()}
function editView(post=null){
 currentId=post?.id??null;dirty=false;
 $('title').value=post?.title||'';$('excerpt').value=post?.excerpt||'';$('slug').value=post?.slug||'';$('author').value=post?.author||'İyi Yol Akademi';$('minutes').value=post?.read_minutes||4;$('cover').value=post?.cover_url||'';
 $('category').value=post?.category_id||categories[0]?.id||'';$('visual').innerHTML=cleanHtml(post?.body_html||'');$('code').value=cleanHtml(post?.body_html||'');mode='code';switchMode('visual');setStatus(post?.status==='published');
 $('delete-btn').hidden=!post;$('post-link').replaceChildren();if(post?.status==='published'){const a=document.createElement('a');a.href='post.html?slug='+encodeURIComponent(post.slug);a.target='_blank';a.rel='noopener';a.textContent='Yazıyı aç ↗';$('post-link').append(a)}
 $('save-status').textContent=post?'Kaydedildi':'Yeni yazı';updateCover();$('listing').hidden=true;$('editor').hidden=false;alertMsg('');window.scrollTo(0,0);
}
function render(){
 const term=$('search').value.trim().toLocaleLowerCase('tr-TR'),filter=$('filter').value;
 const rows=posts.filter(p=>(filter==='all'||p.status===filter)&&(!term||(p.title||'').toLocaleLowerCase('tr-TR').includes(term)||(p.slug||'').includes(term)));
 $('stat-total').textContent=posts.length;$('stat-live').textContent=posts.filter(p=>p.status==='published').length;$('stat-draft').textContent=posts.filter(p=>p.status==='draft').length;
 $('empty').hidden=rows.length>0;$('rows').replaceChildren();
 for(const p of rows){const tr=document.createElement('tr');const title=document.createElement('td');const strong=document.createElement('strong');strong.textContent=p.title;const small=document.createElement('span');small.textContent=p.slug;title.append(strong,small);
 const cat=document.createElement('td');cat.textContent=categories.find(c=>c.id===p.category_id)?.name||'Genel';
 const status=document.createElement('td');const badge=document.createElement('span');badge.className='status '+p.status;badge.textContent=p.status==='published'?'Yayında':'Taslak';status.append(badge);
 const minutes=document.createElement('td');minutes.textContent=(p.read_minutes||4)+' dk';
 const action=document.createElement('td');const btn=document.createElement('button');btn.className='row-action';btn.textContent='Düzenle →';btn.onclick=()=>editView(p);action.append(btn);tr.append(title,cat,status,minutes,action);$('rows').append(tr)}
}
async function refresh(){
 const [{data:p,error:pe},{data:c,error:ce}]=await Promise.all([db.from('blog_posts').select('*').order('id',{ascending:false}).limit(500),db.from('blog_categories').select('id,name,slug').order('display_order')]);
 if(pe||ce){alertMsg('İçerikler yüklenemedi: '+(pe||ce).message,true);return}
 posts=p||[];categories=c||[];$('category').replaceChildren(...categories.map(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.name;return o}));render()
}
function payload(status){
 const title=$('title').value.trim(),slug=safeSlug($('slug').value.trim()||title),html=content();
 if(!title){alertMsg('Önce yazının başlığını yaz.',true);$('title').focus();return null}
 if(!slug||!(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).test(slug)){alertMsg('Geçerli bir yazı adresi oluştur.',true);return null}
 if(!html.replace(/<[^>]*>/g,'').trim()&&status==='published'){alertMsg('Yayımlamak için yazı içeriği ekle.',true);return null}
 const cover=$('cover').value.trim();if(cover&&!isSafeUrl(cover,true)){alertMsg('Kapak görseli için geçerli bir HTTPS adresi kullan.',true);return null}
 return {title,slug,excerpt:$('excerpt').value.trim(),author:$('author').value.trim()||'İyi Yol Akademi',category_id:Number($('category').value)||null,read_minutes:Math.min(120,Math.max(1,Number($('minutes').value)||4)),cover_url:cover||null,body_html:html,status,published_at:status==='published'?(posts.find(p=>p.id===currentId)?.published_at||new Date().toISOString()):null};
}
async function save(status){
 if(!allowed)return;const obj=payload(status);if(!obj)return;
 $('draft-btn').disabled=$('publish-btn').disabled=true;$('save-status').textContent='Kaydediliyor…';
 try{
  const query=currentId?db.from('blog_posts').update(obj).eq('id',currentId):db.from('blog_posts').insert(obj);
  const {data,error}=await query.select('id').single();if(error)throw error;
  currentId=data.id;dirty=false;await refresh();const fresh=posts.find(p=>p.id===currentId);if(fresh)editView(fresh);$('save-status').textContent=status==='published'?'Yayımlandı ✓':'Taslak kaydedildi ✓';alertMsg(status==='published'?'Yazın başarıyla yayımlandı.':'Taslak başarıyla kaydedildi.');
 }catch(e){alertMsg('Kaydedilemedi: '+(e.code==='23505'?'Bu yazı adresi zaten kullanılıyor.':e.message),true);$('save-status').textContent='Kayıt başarısız'}
 finally{$('draft-btn').disabled=$('publish-btn').disabled=false}
}
function preview(){
 const dialog=$('preview-dialog');$('preview-title').textContent=$('title').value||'Başlıksız yazı';$('preview-excerpt').textContent=$('excerpt').value;$('preview-category').textContent=categories.find(c=>String(c.id)===$('category').value)?.name||'Blog';
 $('preview-content').innerHTML=content();$('preview-cover').replaceChildren();if(isSafeUrl($('cover').value,true)){const img=document.createElement('img');img.src=$('cover').value;img.alt='Kapak';$('preview-cover').append(img)}dialog.showModal();
}
function runCmd(cmd,value){$('visual').focus();document.execCommand(cmd,false,value);markDirty()}
function addHtml(html){$('visual').focus();document.execCommand('insertHTML',false,cleanHtml(html));markDirty()}
document.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>runCmd(b.dataset.cmd));
document.querySelectorAll('[data-block]').forEach(b=>b.onclick=()=>runCmd('formatBlock',b.dataset.block));
$('link-btn').onclick=()=>{const url=prompt('Bağlantı adresi (https://…)');if(url&&isSafeUrl(url))runCmd('createLink',url);else if(url)alertMsg('Geçerli bir bağlantı adresi gir.',true)};
$('image-btn').onclick=()=>{const url=prompt('Görsel adresi (https://…)');if(url&&isSafeUrl(url,true))addHtml('<img src="'+esc(url)+'" alt="Yazı görseli">');else if(url)alertMsg('Görsel için HTTPS bağlantısı kullan.',true)};
$('quote-btn').onclick=()=>addHtml('<blockquote>Alıntını buraya yaz.</blockquote>');
$('divider-btn').onclick=()=>addHtml('<hr>');
$('visual').addEventListener('paste',e=>{e.preventDefault();const txt=e.clipboardData.getData('text/plain');document.execCommand('insertText',false,txt)});
$('visual-tab').onclick=()=>switchMode('visual');$('code-tab').onclick=()=>switchMode('code');
$('title').addEventListener('input',()=>{if(!currentId&&!$('slug').dataset.manual){$('slug').value=safeSlug($('title').value)}markDirty()});
$('slug').addEventListener('input',()=>{$('slug').dataset.manual='true';markDirty()});
$('cover').addEventListener('input',updateCover);
for(const id of [...editable,'visual','code'])$(id).addEventListener('input',markDirty);
$('new').onclick=()=>editView();$('back').onclick=listView;$('draft-btn').onclick=()=>save('draft');$('publish-btn').onclick=()=>save('published');$('preview-btn').onclick=preview;$('close-preview').onclick=()=>$('preview-dialog').close();$('search').oninput=render;$('filter').onchange=render;
$('delete-btn').onclick=async()=>{if(!currentId||!confirm('Bu yazıyı kalıcı olarak silmek istediğine emin misin?'))return;const {error}=await db.from('blog_posts').delete().eq('id',currentId);if(error){alertMsg('Silinemedi: '+error.message,true);return}dirty=false;await refresh();listView();alertMsg('Yazı silindi.')};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
async function init(){
 try{
  const {data:{user},error}=await db.auth.getUser();if(error||!user){$('lock-reason').textContent='Blog yönetimi için yönetici hesabınla giriş yapmalısın.';return}
  const {data:{session}}=await db.auth.refreshSession();const role=session?.user?.app_metadata?.role||user.app_metadata?.role;
  if(role!=='admin'){$('lock-reason').textContent='Bu alan yalnızca yetkili yönetici hesabına açıktır.';return}
  allowed=true;$('locked').hidden=true;$('app').hidden=false;$('new').disabled=false;$('auth-state').textContent='Yönetici erişimi';await refresh();
 }catch(e){$('lock-reason').textContent='Bağlantı kurulamadı. Sayfayı yenileyerek tekrar dene.';alertMsg(e.message,true)}
}
init();
