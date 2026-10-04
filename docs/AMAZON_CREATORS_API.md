# Amazon Creators API — TechCompare

O TechCompare está preparado para receber preços da Amazon sem colocar
credenciais secretas no JavaScript público.

## Quando a conta ficar elegível

Configure estes **GitHub Actions Secrets** no repositório:

- `AMAZON_CREATORS_ACCESS_KEY`
- `AMAZON_CREATORS_SECRET_KEY`

E estas variáveis:

- `AMAZON_CREATORS_API_URL` — endpoint oficial informado pela documentação da Amazon para a conta/marketplace.
- `AMAZON_ASSOCIATE_TAG` — por padrão, `techcompare20-20`.

**Nunca** coloque Secret Key em `script.js`, `index.html`, `data/*.json` ou em qualquer arquivo público.

## Por que o endpoint não foi inventado

A Amazon está migrando integrações para a Creators API e o contrato de autenticação/endpoint pode variar conforme a versão e o marketplace. O repositório, portanto, guarda somente a estrutura de configuração. Quando a Amazon liberar o acesso da conta, use a documentação oficial exibida no portal para completar `scripts/amazon_creators_api.py`.

## Fluxo

`GitHub Actions → Amazon Creators API → data/amazon_prices.json → data/products.json → site`

O site já lê `storePrices.amazon` e mostra o valor automaticamente quando esse campo for preenchido.
