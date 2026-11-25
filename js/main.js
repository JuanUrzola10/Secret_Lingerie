const R=document.body.dataset.root||"",PAGE=document.body.dataset.page||"";
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const fmt=n=>"$ "+Number(n).toLocaleString("es-CO");
const src=s=>/^https:/.test(s)?s:R+s;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ic=(d,f)=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"${f?` style="fill:currentColor"`:""}>${d}</svg>`;
const IC={search:ic('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),heart:ic('<path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z"/>'),bag:ic('<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>'),menu:ic('<path d="M4 7h16M4 12h16M4 17h16"/>'),x:ic('<path d="M6 6l12 12M18 6L6 18"/>'),wa:ic('<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/>')};
const find=id=>PRODUCTOS.find(p=>p.id===id);
const catName=id=>(CATEGORIAS.find(c=>c.id===id)||{}).nombre||id;
const soldOut=p=>p.disponibilidad==="agotado";

function toast(m){let t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),3200)}
function link(url,txt,cls=""){return url?`<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${txt}</a>`:`<span class="${cls} off" title="Configúralo en js/config.js">${txt} (pendiente)</span>`}

/* ---------- Estructura común ---------- */
function layout(){
  const L=(p,t)=>`<a href="${R}${p}" ${(PAGE===t||(PAGE==="home"&&t==="inicio"))?'aria-current="page"':""}>${{inicio:"Inicio",catalogo:"Catálogo",promociones:"Promociones",nosotros:"Nosotros",contacto:"Contacto"}[t]}</a>`;
  const nav=`${L("index.html","inicio")}${L("pages/catalogo.html","catalogo")}${L("index.html#promociones","promociones")}${L("pages/nosotros.html","nosotros")}${L("pages/contacto.html","contacto")}`;
  document.body.insertAdjacentHTML("afterbegin",`<header class="site-header"><div class="bar">
   <button class="icon-btn burger" id="burger" aria-label="Abrir menú" aria-expanded="false">${IC.menu}</button>
   <a class="logo" href="${R}index.html">SECRET LINGERIE</a>
   <nav class="nav" id="nav" aria-label="Principal">${nav}</nav>
   <div class="tools"><button class="icon-btn" id="btnSearch" aria-label="Buscar">${IC.search}</button>
   <button class="icon-btn" id="btnFav" aria-label="Favoritos">${IC.heart}<b class="count" id="favCount" hidden>0</b></button>
   <button class="icon-btn" id="btnBag" aria-label="Lista de consultas">${IC.bag}<b class="count" id="bagCount" hidden>0</b></button></div></div></header>
   <div class="search-pop" id="searchPop" hidden><form id="searchForm"><input id="searchInput" type="search" placeholder="Buscar por nombre o referencia" aria-label="Buscar"><button class="btn">Buscar</button></form></div>`);
  document.body.insertAdjacentHTML("beforeend",`<footer class="site-footer"><div class="wrap foot"><div><div class="logo">SECRET LINGERIE</div><p>La belleza está en los detalles.</p></div>
   <div><h4>Contacto</h4><a href="#" id="fWa">WhatsApp</a>${link(SL_CONFIG.instagram,"Instagram")}${link(SL_CONFIG.facebook,"Facebook")}</div>
   <div><h4>Información</h4><a href="${R}pages/nosotros.html">Nosotros</a><a href="${R}pages/catalogo.html">Catálogo</a></div></div>
   <p class="copy">© ${new Date().getFullYear()} SECRET LINGERIE</p></footer>
   <a class="wa-float" href="#" id="waFloat" aria-label="Escribir por WhatsApp">${IC.wa}</a>
   <div class="overlay" id="ov"></div>
   <aside class="drawer" id="drawer" aria-label="Panel"><div class="drawer-head"><h3 id="dTitle"></h3><button class="icon-btn" id="dClose" aria-label="Cerrar">${IC.x}</button></div><div class="drawer-body" id="dBody"></div><div class="drawer-foot" id="dFoot"></div></aside>
   <div class="modal" id="modal" role="dialog" aria-modal="true" aria-label="Detalle del producto" hidden><div class="modal-box" id="mBox"></div></div>
   <div class="lightbox" id="lb" hidden><button class="icon-btn" aria-label="Cerrar" id="lbClose">${IC.x}</button><img alt=""></div><div class="toast" id="toast" role="status"></div>`);
  const hello=e=>{e.preventDefault();WA.open("Hola, estoy interesada en SECRET LINGERIE. Quisiera recibir información.")};
  $("#fWa").onclick=hello;$("#waFloat").onclick=hello;
  $("#burger").onclick=()=>{const o=$("#nav").classList.toggle("open");$("#burger").setAttribute("aria-expanded",o)};
  $("#nav").onclick=e=>{if(e.target.tagName==="A")$("#nav").classList.remove("open")};
  $("#btnSearch").onclick=()=>{const s=$("#searchPop");s.hidden=!s.hidden;if(!s.hidden)$("#searchInput").focus()};
  $("#searchForm").onsubmit=e=>{e.preventDefault();location.href=`${R}pages/catalogo.html?q=${encodeURIComponent($("#searchInput").value.trim())}`};
  $("#btnFav").onclick=()=>openDrawer("fav");$("#btnBag").onclick=()=>openDrawer("bag");
  $("#dClose").onclick=closeAll;$("#ov").onclick=closeAll;$("#lbClose").onclick=()=>$("#lb").hidden=true;
  $("#lb").onclick=e=>{if(e.target.id==="lb")$("#lb").hidden=true};
  $("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
  document.onkeydown=e=>{if(e.key==="Escape"){$("#lb").hidden=true;closeAll()}};
  Favs.badge();Bag.badge();
}

/* ---------- Tarjetas ---------- */
function card(p){
  const tags=(p.nuevo?'<span class="tag">NUEVO</span>':"")+(p.destacado?'<span class="tag">DESTACADO</span>':"")+(p.promocion?'<span class="tag sale">OFERTA</span>':"");
  const av={disponible:"Disponible","pocas unidades":"Pocas unidades",agotado:"Agotado"}[p.disponibilidad];
  return `<article class="card" data-id="${p.id}"><div class="card-img"><img src="${src(p.imagenes[0])}" alt="${esc(p.nombre)}" loading="lazy" width="400" height="500"><div class="tags">${tags}</div>
  <button class="fav ${Favs.has(p.id)?"on":""}" data-fav="${p.id}" aria-label="Favorito">${IC.heart}</button>${SL_CONFIG.mostrarDemo&&p.demo?'<span class="demo">DEMO</span>':""}</div>
  <div class="card-body"><h3>${esc(p.nombre)}</h3><small>Ref. ${p.referencia}</small>
  <div class="price"><b>${fmt(p.precio)}</b>${p.precioAnterior?`<s>${fmt(p.precioAnterior)}</s>`:""}</div><span class="avail ${p.disponibilidad.split(" ")[0]}">${av}</span>
  <div class="card-actions"><button class="btn ghost sm" data-quick="${p.id}">Vista rápida</button><button class="btn sm" data-ask="${p.id}">Consultar</button></div></div></article>`;
}
const grid=(sel,list)=>{const e=$(sel);if(e){e.innerHTML=list.map(card).join("");ajustarImagenes(e)}};

/* ---------- Ajuste automático de proporción y encuadre ---------- */
function ajustarImagenes(scope = document) {
  $$("img", scope).forEach((img) => {
    if (img.closest(".drawer .row, .thumbs")) return;

    if (img.closest(".cat, .col, .hero, .hero-media, .banner") || img.id === "heroImg") {
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
      return;
    }

    const aplicar = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;

      const parent = img.closest(".card-img");

      if (parent) {
        parent.style.aspectRatio = "4 / 5";
        parent.style.height = "auto";
        parent.style.minHeight = "0";
        parent.style.overflow = "hidden";
        parent.style.display = "flex";
        parent.style.alignItems = "center";
        parent.style.justifyContent = "center";
        parent.style.backgroundColor = "#f7f4f1";
      }

      img.style.width = "100%";
      img.style.height = "100%";
      img.style.maxHeight = img.id === "mMain" ? "75vh" : "100%";
      img.style.aspectRatio = "auto";
      img.style.objectFit = "contain";
      img.style.objectPosition = "center";
      img.style.backgroundColor = "transparent";
    };

    if (img.complete && img.naturalWidth) {
      aplicar();
    } else {
      img.addEventListener("load", aplicar, { once: true });
    }
  });
}

