(async function(){
  try{
    const r=await fetch("data/products.json?v="+Date.now(),{cache:"no-store"});
    if(!r.ok)return;
    const automatic=await r.json();
    if(!Array.isArray(automatic)||!automatic.length)return;

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
  }catch(e){console.warn("Catálogo automático indisponível.",e);}
})();