# Caçador automático de ofertas

O TechCompare agora pode procurar ofertas automaticamente no Mercado Livre e criar rascunhos de posts.

## Como funciona
1. A cada 6 horas o GitHub Actions executa o caçador.
2. Ele pesquisa os produtos definidos em `data/affiliate_links.json`.
3. Compara os menores preços encontrados com a mediana dos resultados.
4. Quando encontra uma diferença de pelo menos 8%, cria uma oferta em `data/deals.json`.
5. Cria um rascunho pronto para publicar em `posts/`.

## Importante
Os posts são **rascunhos**, não publicação automática em redes sociais. Revise o produto, preço, estoque e link de afiliado antes de publicar.

O sistema não depende de manter uma lista manual de 10 preços no site.
