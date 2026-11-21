const Bag={k:"sl_bag",
  get(){try{return JSON.parse(localStorage.getItem(this.k))||[]}catch(e){return[]}},
  set(a){try{localStorage.setItem(this.k,JSON.stringify(a))}catch(e){}this.badge()},
  key:(i)=>`${i.id}|${i.size}|${i.color}`,
  add(id,size,color){const a=this.get(),f=a.find(i=>i.id===id&&i.size===size&&i.color===color);f?f.qty++:a.push({id,size,color,qty:1});this.set(a)},
  change(key,d){const a=this.get(),f=a.find(i=>this.key(i)===key);if(f){f.qty=Math.max(1,Math.min(20,f.qty+d))}this.set(a)},
  remove(key){this.set(this.get().filter(i=>this.key(i)!==key))},
  clear(){this.set([])},
  count(){return this.get().reduce((s,i)=>s+i.qty,0)},
  subtotal(){return this.get().reduce((s,i)=>{const p=PRODUCTOS.find(x=>x.id===i.id);return s+(p?p.precio*i.qty:0)},0)},
  badge(){const e=document.getElementById("bagCount");if(e){const n=this.count();e.textContent=n;e.hidden=!n}}
};
