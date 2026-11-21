const WA={
  ok(){return /^57\d{10}$/.test(SL_CONFIG.whatsapp)},
  open(text){
    const base=this.ok()?`https://wa.me/${SL_CONFIG.whatsapp}`:"https://wa.me/";
    if(!this.ok()&&window.toast)toast("Falta configurar el número en js/config.js. Elige un contacto para probar.");
    window.open(`${base}?text=${encodeURIComponent(text)}`,"_blank","noopener");
  },
  product(p,size,color){
    let t=`Hola, estoy interesada en SECRET LINGERIE. Quisiera consultar por el producto ${p.nombre}, referencia ${p.referencia}`;
    if(size)t+=`, talla ${size}`; if(color)t+=`, color ${color.toLowerCase()}`;
    return t+`. Precio: ${fmt(p.precio)}. ¿Está disponible?`;
  },
  bag(items){
    let t="Hola, estoy interesada en SECRET LINGERIE. Quisiera consultar por estos productos:\n\n";
    items.forEach((it,i)=>{const p=PRODUCTOS.find(x=>x.id===it.id);if(!p)return;
      t+=`${i+1}. ${p.nombre} (ref. ${p.referencia}) - talla ${it.size}, color ${it.color.toLowerCase()} - ${it.qty} x ${fmt(p.precio)}\n`;});
    return t+`\nSubtotal referencial: ${fmt(Bag.subtotal())}\n¿Están disponibles?`;
  }
};
