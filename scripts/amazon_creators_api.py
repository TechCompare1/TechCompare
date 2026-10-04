"""Amazon Creators API adapter for TechCompare.

This module intentionally keeps credentials out of the repository.
When Amazon grants the account access, configure the GitHub Actions secrets
listed in .github/workflows/update-catalog.yml and implement the request
according to the current Amazon Creators API documentation for the Brazil
marketplace. The API contract can change, so the endpoint/auth details are
kept configurable instead of guessing them here.
"""
import json
import os
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "data" / "amazon_prices.json"


def fetch_amazon_prices(queries):
    endpoint = os.getenv("AMAZON_CREATORS_API_URL", "").strip()
    access_key = os.getenv("AMAZON_CREATORS_ACCESS_KEY", "").strip()
    secret_key = os.getenv("AMAZON_CREATORS_SECRET_KEY", "").strip()
    associate_tag = os.getenv("AMAZON_ASSOCIATE_TAG", "techcompare20-20").strip()

    if not endpoint or not access_key or not secret_key:
        print("Amazon Creators API not enabled: credentials/endpoint are not configured.")
        return {}

    # Do not guess Amazon's current authentication/signing contract.
    # This adapter deliberately fails closed until the official API contract
    # for the account/marketplace is configured.
    raise RuntimeError(
        "Amazon Creators API credentials are present, but the request adapter "
        "is not configured for the current API contract. Update this module "
        "from Amazon's official Creators API documentation before enabling it."
    )


def main():
    links = json.loads((ROOT / "data" / "affiliate_links.json").read_text(encoding="utf-8"))
    queries = {row["id"]: row["query"] for row in links}
    try:
        prices = fetch_amazon_prices(queries)
    except Exception as exc:
        print("Amazon Creators API:", exc)
        return

    CACHE.write_text(json.dumps(prices, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {len(prices)} Amazon products")


if __name__ == "__main__":
    main()
