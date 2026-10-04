const products = [
  {id:"ps5slim",cat:"Consoles",icon:"🎮",name:"PlayStation®5 Slim Digital 825GB – Pacote ASTRO BOT e Gran Turismo 7",price:"R$ 4.369,00",old:"R$ 4.599,00",store:"Mercado Livre",discount:"-5%",image:"https://horizonplay.fbitsstatic.net/img/p/sony-console-playstation-5-digital-slim-825gb-astrobot-e-gran-turismo-7-cfi-2115-branco-233951/430748.jpg?h=670&v=202608250244&w=670",priceNote:"Preços de referência consultados hoje. Podem mudar na loja.",storePrices:{amazon:"R$ 4.599,90",mercadolivre:"R$ 4.369,00",magalu:"R$ 4.599,99"},affiliateUrl:"https://amzn.to/4yydDdW",mercadoLivreUrl:"https://meli.la/1Tw6LEQ",magaluUrl:"https://www.magazinevoce.com.br/magazinetechcompare/console-playstation-5-edicao-digital-825gb-astro-bot-4-e-gran-turismo-7-sony/p/ac70gdd6je/ga/gap5/?seller_id=oficialamericanas"},
  {id:"ryzen5500",cat:"Processadores",icon:"⚙️",name:"Processador AMD Ryzen 5 5500 100100000457BOX, Cerâmica Cinza",price:"R$ 539,99",old:"R$ 1.176,46",store:"Pichau",discount:"-54%",image:"https://media.pichau.com.br/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/1/0/100-100000457box1.jpg",priceNote:"Preços de referência consultados hoje. Podem mudar na loja.",storePrices:{amazon:"Não consultado",mercadolivre:"R$ 699,90",magalu:"R$ 610,15 no Pix"},affiliateUrl:"https://amzn.to/4yARBqU",mercadoLivreUrl:"https://meli.la/19ZA9DC",magaluUrl:"https://www.magazinevoce.com.br/magazinetechcompare/processador-amd-ryzen-5-5500-3-6ghz-4-2ghz-max-turbo-socket-am4-cache-19mb-ddr4-sem-video-integrado-100-100000457box/p/bhhf5c0758/in/prsd/?seller_id=kometa"},
  {id:"galaxya17",cat:"Celulares",icon:"📱",name:'Celular Samsung Galaxy A17, 128GB, 4GB, 50MP, Tela 6.7", IP54 - Preto',price:"R$ 1.071,00",old:"R$ 1.999,00",store:"Mercado Livre",discount:"-46%",image:"https://samsungbrshop.vtexassets.com/arquivos/ids/266142-800-auto?v=638926099724000000",priceNote:"Preços de referência consultados hoje. Podem mudar na loja.",storePrices:{amazon:"Não consultado",mercadolivre:"R$ 1.071,00",magalu:"R$ 899,00 no Pix"},affiliateUrl:"https://amzn.to/4hLEV9r",mercadoLivreUrl:"https://meli.la/1EWbDLP",magaluUrl:"https://www.magazinevoce.com.br/magazinetechcompare/smartphone-samsung-galaxy-a17-128gb-4gb-ram-preto/p/cd4575cad1/te/ga17/?seller_id=temdetudo1001"},
  {id:"s24u",cat:"Celulares",icon:"📱",name:"Samsung Galaxy S24 Ultra 256GB",price:"R$ 5.299,00",old:"R$ 6.499,00",store:"Oferta a configurar",discount:"-18%",affiliateUrl:""},
  {id:"aspire5",cat:"Notebooks",icon:"💻",name:"Acer Aspire 5 Ryzen 5 | 8GB | 512GB SSD",price:"R$ 2.199,00",old:"R$ 2.699,00",store:"Oferta a configurar",discount:"-18%",affiliateUrl:""},
  {id:"rtx4060",cat:"Placas de Vídeo",icon:"🎮",name:"RTX 4060 8GB GDDR6",price:"R$ 2.299,00",old:"R$ 2.599,00",store:"Oferta a configurar",discount:"-12%",affiliateUrl:""},
  {id:"aoc27",cat:"Monitores",icon:"🖥️",name:'Monitor Gamer AOC 27" Full HD 165Hz',price:"R$ 1.099,00",old:"R$ 1.399,00",store:"Oferta a configurar",discount:"-21%",affiliateUrl:""},
  {id:"jbl520",cat:"Fones",icon:"🎧",name:"JBL Tune 520BT Bluetooth",price:"R$ 249,00",old:"R$ 299,00",store:"Oferta a configurar",discount:"-17%",affiliateUrl:""}
];

