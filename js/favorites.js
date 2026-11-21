const Favs={k:"sl_favs",
  get(){try{return JSON.parse(localStorage.getItem(this.k))||[]}catch(e){return[]}},
  set(a){try{localStorage.setItem(this.k,JSON.stringify(a))}catch(e){}this.badge()},
  has(id){return this.get().includes(id)},
  toggle(id){const a=this.get(),i=a.indexOf(id);i>-1?a.splice(i,1):a.push(id);this.set(a);return i<0},
  badge(){const e=document.getElementById("favCount");if(e){const n=this.get().length;e.textContent=n;e.hidden=!n}}
};
