const products = [
  {cat:"Celulares", icon:"📱", name:"Samsung Galaxy S24 Ultra 256GB", price:"R$ 5.299,00", old:"R$ 6.499,00", store:"Ver oferta na loja", discount:"-18%"},
  {cat:"Notebooks", icon:"💻", name:"Acer Aspire 5 Ryzen 5 | 8GB | 512GB SSD", price:"R$ 2.199,00", old:"R$ 2.699,00", store:"Ver oferta na loja", discount:"-18%"},
  {cat:"Placas de Vídeo", icon:"🎮", name:"RTX 4060 8GB GDDR6", price:"R$ 2.299,00", old:"R$ 2.599,00", store:"Ver oferta na loja", discount:"-12%"},
  {cat:"Monitores", icon:"🖥️", name:'Monitor Gamer AOC 27" Full HD 165Hz', price:"R$ 1.099,00", old:"R$ 1.399,00", store:"Ver oferta na loja", discount:"-21%"},
  {cat:"Fones", icon:"🎧", name:"JBL Tune 520BT Bluetooth", price:"R$ 249,00", old:"R$ 299,00", store:"Ver oferta na loja", discount:"-17%"}
];

const list = document.getElementById("products");

function render(items=products){
  list.innerHTML = items.map((p,i)=>`
    <article class="product">
      <div class="product-img"><span class="discount">${p.discount}</span><button class="heart" onclick="toast('Produto salvo nos favoritos ❤️')">♡</button><span>${p.icon}</span></div>
      <div class="product-body">
        <small>${p.cat}</small>
        <h3>${p.name}</h3>
        <div><span class="price">${p.price}</span><span class="old">${p.old}</span></div>
        <div class="store">${p.store}</div>
      </div>
    </article>`).join("");
}
function filterCategory(cat){
  document.getElementById("filterLabel").textContent = cat;
  render(cat==="Ofertas" ? products : products.filter(p=>p.cat===cat));
  document.getElementById("ofertas").scrollIntoView({behavior:"smooth"});
}
function searchProducts(){
  const q=document.getElementById("heroSearch").value.toLowerCase().trim();
  if(!q){toast("Digite um produto para pesquisar.");return;}
  const found=products.filter(p=>(p.name+" "+p.cat).toLowerCase().includes(q));
  document.getElementById("filterLabel").textContent=q;
  render(found);
  document.getElementById("ofertas").scrollIntoView({behavior:"smooth"});
  if(!found.length) toast("Ainda não temos esse produto na demonstração.");
}
function showCompare(){toast("A área de comparação está pronta para receber produtos e preços reais.");}
function subscribe(e){e.preventDefault();toast("Cadastro realizado! (Demonstração)");e.target.reset();}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
render();