document.addEventListener("click",e=>{
  const b=e.target.closest("[data-fav],[data-quick],[data-ask],[data-view],[data-rmfav],[data-qty],[data-rm]");if(!b)return;
  const d=b.dataset;
  if(d.fav){const on=Favs.toggle(+d.fav);$$(`[data-fav="${d.fav}"]`).forEach(x=>x.classList.toggle("on",on));toast(on?"Agregado a favoritos":"Quitado de favoritos")}
  if(d.quick||d.view){closeAll();openProduct(+(d.quick||d.view))}
  if(d.ask){const p=find(+d.ask);WA.open(WA.product(p))}
  if(d.rmfav){Favs.toggle(+d.rmfav);$$(`[data-fav="${d.rmfav}"]`).forEach(x=>x.classList.remove("on"));renderDrawer()}
  if(d.qty){const[k,n]=d.qty.split("::");Bag.change(k,+n);renderDrawer()}
  if(d.rm){Bag.remove(d.rm);renderDrawer()}
});

/* ---------- Panel lateral: favoritos y bolsa ---------- */
let mode="";
function openDrawer(m){mode=m;renderDrawer();$("#drawer").classList.add("open");$("#ov").classList.add("show")}
function closeAll(){$("#drawer").classList.remove("open");$("#ov").classList.remove("show");closeModal()}
function renderDrawer(){
  const body=$("#dBody"),foot=$("#dFoot");
  if(mode==="fav"){
    $("#dTitle").textContent="Mis favoritos";const l=Favs.get().map(find).filter(Boolean);
    body.innerHTML=l.length?l.map(p=>`<div class="row"><img src="${src(p.imagenes[0])}" alt=""><div><b>${esc(p.nombre)}</b><small>${fmt(p.precio)}</small><div class="row-actions"><button class="link" data-view="${p.id}">Ver</button><button class="link" data-rmfav="${p.id}">Quitar</button></div></div></div>`).join(""):'<p class="empty">Aún no tienes favoritos. Toca el corazón en cualquier producto.</p>';
    foot.innerHTML="";
  }else{
    $("#dTitle").textContent="Lista de consultas";const items=Bag.get();
    body.innerHTML=items.length?items.map(i=>{const p=find(i.id);if(!p)return"";const k=Bag.key(i);return `<div class="row"><img src="${src(p.imagenes[0])}" alt=""><div><b>${esc(p.nombre)}</b><small>Talla ${esc(i.size)} · ${esc(i.color)}</small><small>${fmt(p.precio)}</small>
    <div class="row-actions"><span class="qty"><button data-qty="${esc(k)}::-1" aria-label="Menos">−</button>${i.qty}<button data-qty="${esc(k)}::1" aria-label="Más">+</button></span><button class="link" data-rm="${esc(k)}">Eliminar</button></div></div></div>`}).join(""):'<p class="empty">Tu lista está vacía. Elige talla y color en un producto y agrégalo.</p>';
    foot.innerHTML=items.length?`<div class="sub"><span>Subtotal referencial</span><b>${fmt(Bag.subtotal())}</b></div><small>Valor de referencia. El pedido se confirma por WhatsApp.</small><button class="btn block" id="sendBag">Enviar consulta por WhatsApp</button><button class="link" id="clearBag">Vaciar lista</button>`:"";
    const s=$("#sendBag");if(s){s.onclick=()=>WA.open(WA.bag(Bag.get()));$("#clearBag").onclick=()=>{Bag.clear();renderDrawer()}}
  }
}

