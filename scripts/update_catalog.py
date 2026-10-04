import json, os, re, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CFG = ROOT / "data" / "affiliate_links.json"
OUT = ROOT / "data" / "products.json"
AMAZON_CACHE = ROOT / "data" / "amazon_prices.json"
MAGALU_CACHE = ROOT / "data" / "magalu_prices.json"

def http_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "TechCompareCatalogBot/1.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)

def money(v):
    try:
        return f"R$ {float(v):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return "Preço não consultado"

def search_meli(query):
    url = "https://api.mercadolibre.com/sites/MLB/search?q=" + urllib.parse.quote(query) + "&limit=5"
    data = http_json(url)
    items = data.get("results", [])
    if not items:
        return None
    for item in items:
        if item.get("price") and item.get("available_quantity", 0) != 0:
            return item
    return items[0]

def load_amazon_prices():
    if not AMAZON_CACHE.exists():
        return {}
    try:
        data = json.loads(AMAZON_CACHE.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception as exc:
        print("Amazon cache could not be read:", exc)
        return {}

def load_magalu_prices():
    if not MAGALU_CACHE.exists():
        return {}
    try:
        data = json.loads(MAGALU_CACHE.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception as exc:
        print("Magalu cache could not be read:", exc)
        return {}

def main():
    cfg = json.loads(CFG.read_text(encoding="utf-8"))
    amazon = load_amazon_prices()
    magalu = load_magalu_prices()
    products = []

    for row in cfg:
        item = None
        try:
            item = search_meli(row["query"])
        except Exception as exc:
            print("Mercado Livre search failed:", row["query"], exc)

        # Keep the catalog entry even if Mercado Livre temporarily fails.
        if not item:
            item = {}

        price = item.get("price")
        title = item.get("title") or row["query"]
        thumbnail = item.get("thumbnail")
        if thumbnail and thumbnail.startswith("http://"):
            thumbnail = thumbnail.replace("http://", "https://", 1)

        links = row.get("affiliate", {})
        amazon_row = amazon.get(row["id"], {})
        magalu_row = magalu.get(row["id"], {})
        amazon_price = amazon_row.get("price", "Não consultado")
        if not amazon_price:
            amazon_price = "Não consultado"

        ml_price = money(price) if price is not None else "Preço não consultado"
        primary_price = ml_price if price is not None else amazon_price

        products.append({
            "id": row["id"],
            "cat": row["category"],
            "icon": row.get("icon", "🛒"),
            "name": title,
            "price": primary_price,
            "old": "",
            "store": "Mercado Livre" if price is not None else "Amazon" if amazon_price != "Não consultado" else "Oferta",
            "discount": "",
            "image": thumbnail or amazon_row.get("image", ""),
            "priceNote": "Preço atualizado automaticamente. Pode mudar conforme estoque, promoção, pagamento e região.",
            "storePrices": {
                "amazon": amazon_price,
                "mercadolivre": ml_price,
                "magalu": magalu_row.get("price", "Consulte a oferta")
            },
            "affiliateUrl": links.get("amazon", ""),
            "mercadoLivreUrl": links.get("mercadolivre", ""),
            "magaluUrl": links.get("magalu", ""),
            "amazonProductId": amazon_row.get("productId", ""),
            "sourceItemId": item.get("id"),
            "updatedAt": __import__("datetime").datetime.utcnow().isoformat() + "Z"
        })

    OUT.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated {len(products)} products")

if __name__ == "__main__":
    main()
