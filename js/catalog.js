(function(){
  const S={q:"",cat:"",col:"",size:"",color:"",price:"",flag:"",avail:false,sort:"",shown:8};
  const STEP=8,u=new URLSearchParams(location.search);
  ["q","cat","col"].forEach(k=>S[k]=u.get(k)||"");S.flag=u.get("flag")||"";
  const f=id=>document.getElementById(id);
  const opt=(a,t)=>`<option value="">${t}</option>`+a.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join("");
  f("cat").innerHTML=opt(CATEGORIAS.map(c=>[c.id,c.nombre]),"Todas las categorías");
  const sizes=[...new Set(PRODUCTOS.flatMap(p=>p.tallas))],colors=[...new Set(PRODUCTOS.flatMap(p=>p.colores.map(c=>c[0])))];
  f("size").innerHTML=opt(sizes.map(s=>[s,s]),"Todas las tallas");
  f("color").innerHTML=opt(colors.map(c=>[c,c]),"Todos los colores");
  f("q").value=S.q;f("cat").value=S.cat;f("flag").value=S.flag;
  const read=()=>{S.q=f("q").value.trim();S.cat=f("cat").value;S.size=f("size").value;S.color=f("color").value;S.price=f("price").value;S.flag=f("flag").value;S.avail=f("avail").checked;S.sort=f("sort").value;S.shown=STEP;draw()};
  ["q","cat","size","color","price","flag","avail","sort"].forEach(id=>f(id).addEventListener(id==="q"?"input":"change",read));
  f("clear").onclick=()=>{["q","cat","size","color","price","flag","sort"].forEach(id=>f(id).value="");f("avail").checked=false;S.col="";history.replaceState(null,"",location.pathname);read()};
  f("more").onclick=()=>{S.shown+=STEP;draw()};
  f("ftoggle").onclick=()=>{const o=f("filters").classList.toggle("open");f("ftoggle").setAttribute("aria-expanded",o)};
  function draw(){
    const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    const [lo,hi]=S.price?S.price.split("-").map(Number):[0,Infinity];
    let l=PRODUCTOS.filter(p=>
      (!S.q||norm(p.nombre+" "+p.referencia).includes(norm(S.q)))&&(!S.cat||p.categoria===S.cat)&&(!S.col||p.coleccion===S.col)&&
      (!S.size||p.tallas.includes(S.size))&&(!S.color||p.colores.some(c=>c[0]===S.color))&&p.precio>=lo&&p.precio<=hi&&
      (!S.flag||p[S.flag])&&(!S.avail||p.disponibilidad!=="agotado"));
    if(S.sort==="min")l.sort((a,b)=>a.precio-b.precio);
    if(S.sort==="max")l.sort((a,b)=>b.precio-a.precio);
    if(S.sort==="new")l.sort((a,b)=>(b.nuevo-a.nuevo)||(b.id-a.id));
    const col=COLECCIONES.find(c=>c.id===S.col);
    f("count").textContent=`${l.length} producto${l.length===1?"":"s"}${S.cat?" en "+catName(S.cat):""}${col?" · Colección "+col.nombre:""}`;
    grid("#grid",l.slice(0,S.shown));
    f("empty").hidden=l.length>0;f("more").hidden=l.length<=S.shown;
  }
  draw();
})();