/* ---------- Ficha de producto ---------- */
let M=null;
function openProduct(id){
  const p=find(id);if(!p)return;
  const sz=p.tallas.filter(t=>!p.tallasAgotadas.includes(t)&&!soldOut(p)),co=p.colores.filter(c=>!p.coloresAgotados.includes(c[0])&&!soldOut(p));
  M={p,i:0,size:sz.length===1?sz[0]:"",color:co.length===1?co[0][0]:""};
  renderModal();$("#modal").hidden=false;$("#ov").classList.add("show");document.body.style.overflow="hidden";
}
function closeModal(){$("#modal").hidden=true;document.body.style.overflow="";if(!$("#drawer").classList.contains("open"))$("#ov").classList.remove("show")}
function renderModal(){
  const{p}=M,so=soldOut(p);
  $("#mBox").innerHTML=`<button class="icon-btn mclose" id="mClose" aria-label="Cerrar">${IC.x}</button>
  <div class="gal"><img class="main" id="mMain" src="${src(p.imagenes[M.i])}" alt="${esc(p.nombre)}" title="Clic para ampliar"><div class="thumbs">${p.imagenes.map((x,k)=>`<button data-th="${k}" class="${k===M.i?"on":""}" aria-label="Foto ${k+1}"><img src="${src(x)}" alt=""></button>`).join("")}</div></div>
  <div class="info"><small>Ref. ${p.referencia} · ${esc(catName(p.categoria))}</small><h2>${esc(p.nombre)}</h2>
  <div class="price big"><b>${fmt(p.precio)}</b>${p.precioAnterior?`<s>${fmt(p.precioAnterior)}</s>`:""}</div>
  <p>${esc(p.descripcion)}</p>
  <h4>Talla ${M.size?`<em>${esc(M.size)}</em>`:""}</h4><div class="opts">${p.tallas.map(t=>{const off=so||p.tallasAgotadas.includes(t);return `<button class="opt ${M.size===t?"on":""}" data-size="${esc(t)}" ${off?"disabled":""}>${esc(t)}</button>`}).join("")}</div>
  <h4>Color ${M.color?`<em>${esc(M.color)}</em>`:""}</h4><div class="opts">${p.colores.map(([n,h])=>{const off=so||p.coloresAgotados.includes(n);return `<button class="opt sw ${M.color===n?"on":""}" data-color="${esc(n)}" ${off?"disabled":""} title="${esc(n)}"><i style="background:${h}"></i>${esc(n)}</button>`}).join("")}</div>
  <p class="meta"><b>Disponibilidad:</b> ${{disponible:"Disponible","pocas unidades":"Pocas unidades",agotado:"Agotado"}[p.disponibilidad]}</p>
  <div class="m-actions"><button class="btn" id="mWa" ${so?"disabled":""}>Consultar por WhatsApp</button><button class="btn ghost" id="mAdd" ${so?"disabled":""}>Agregar a la lista</button>
  <button class="btn ghost fav-btn ${Favs.has(p.id)?"on":""}" id="mFav" data-fav="${p.id}">${IC.heart} Favorito</button></div></div>`;
  $("#mClose").onclick=closeModal;
  $("#mMain").onclick=()=>{const l=$("#lb");$("img",l).src=src(p.imagenes[M.i]);l.hidden=false};
  $$("[data-th]").forEach(b=>b.onclick=()=>{M.i=+b.dataset.th;renderModal()});
  $$("[data-size]").forEach(b=>b.onclick=()=>{M.size=b.dataset.size;renderModal()});
  $$("[data-color]").forEach(b=>b.onclick=()=>{M.color=b.dataset.color;renderModal()});
  $("#mWa").onclick=()=>WA.open(WA.product(p,M.size,M.color));
  $("#mAdd").onclick=()=>{if(!M.size||!M.color)return toast("Elige talla y color primero");Bag.add(p.id,M.size,M.color);toast("Agregado a tu lista de consultas")};
  ajustarImagenes($("#mBox"));
}

