const products = [
  {id:"ps5slim",cat:"Consoles",icon:"🎮",name:"PlayStation®5 Slim Digital 825GB – Pacote ASTRO BOT e Gran Turismo 7",price:"Consultar preço",old:"",store:"Amazon",discount:"",affiliateUrl:"https://amzn.to/4yydDdW",mercadoLivreUrl:"https://meli.la/1Tw6LEQ"},
  {id:"ryzen5500",cat:"Processadores",icon:"⚙️",name:"Processador AMD Ryzen 5 5500 100100000457BOX, Cerâmica Cinza",price:"Consultar preço",old:"",store:"Amazon",discount:"",affiliateUrl:"https://amzn.to/4yARBqU",mercadoLivreUrl:"https://meli.la/19ZA9DC"},
  {id:"galaxya17",cat:"Celulares",icon:"📱",name:'Celular Samsung Galaxy A17, 128GB, 4GB, 50MP, Tela 6.7", IP54 - Preto',price:"Consultar preço",old:"",store:"Amazon",discount:"",affiliateUrl:"https://amzn.to/4hLEV9r",mercadoLivreUrl:"https://meli.la/1EWbDLP"},
  {id:"s24u",cat:"Celulares",icon:"📱",name:"Samsung Galaxy S24 Ultra 256GB",price:"R$ 5.299,00",old:"R$ 6.499,00",store:"Oferta a configurar",discount:"-18%",affiliateUrl:""},
  {id:"aspire5",cat:"Notebooks",icon:"💻",name:"Acer Aspire 5 Ryzen 5 | 8GB | 512GB SSD",price:"R$ 2.199,00",old:"R$ 2.699,00",store:"Oferta a configurar",discount:"-18%",affiliateUrl:""},
  {id:"rtx4060",cat:"Placas de Vídeo",icon:"🎮",name:"RTX 4060 8GB GDDR6",price:"R$ 2.299,00",old:"R$ 2.599,00",store:"Oferta a configurar",discount:"-12%",affiliateUrl:""},
  {id:"aoc27",cat:"Monitores",icon:"🖥️",name:'Monitor Gamer AOC 27" Full HD 165Hz',price:"R$ 1.099,00",old:"R$ 1.399,00",store:"Oferta a configurar",discount:"-21%",affiliateUrl:""},
  {id:"jbl520",cat:"Fones",icon:"🎧",name:"JBL Tune 520BT Bluetooth",price:"R$ 249,00",old:"R$ 299,00",store:"Oferta a configurar",discount:"-17%",affiliateUrl:""}
];

const list=document.getElementById("products");
let selected=new Set();

function render(items=products){
  list.innerHTML=items.map(p=>`
    <article class="product">
      <div class="product-img"><span class="discount">${p.discount}</span>
        <button class="heart" onclick="toggleCompare('${p.id}')" title="Adicionar à comparação">${selected.has(p.id)?"✓":"＋"}</button>
        <span>${p.icon}</span>
      </div>
      <div class="product-body">
        <small>${p.cat}</small><h3>${p.name}</h3>
        <div><span class="price">${p.price}</span><span class="old">${p.old}</span></div>
        <div class="store">${p.store}</div>
        <button class="primary buy" onclick="buyProduct('${p.id}')">Ver oferta →</button>
      </div>
    </article>`).join("");
  updateCompareCount();
}
function filterCategory(cat){
  document.getElementById("filterLabel").textContent=cat;
  render(cat==="Ofertas"?products:products.filter(p=>p.cat===cat));
  document.getElementById("ofertas").scrollIntoView({behavior:"smooth"});
}
function searchProducts(){
  const q=document.getElementById("heroSearch").value.toLowerCase().trim();
  if(!q){toast("Digite um produto para pesquisar.");return;}
  const found=products.filter(p=>(p.name+" "+p.cat).toLowerCase().includes(q));
  document.getElementById("filterLabel").textContent=q;
  render(found);
  document.getElementById("ofertas").scrollIntoView({behavior:"smooth"});
  if(!found.length)toast("Produto não encontrado no catálogo atual.");
}
function toggleCompare(id){
  if(selected.has(id)) selected.delete(id);
  else if(selected.size<3) selected.add(id);
  else {toast("Você pode comparar no máximo 3 produtos.");return;}
  render();
}
function updateCompareCount(){document.getElementById("compareCount").textContent=selected.size;}
function openComparison(){
  if(selected.size<2){toast("Selecione pelo menos 2 produtos.");return;}
  const items=products.filter(p=>selected.has(p.id));
  document.getElementById("comparisonGrid").innerHTML=items.map(p=>`
    <div class="compare-card"><div class="compare-icon">${p.icon}</div><h4>${p.name}</h4>
    <span>${p.cat}</span><strong>${p.price}</strong>
    <button class="primary buy" onclick="buyProduct('${p.id}')">Ver oferta</button></div>`).join("");
  document.getElementById("comparisonPanel").hidden=false;
  document.getElementById("comparisonPanel").scrollIntoView({behavior:"smooth"});
}
function closeComparison(){document.getElementById("comparisonPanel").hidden=true;}
function buyProduct(id,store="amazon"){
  const p=products.find(x=>x.id===id);
  const url=store==="mercadolivre"?p.mercadoLivreUrl:p.affiliateUrl;
  if(url) window.open(url,"_blank","noopener");
  else toast("Link de afiliado ainda não configurado para este produto.");
}
function subscribe(e){e.preventDefault();toast("Cadastro realizado! (Demonstração)");e.target.reset();}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
render();
