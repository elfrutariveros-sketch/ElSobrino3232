/* ===== BASE DE DATOS (tablas: productos, pedidos, fans) ===== */
const DB={
  get(t){try{return JSON.parse(localStorage.getItem('s3232_'+t))||[]}catch(e){return []}},
  add(t,r){const a=DB.get(t);r.id=a.length+1;r.fecha=new Date().toISOString();a.push(r);
    try{localStorage.setItem('s3232_'+t,JSON.stringify(a))}catch(e){}return r}
};

/* TABLA productos — foto: pon la ruta de tu imagen real (ej. "img/campera1.jpg") para reemplazar el dibujo */
const PRODUCTOS=[
 {id:1,tipo:'remera',nombre:'Remera Camo Celeste 3232',precio:16000,color:'#0b0f1f',tinta:'#a9c8ff',texto:'ESTILO 3232',sub:'EL SOBRINO',foto:'img/merch-1.jpg'},
 {id:2,tipo:'remera',nombre:'Remera Camo Violeta 3279',precio:18000,color:'#10206b',tinta:'#dbe9ff',texto:'3279',sub:'ESTILO 3279',foto:'img/merch-2.jpg'},
 {id:3,tipo:'remera',nombre:'Remera Camo Oro Internacional',precio:20000,color:'#a9c8ff',tinta:'#05070f',texto:'INTERNACIONAL',sub:'3232 EUROPA',foto:'img/merch-3.jpg'},
 {id:4,tipo:'campera',nombre:'Campera Camo Azul 3232',precio:30000,color:'#0b0f1f',tinta:'#2f6bff',texto:'ESTILO 3232',sub:'EL SOBRINO',foto:'img/merch-4.jpg'},
 {id:5,tipo:'campera',nombre:'Hoodie Camo Violeta Internacional',precio:40000,color:'#10206b',tinta:'#dbe9ff',texto:'INTERNACIONAL',sub:'3232',foto:'img/merch-5.jpg'},
 {id:6,tipo:'campera',nombre:'Campera Camo Oro 3279',precio:50000,color:'#05070f',tinta:'#a9c8ff',texto:'3279',sub:'ESTILO 3279',foto:'img/merch-6.jpg'},
 {id:7,tipo:'pantalon',nombre:'Jogger Camo Azul 3232',precio:20000,color:'#0b0f1f',tinta:'#2f6bff',texto:'3232',sub:'',foto:'img/merch-7.jpg'},
 {id:8,tipo:'pantalon',nombre:'Cargo Camo Celeste 3279',precio:30000,color:'#10206b',tinta:'#dbe9ff',texto:'3279',sub:'',foto:'img/merch-8.jpg'},
 {id:9,tipo:'pantalon',nombre:'Pantalón Camo Violeta Internacional',precio:40000,color:'#05070f',tinta:'#a9c8ff',texto:'INTER',sub:'3232',foto:'img/merch-9.jpg'}
];

const $=id=>document.getElementById(id);
const money=n=>'$'+n.toLocaleString('es-AR');

/* Dibujos generados (SVG) */
function dibujo(p){
  const forma={
    remera:'M60 30 L90 14 Q120 36 150 14 L180 30 L208 72 L180 88 L170 72 L170 205 L70 205 L70 72 L60 88 L32 72 Z',
    campera:'M82 18 Q120 42 158 18 L200 38 L228 195 L196 200 L186 96 L182 218 L58 218 L54 96 L44 200 L12 195 L40 38 Z',
    pantalon:'M70 16 L170 16 L182 218 L134 218 L120 84 L106 218 L58 218 Z'
  }[p.tipo];
  const extra=p.tipo==='campera'?`<line x1="120" y1="36" x2="120" y2="218" stroke="${p.tinta}" stroke-width="2" opacity=".6"/><rect x="70" y="150" width="32" height="26" fill="none" stroke="${p.tinta}" opacity=".4"/>`:
             p.tipo==='pantalon'?`<rect x="70" y="16" width="100" height="14" fill="${p.tinta}" opacity=".25"/>`:'';
  const x=p.tipo==='pantalon'?88:p.tipo==='campera'?85:120;
  const y=p.tipo==='pantalon'?130:p.tipo==='campera'?95:100;
  const anchor=p.tipo==='remera'?'middle':'middle';
  const tam=p.texto.length>7?13:p.texto.length>4?18:30;
  const cx=p.tipo==='pantalon'?88:p.tipo==='campera'?85:120;
  return `<svg viewBox="0 0 240 230" role="img" aria-label="${p.nombre}"><path d="${forma}" fill="${p.color}" stroke="${p.tinta}" stroke-width="1.5"/>${extra}
  <text x="${cx}" y="${y}" text-anchor="middle" font-family="Unbounded,sans-serif" font-weight="900" font-size="${tam}" fill="${p.tinta}">${p.texto}</text>
  <text x="${cx}" y="${y+16}" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="700" font-size="8" fill="${p.tinta}" opacity=".8">${p.sub}</text></svg>`;
}


