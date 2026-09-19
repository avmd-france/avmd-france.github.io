const P=window.PRODUCTS, grid=document.querySelector("#grid");
let active="All", cart=JSON.parse(localStorage.getItem("avmd-cart")||"[]");
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);
function render(){
  const data=P.filter(p=>active==="All"||p.gender===active||p.category===active);
  grid.innerHTML=data.map((p,i)=>`<article class="card"><div class="media"><span class="pill">${p.gender} · ${p.category}</span><img loading="lazy" src="${p.image}" alt="${p.name}"></div><div class="info"><div class="meta">${p.brand}</div><div class="name">${p.name}</div><div class="row"><span class="price">${money(p.price)}</span><button onclick="add(${P.indexOf(p)})">Add to bag</button></div><a class="source" href="${p.link}" target="_blank" rel="noopener">View source ↗</a></div></article>`).join("");
}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");active=b.dataset.filter;render();document.querySelector("#new").scrollIntoView()});
document.querySelectorAll(".jump").forEach(b=>b.onclick=()=>{active=b.dataset.jump;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===active));render();document.querySelector("#new").scrollIntoView()});
function add(i){cart.push(i);save();openCart()}
function save(){localStorage.setItem("avmd-cart",JSON.stringify(cart));renderCart()}
function renderCart(){document.querySelector("#cartCount").textContent=cart.length;const box=document.querySelector("#cartItems");box.innerHTML=cart.length?cart.map((i,n)=>`<div class="cart-item"><div><b>${P[i].name}</b><br><span>${P[i].brand} · ${money(P[i].price)}</span></div><button onclick="removeItem(${n})">Remove</button></div>`).join(""):`<div class="cart-item">Your bag is empty.</div>`;document.querySelector("#subtotal").textContent=money(cart.reduce((s,i)=>s+P[i].price,0));}
function removeItem(n){cart.splice(n,1);save()}
window.add=add;window.removeItem=removeItem;
const cartEl=document.querySelector("#cart"),overlay=document.querySelector("#overlay");
function openCart(){cartEl.classList.add("open");overlay.classList.add("show");cartEl.setAttribute("aria-hidden","false")}
function closeCart(){cartEl.classList.remove("open");overlay.classList.remove("show");cartEl.setAttribute("aria-hidden","true")}
document.querySelector("#cartBtn").onclick=openCart;document.querySelector("#closeCart").onclick=closeCart;overlay.onclick=closeCart;
const dialog=document.querySelector("#searchDialog"), input=document.querySelector("#searchInput"), results=document.querySelector("#searchResults");
document.querySelector("#searchBtn").onclick=()=>{dialog.showModal();setTimeout(()=>input.focus(),100)};
input.oninput=()=>{let q=input.value.toLowerCase().trim();results.innerHTML=!q?"":P.filter(p=>(p.name+" "+p.brand+" "+p.gender+" "+p.category).toLowerCase().includes(q)).slice(0,8).map(p=>`<div class="search-item"><span>${p.name} · ${p.brand}</span><b>${money(p.price)}</b></div>`).join("")};
render();renderCart();
// Customer contacts: sample 555-01xx numbers are not active. They are deliberately not clickable.
(function(){
  const info=window.AVMD_CONTACT||{};
  const demo=info.demo!==false;
  const numbers=[['supportPhone','footerSupport','supportHint',info.supportPhone],['advicePhone','footerAdvice','adviceHint',info.advicePhone]];
  numbers.forEach(([id,footerId,hintId,number])=>{
    const link=document.getElementById(id),foot=document.getElementById(footerId),hint=document.getElementById(hintId);
    if(!number || !link) return;
    link.textContent=number;foot.textContent=number+(demo?' (example)':'');
    if(demo){link.removeAttribute('href');link.classList.add('is-demo');hint.textContent='Example number — replace before launch';}
    else {link.href='tel:'+number.replace(/[^+\d]/g,'');hint.textContent='Call our team';}
  });
})();