const list=document.getElementById("products");
const productDetails={ps5slim:{title:"PlayStation®5 Slim Digital 825GB – ASTRO BOT + Gran Turismo 7",details:["Categoria: Console","SSD: 825GB","CPU: AMD Ryzen Zen 2, 8 núcleos / 16 threads, até 3,5 GHz","GPU: AMD Radeon RDNA 2 com Ray Tracing, até 10,3 TFLOPS","Memória: 16GB GDDR6","Vídeo: até 4K/120Hz, 8K e VRR via HDMI 2.1","Wi‑Fi 6, Bluetooth 5.1 e Ethernet","Áudio Tempest 3D AudioTech","Controle DualSense com resposta tátil e gatilhos adaptáveis","Edição digital sem leitor de discos; leitor adicional vendido separadamente","Inclui ASTRO BOT e Gran Turismo 7"]},ryzen5500:{title:"AMD Ryzen 5 5500",details:["Categoria: Processador","Soquete: AM4","Arquitetura: Zen 3","6 núcleos / 12 threads","Clock base: 3,6 GHz","Boost: até 4,2 GHz","Cache: 19 MB","TDP: 65W","Memória: DDR4","Não possui vídeo integrado; requer placa de vídeo dedicada"]},galaxya17:{title:"Samsung Galaxy A17 128GB 4GB RAM",details:["Categoria: Celular","Armazenamento: 128GB","RAM: 4GB","Câmera principal: 50MP","Tela: 6,7 polegadas","Proteção: IP54","Cor: Preto","Algumas especificações podem variar conforme a versão/região; confirme na oferta antes da compra."]}};

let selected=new Set();

