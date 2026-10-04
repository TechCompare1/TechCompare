async function loadAutomaticDeals(){
  const box=document.getElementById("dealProducts");
  const status=document.getElementById("dealStatus");
  if(!box)return;
  try{
    const r=await fetch("data/deals.json?v="+Date.now(),{cache:"no-store"});
    if(!r.ok)throw new Error("deals unavailable");
    const deals=await r.json();
    if(!Array.isArray(deals)||!deals.length){
      box.innerHTML='<div class="no-results"><h3>Nenhuma oferta excepcional encontrada</h3><p>O caçador continua procurando. Volte depois.</p></div>';
      status.textContent="Monitorando";
      return;
    }
    status.textContent=deals.length+" oferta(s)";
    box.innerHTML=deals.slice(0,12).map(d=>`
      <article class="product deal-card">
        <div class="product-img"><span class="discount">-${d.discountVsSearch}%</span><span class="product-placeholder">🔥</span></div>
        <div class="product-body">
          <small>${d.category}</small>
          <h3>${d.title}</h3>
          <div><span class="price">${d.priceFormatted}</span></div>
          <div class="store">Mercado Livre</div>
          <small class="price-note">Oferta detectada automaticamente. O preço pode mudar.</small>
          <button class="primary buy" onclick="window.open('${d.affiliateUrl}','_blank','noopener')">Ver oferta →</button>
        </div>
      </article>`).join("");
  }catch(e){
    box.innerHTML='<div class="no-results"><h3>Ofertas automáticas em preparação</h3><p>O sistema de ofertas está sendo atualizado.</p></div>';
    status.textContent="Em preparação";
  }
}
document.addEventListener("DOMContentLoaded",loadAutomaticDeals);