/* ---------- Inicio ---------- */
function home(){
  $("#cats").innerHTML=CATEGORIAS.map(c=>`<a class="cat" href="${R}pages/catalogo.html?cat=${c.id}"><img src="${src(c.img)}" alt="${esc(c.nombre)}" loading="lazy"><div><h3>${c.nombre}</h3><p>${c.desc}</p><span class="btn ghost sm">Explorar</span></div></a>`).join("");
  grid("#g-new",PRODUCTOS.filter(p=>p.nuevo).slice(0,4));
  grid("#g-feat",PRODUCTOS.filter(p=>p.destacado).slice(0,4));
  grid("#g-sale",PRODUCTOS.filter(p=>p.promocion).slice(0,4));
  ajustarImagenes(document);
}

/* ---------- Contacto ---------- */
function contact(){
  $("#cWa").onclick=()=>WA.open("Hola, estoy interesada en SECRET LINGERIE. Quisiera recibir información.");
  $("#cIg").innerHTML=link(SL_CONFIG.instagram,"Instagram","btn ghost");$("#cFb").innerHTML=link(SL_CONFIG.facebook,"Facebook","btn ghost");
  $("#cInfo").textContent=SL_CONFIG.atencion||"Escríbenos por WhatsApp y te ayudamos.";
  if(SL_CONFIG.horarios)$("#cHours").textContent="Horario: "+SL_CONFIG.horarios;
}

layout();
if(PAGE==="home")home();
if(PAGE==="contacto")contact();
ajustarImagenes(document);