function normalize(text){
  return String(text||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
}

function storeButtons(p){
  const buttons=[];
  if(p.affiliateUrl) buttons.push('<button class="store-btn amazon" onclick="buyProduct(\''+p.id+'\',\'amazon\')">Amazon</button>');
  if(p.mercadoLivreUrl) buttons.push('<button class="store-btn mercado" onclick="buyProduct(\''+p.id+'\',\'mercadolivre\')">Mercado Livre</button>');
  if(p.magaluUrl) buttons.push('<button class="store-btn magalu" onclick="buyProduct(\''+p.id+'\',\'magalu\')">Magalu</button>');
  return buttons.length ? '<div class="store-actions">'+buttons.join("")+'</div>' : '<button class="primary buy" onclick="buyProduct(\''+p.id+'\')">Ver oferta →</button>';
}


function showProductDetails(id){
  const p=products.find(function(x){return x.id===id;}),d=productDetails[id];
  if(!p||!d){toast("Informações detalhadas ainda não cadastradas.");return;}
  const sp=p.storePrices||{};
  const storeRows=[
    ["Amazon",sp.amazon,p.affiliateUrl,"amazon"],
    ["Mercado Livre",sp.mercadolivre,p.mercadoLivreUrl,"mercadolivre"],
    ["Magalu",sp.magalu,p.magaluUrl,"magalu"]
  ];
  const priceTable=storeRows.map(function(row){
    const name=row[0],price=row[1]||"Não consultado",url=row[2],store=row[3];
    return '<div class="store-price-row"><strong>'+name+'</strong><span>'+price+'</span>'+(url?'<button class="store-price-buy" onclick="buyProduct(\\''+p.id+'\\',\\''+store+'\\')">Comprar</button>':'<span class="unavailable">Link não configurado</span>')+'</div>';
  }).join("");
  document.getElementById("detailsContent").innerHTML=
    '<div class="details-top"><span class="details-icon">'+p.icon+'</span><div><span class="eyebrow">'+p.cat+'</span><h2>'+d.title+'</h2><p class="price">A partir de '+p.price+'</p></div></div>'+
    '<div class="store-price-table"><h3>Preços por loja</h3>'+priceTable+'</div>'+
    '<p class="price-note">Os valores são referências e podem mudar conforme promoção, estoque, forma de pagamento e região.</p>'+
    '<ul>'+d.details.map(function(x){return '<li>'+x+'</li>';}).join("")+'</ul>'+
    '<div class="store-actions">'+storeButtons(p)+'</div>';
  document.getElementById("detailsPanel").hidden=false;
  document.getElementById("detailsPanel").scrollIntoView({behavior:"smooth"});
}
function closeDetails(){document.getElementById("detailsPanel").hidden=true;}

function render(items=products){
  if(!items.length){
    list.innerHTML='<div class="no-results"><h3>Nenhum produto encontrado</h3><p>Esse produto ainda não está cadastrado no TechCompare. Você pode pesquisar diretamente nas lojas abaixo.</p><div class="external-searches"><button onclick="searchStore(\'amazon\')">Pesquisar na Amazon</button><button onclick="searchStore(\'mercadolivre\')">Pesquisar no Mercado Livre</button><button onclick="searchStore(\'magalu\')">Pesquisar na Magalu</button></div></div>';
    updateCompareCount();
    return;
  }
  list.innerHTML=items.map(p=>`
    <article class="product">
      <div class="product-img"><span class="discount">${p.discount}</span>
        <button class="heart" onclick="toggleCompare('${p.id}')" title="Adicionar à comparação">${selected.has(p.id)?"✓":"＋"}</button>
        ${p.image ? '<img src="'+p.image+'" alt="'+p.name+'" loading="lazy">' : '<span class="product-placeholder">'+p.icon+'</span>'}
      </div>
      <div class="product-body">
        <small>${p.cat}</small><h3>${p.name}</h3>
        <div><span class="price">${p.price}</span><span class="old">${p.old}</span></div>
        <div class="store">${p.store}</div><small class="price-note">${p.priceNote||"Preço de referência. Consulte a oferta antes de comprar."}</small>
        <button class="details-btn" onclick="showProductDetails('${p.id}')">Ver informações →</button>${storeButtons(p)}
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
  const input=document.getElementById("heroSearch");
  const q=normalize(input.value.trim());
  if(!q){toast("Digite um produto para pesquisar.");return;}
  const terms=q.split(/\s+/).filter(Boolean);
  const found=products.filter(p=>{
    const text=normalize(p.name+" "+p.cat+" "+p.store);
    return terms.every(term=>text.includes(term));
  });
  document.getElementById("filterLabel").textContent=input.value.trim();
  render(found);
  document.getElementById("ofertas").scrollIntoView({behavior:"smooth"});
  if(!found.length) toast("Esse produto ainda não está no catálogo. Você pode pesquisar nas lojas.");
}

function searchStore(store){
  const q=document.getElementById("heroSearch").value.trim();
  if(!q){toast("Digite o nome do produto primeiro.");return;}
  const urls={
    amazon:"https://www.amazon.com.br/s?k="+encodeURIComponent(q),
    mercadolivre:"https://lista.mercadolivre.com.br/"+encodeURIComponent(q),
    magalu:"https://www.magazineluiza.com.br/busca/"+encodeURIComponent(q)
  };
  window.open(urls[store],"_blank","noopener");
}

function toggleCompare(id){
  if(selected.has(id)) selected.delete(id);
  else if(selected.size<3) selected.add(id);
  else {toast("Você pode comparar no máximo 3 produtos.");return;}
  render(products.slice(0,3));
}
function updateCompareCount(){
  const el=document.getElementById("compareCount");
  if(el) el.textContent=selected.size;
}
function openComparison(){
  if(selected.size<2){toast("Selecione pelo menos 2 produtos.");return;}
  const items=products.filter(p=>selected.has(p.id));
  document.getElementById("comparisonGrid").innerHTML=items.map(p=>`
    <div class="compare-card"><div class="compare-icon">${p.icon}</div><h4>${p.name}</h4>
    <span>${p.cat}</span><strong>${p.price}</strong>
    ${storeButtons(p)}</div>`).join("");
  document.getElementById("comparisonPanel").hidden=false;
  document.getElementById("comparisonPanel").scrollIntoView({behavior:"smooth"});
}
function showCompare(){openComparison();}
function closeComparison(){document.getElementById("comparisonPanel").hidden=true;}
function buyProduct(id,store="amazon"){
  const p=products.find(x=>x.id===id);
  const url=store==="mercadolivre"?p.mercadoLivreUrl:store==="magalu"?p.magaluUrl:p.affiliateUrl;
  if(url) window.open(url,"_blank","noopener");
  else toast("Link de afiliado ainda não configurado para este produto.");
}
function subscribe(e){e.preventDefault();toast("Cadastro realizado! (Demonstração)");e.target.reset();}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
render();
