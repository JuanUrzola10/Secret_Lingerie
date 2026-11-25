/* ============ DATOS: categorías, colecciones y productos ============
   Para agregar un producto: copia una línea D(...) y cambia sus datos.
   Para cambiar fotos: reemplaza los archivos en assets/images/products/
   (o cambia las rutas / usa enlaces https propios). Ver README.md */
const CATEGORIAS = [
  {id:"lenceria",nombre:"Lencerías",desc:"Sets y piezas elegantes y cómodas.",img:"assets/images/categories/lenceria6.jpeg"},
  {id:"panties",nombre:"Panties",desc:"Suaves, ligeros y delicados.",img:"assets/images/categories/lenceria8.jpeg"}
];
const COLECCIONES = [
  {id:"burgundy",nombre:"Noche Burgundy",desc:"Vino profundo y encaje.",img:"assets/images/banners/col-1.svg"},
  {id:"rose",nombre:"Rosé Floral",desc:"Tonos empolvados y delicados.",img:"assets/images/banners/col-2.svg"},
  {id:"esencial",nombre:"Esencial Champagne",desc:"Básicos elegantes para cada día.",img:"assets/images/banners/col-3.svg"}
];
const VINO=["Vino","#702D43"],NEGRO=["Negro","#33252A"],ROSA=["Rosa","#E9C8CD"],MARFIL=["Marfil","#F9F3EF"],CHAMP=["Champagne","#C6A477"],BLANCO = ["Blanco", "#f8f7f5"];;
const CUIDADO="Lavar a mano con agua fría y jabón suave. No usar blanqueador. No retorcer. Secar a la sombra.";
const D=(id,nombre,categoria,precio,anterior,o)=>{const n=String(id).padStart(3,"0");return {
  id,nombre,referencia:"SL-"+n,categoria,descripcion:o.d,precio,precioAnterior:anterior||null,
  imagenes:o.i||[`assets/images/products/sl-${n}-1.svg`,`assets/images/products/sl-${n}-2.svg`],
  tallas:o.t||["S","M","L"],tallasAgotadas:o.ta||[],colores:o.c,coloresAgotados:o.ca||[],
  materiales:o.m,destacado:!!o.f,nuevo:!!o.n,promocion:!!anterior,
  disponibilidad:o.av||"disponible",coleccion:o.col||"",cuidado:CUIDADO,demo:!!o.demo};};

const PRODUCTOS = [
  // Nuevos lanzamientos (n:1): 1 y 8 juntas, 9 separado
  D(1,"Panty","panties",45000,0,{i:["assets/images/products/lenceria1.jpeg","assets/images/products/lenceria9.jpeg"],d:"Suave y cómodo.",t:["M"],c:[NEGRO],m:"Encaje y poliéster",f:0,n:1}),
  D(2,"Panty","panties",40000,0,{i:["assets/images/products/lenceria8.jpeg"],d:"Suave y cómodo.",t:["M"],c:[NEGRO],m:"Encaje y poliéster",f:0,n:1}),

  // Productos destacados (f:1)
  D(3,"Set de Lencería","lenceria",25000,0,{i:["assets/images/products/lenceria2.jpeg"],d:"Perfecta para dormir.",t:["S"],c:[NEGRO, BLANCO],m:"Encaje y poliéster",f:1,n:0}),
  D(4,"Set de Lencería","lenceria",35000,0,{i:["assets/images/products/lenceria3.jpeg"],d:"Perfecta para dormir.",t:["S"],c:[NEGRO],m:"Encaje y poliéster",f:1,n:0}),
  D(5,"Set de Lencería","lenceria",30000,0,{i:["assets/images/products/lenceria4.jpeg"],d:"Perfecta para dormir.",t:["Talla Unica"],c:[NEGRO],m:"Encaje y poliéster",f:1,n:0}),
  D(6,"Panty","panties",28000,0,{i:["assets/images/products/lenceria5.jpeg"],d:"Suave y cómodo.",t:["S"],c:[],m:"Encaje y poliéster",f:1,n:0}),

  // Resto del catálogo
  D(7,"Set de Lencería","lenceria",33000,0,{i:["assets/images/products/lenceria6.jpeg"],d:"Perfecta para dormir.",t:["S","M"],c:[NEGRO],f:0,n:0}),
  D(8,"Set de Lencería","lenceria",36000,0,{i:["assets/images/products/lenceria7.jpeg"],d:"Perfecta para dormir.",t:["S"],c:[NEGRO],m:"Encaje y poliéster",f:0,n:0}),
  D(9,"Panty","panties",20000,0,{i:["assets/images/products/lenceria10.jpeg"],d:"Suave y cómodo.",t:["M"],c:[],m:"Encaje y poliéster",f:0,n:0}),
  D(10,"Set de Lencería","lenceria",28000,0,{i:["assets/images/products/lenceria11.jpeg"],d:"Perfecta para dormir.",t:["Talla Unica"],c:[NEGRO],m:"Encaje y poliéster",f:0,n:0}),
  D(11,"Set de Lencería","lenceria",28000,0,{i:["assets/images/products/lenceria12.jpeg"],d:"Perfecta para dormir.",t:["M"],c:[NEGRO],m:"Encaje y poliéster",f:0,n:0}),
  D(12,"Set de Lencería","lenceria",33000,0,{i:["assets/images/products/lenceria13.jpeg","assets/images/products/lenceria14.jpeg"],d:"Perfecta para dormir.",t:["S"],c:[NEGRO],m:"Encaje y poliéster",f:0,n:0}),
];