/* Foto real de la prenda (ya estampada en img/merch-N.jpg). Si no existe, usa el dibujo. */
function foto(p){
  return `<div class="ph"><img src="${p.foto}" alt="${p.nombre}" onerror="this.parentNode.outerHTML=dibujo(PRODUCTOS[${p.id-1}])"></div>`;
}

/* Tienda */
let carrito=[];
/* Las tarjetas de merch están escritas en index.html (sección Merch) */

document.addEventListener('click',e=>{
  const a=e.target.dataset.add;
  if(a){const p=PRODUCTOS.find(x=>x.id==a);carrito.push({producto_id:p.id,nombre:p.nombre,talle:$('t'+a).value,precio:p.precio});pinta()}
  const q=e.target.dataset.quita;
  if(q!==undefined){carrito.splice(+q,1);pinta()}
});
function pinta(){
  $('items').innerHTML=carrito.length?carrito.map((c,i)=>`<li><span>${c.nombre} (${c.talle})</span><span>${money(c.precio)} <button type="button" data-quita="${i}" aria-label="Quitar" style="background:none;border:0;color:var(--niebla);cursor:pointer">✕</button></span></li>`).join(''):'<li>Todavía no agregaste nada.</li>';
  $('total').textContent='Total: '+money(carrito.reduce((t,c)=>t+c.precio,0));$('cuenta').textContent=carrito.length;
}
pinta();
const dPago=$('dPago'),dArr=$('dArr');
const tot=()=>carrito.reduce((t,c)=>t+c.precio,0);
$('pOk').onclick=()=>{
  if(!carrito.length)return $('pMsg').textContent='Agregá al menos un producto al carrito.';
  $('pMsg').textContent='';$('dResumen').textContent=carrito.length+' producto(s) · Total '+money(tot());dPago.showModal();
};
$('fCerrar').onclick=()=>dPago.close();
$('fPagar').onclick=()=>{ /* acepta cualquier dato; la tarjeta NO se guarda */
  const r=DB.add('pedidos',{nombre:$('fNombre').value,email:$('fEmail').value,direccion:$('fDir').value,items:carrito,total:tot(),estado:'pagado'});
  dPago.close();['fNombre','fEmail','fDir','fTarj','fVenc','fCvv'].forEach(i=>$(i).value='');
  $('pMsg').textContent='¡Compra confirmada! Tu pedido es el #'+r.id+'.';carrito=[];pinta();
};

/* Botón de arrepentimiento */
const pasos=n=>['aPaso1','aPaso2','aPaso3'].forEach((id,i)=>$(id).hidden=i!==n-1);
document.querySelectorAll('.btn-arr').forEach(b=>b.onclick=e=>{
  e.preventDefault();
  const ps=DB.get('pedidos').filter(x=>x.estado!=='arrepentido');
  $('aPedido').innerHTML=ps.length?ps.map(x=>`<option value="${x.id}">Pedido #${x.id} · ${money(x.total)}</option>`).join(''):'<option value="">No tenés compras para cancelar</option>';
  $('aMotivo').value='';$('aErr').textContent='';pasos(1);dArr.showModal();
});
dArr.querySelectorAll('[data-cierra]').forEach(b=>b.onclick=()=>dArr.close());
$('aSigue').onclick=()=>{
  if(!$('aPedido').value)return $('aErr').textContent='No hay compras para cancelar.';
  if(!$('aMotivo').value.trim())return $('aErr').textContent='Contanos por qué te arrepentís.';
  $('aTexto').textContent='Vas a cancelar el pedido #'+$('aPedido').value+'. Motivo: '+$('aMotivo').value.trim();pasos(2);
};
$('aVuelve').onclick=()=>pasos(1);
$('aOk').onclick=()=>{
  const id=+$('aPedido').value;
  DB.add('arrepentimientos',{pedido_id:id,motivo:$('aMotivo').value.trim()});
  const a=DB.get('pedidos'),x=a.find(q=>q.id===id);
  if(x){x.estado='arrepentido';try{localStorage.setItem('s3232_pedidos',JSON.stringify(a))}catch(e){}}
  pasos(3);
};
$('cOk').onclick=()=>{
  const n=$('cNombre').value.trim(),m=$('cEmail').value.trim();
  if(!n||!/^\S+@\S+\.\S+$/.test(m))return $('cMsg').textContent='Escribe tu nombre y un email válido.';
  DB.add('fans',{nombre:n,email:m});$('cMsg').textContent='Listo, ya sos parte del Club 3232.';
};

/* Panel #admin */
function admin(){
  const on=location.hash==='#admin';$('admin').style.display=on?'block':'none';
  if(on)$('aVista').textContent=JSON.stringify({productos:PRODUCTOS,pedidos:DB.get('pedidos'),fans:DB.get('fans'),arrepentimientos:DB.get('arrepentimientos')},null,2);
}
$('aDescarga').onclick=()=>{
  const b=new Blob([$('aVista').textContent],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download='base-datos-3232.json';a.click();
};
addEventListener('hashchange',admin);admin();