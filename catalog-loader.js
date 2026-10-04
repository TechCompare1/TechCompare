(async function(){
  try{
    const r=await fetch("data/products.json?v="+Date.now(),{cache:"no-store"});
    if(!r.ok)return;
    const automatic=await r.json();
    if(!Array.isArray(automatic)||!automatic.length)return;

    window.techcompareCatalog=automatic;
    render(automatic);

    window.searchProducts=function(){
      const input=document.getElementById("heroSearch");
      const q=String(input.value||"").trim().toLowerCase();
      if(!q){toast("Digite um produto para pesquisar.");return;}
      const found=automatic.filter(p=>(p.name+" "+p.cat+" "+p.store).toLowerCase().includes(q));
      document.getElementById("filterLabel").textContent=input.value.trim();
      render(found);
      document.getElementById("ofertas").scrollIntoView({behavior:"smooth"});
      if(!found.length)toast("Esse produto ainda não está no catálogo.");
    };

    window.filterCategory=function(cat){
      document.getElementById("filterLabel").textContent=cat;
      render(cat==="Ofertas"?automatic:automatic.filter(p=>p.cat===cat));
      document.getElementById("ofertas").scrollIntoView({behavior:"smooth"});
    };

    window.buyProduct=function(id,store="amazon"){
      const p=automatic.find(x=>x.id===id);
      if(!p){toast("Produto não encontrado.");return;}
      const url=store==="mercadolivre"?p.mercadoLivreUrl:store==="magalu"?p.magaluUrl:p.affiliateUrl;
      if(url)window.open(url,"_blank","noopener");
      else toast("Link de afiliado ainda não configurado.");
    };

    // Use the automatic catalog for the details modal too.
    window.showProductDetails=function(id){
      const p=automatic.find(x=>x.id===id);
      const d=typeof productDetails!=="undefined" ? productDetails[id] : null;
      if(!p||!d){toast("Informações detalhadas ainda não cadastradas.");return;}
      const sp=p.storePrices||{};
      const rows=[
        ["Amazon",sp.amazon,p.affiliateUrl,"amazon"],
        ["Mercado Livre",sp.mercadolivre,p.mercadoLivreUrl,"mercadolivre"],
        ["Magalu",sp.magalu,p.magaluUrl,"magalu"]
      ];
      const priceTable=rows.map(function(row){
        const name=row[0], price=row[1]||"Não consultado", url=row[2], store=row[3];
        return '<div class="store-price-row"><strong>'+name+'</strong><span>'+price+'</span>'+
          (url?'<button class="store-price-buy" onclick="buyProduct(&quot;'+p.id+'&quot;,&quot;'+store+'&quot;)">Comprar</button>':
          '<span class="unavailable">Link não configurado</span>')+
          '</div>';
      }).join("");
      document.getElementById("detailsContent").innerHTML=
        '<div class="details-top"><span class="details-icon">'+p.icon+'</span><div><span class="eyebrow">'+p.cat+'</span><h2>'+d.title+'</h2><p class="price">A partir de '+p.price+'</p></div></div>'+
        '<div class="store-price-table"><h3>Preços por loja</h3>'+priceTable+'</div>'+
        '<p class="price-note">Os valores são referências e podem mudar conforme promoção, estoque, forma de pagamento e região.</p>'+
        '<ul>'+d.details.map(function(x){return '<li>'+x+'</li>';}).join("")+'</ul>'+
        '<div class="store-actions">'+storeButtons(p)+'</div>';
      document.getElementById("detailsPanel").hidden=false;
      document.getElementById("detailsPanel").scrollIntoView({behavior:"smooth"});
    };
  }catch(e){console.warn("Catálogo automático indisponível.",e);}
})();