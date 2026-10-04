import json, urllib.parse, urllib.request, statistics, re
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
CFG = ROOT / "data" / "affiliate_links.json"
OUT = ROOT / "data" / "deals.json"
HISTORY = ROOT / "data" / "deal_history.json"
POSTS = ROOT / "posts"

def http_json(url):
    req = urllib.request.Request(url, headers={"User-Agent":"TechCompareDealHunter/1.0"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)

def money(v):
    return f"R$ {float(v):,.2f}".replace(",", "X").replace(".", ",").replace("X",".")

def search(query):
    url = "https://api.mercadolibre.com/sites/MLB/search?q=" + urllib.parse.quote(query) + "&limit=10&sort=price_asc"
    data = http_json(url)
    items = [x for x in data.get("results",[]) if x.get("price") and x.get("available_quantity",0) != 0]
    return items

def load(path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default

def slug(s):
    return re.sub(r"[^a-z0-9]+","-",s.lower()).strip("-")[:70]

def main():
    cfg = load(CFG, [])
    history = load(HISTORY, {})
    deals = []
    now = datetime.now(timezone.utc).isoformat()

    for row in cfg:
        try:
            items = search(row["query"])
        except Exception as exc:
            print("search failed", row["query"], exc)
            continue
        if not items:
            continue

        prices = [float(x["price"]) for x in items[:10]]
        best = items[0]
        best_price = float(best["price"])
        median = statistics.median(prices)
        reference = float(history.get(row["id"], {}).get("reference_price") or median)
        drop = max(0, (reference-best_price)/reference*100) if reference else 0
        relative = max(0, (median-best_price)/median*100) if median else 0

        # A deal is interesting when it is >=8% below the current search median.
        if relative >= 8 or drop >= 8:
            deals.append({
                "id": row["id"],
                "category": row["category"],
                "query": row["query"],
                "title": best.get("title") or row["query"],
                "price": best_price,
                "priceFormatted": money(best_price),
                "medianPrice": median,
                "discountVsSearch": round(relative,1),
                "sourceItemId": best.get("id"),
                "sourceUrl": best.get("permalink",""),
                "affiliateUrl": row.get("affiliate",{}).get("mercadolivre",""),
                "checkedAt": now
            })

        # Keep the moving reference so future drops can be detected.
        history[row["id"]] = {"reference_price": median, "last_price": best_price, "checkedAt": now}

    OUT.write_text(json.dumps(deals,ensure_ascii=False,indent=2),encoding="utf-8")
    HISTORY.write_text(json.dumps(history,ensure_ascii=False,indent=2),encoding="utf-8")
    POSTS.mkdir(exist_ok=True)

    date = datetime.now().strftime("%d/%m/%Y")
    index = []
    for i, d in enumerate(deals[:10],1):
        post = f"""# 🔥 Oferta TechCompare — {d['title']}

💰 **{d['priceFormatted']}**

📉 Cerca de **{d['discountVsSearch']}% abaixo da mediana encontrada** para produtos semelhantes.

🛒 **Comprar:** {d['affiliateUrl']}

⚠️ Preço e estoque podem mudar a qualquer momento. Confira o valor na loja antes de comprar.

#oferta #tecnologia #promocao #TechCompare
"""
        filename = POSTS / f"{date.replace('/','-')}-{i:02d}-{slug(d['id'])}.md"
        filename.write_text(post,encoding="utf-8")
        index.append({"file":str(filename.relative_to(ROOT)),"title":d["title"],"price":d["priceFormatted"]})

    (POSTS/"README.md").write_text(
        "# Posts automáticos do TechCompare\n\n"
        "Estes são rascunhos gerados automaticamente pelo caçador de ofertas. "
        "Revise preço, produto e link antes de publicar em redes sociais.\n\n"
        + "\n".join(f"- {x['file']} — {x['title']} — {x['price']}" for x in index),
        encoding="utf-8"
    )
    print(f"Generated {len(deals)} deal drafts")

if __name__ == "__main__":
    main()
