-- Extras for the current house stories. Prices follow the plan: packs R$ 6,90, extra chapters R$ 4,90–9,90.
-- No Stripe price ids: checkout uses inline price_data. Old products stay in the table (inactive) so past purchases keep their history.
insert into products (id, slug, type, story_slug, title_pt, title_es, desc_pt, desc_es, price_cents, preview_image, preview_audio)
values
  ('prod-pack-passageira', 'pack-passageira', 'story_pack', 'passageira', 'Marginal na chuva', 'Avenida bajo la lluvia', 'O cenário e a música de "A Mulher no Banco de Trás". As escolhas continuam as mesmas.', 'El escenario y la música de "La mujer del asiento de atrás". Las elecciones siguen iguales.', 690, '/scenes/passageira-marginal.jpg?v=t8', '/music/suspense.mp3'),
  ('prod-pack-cartas', 'pack-cartas', 'story_pack', 'correspondencia', 'Papel no último degrau', 'Papel en el último escalón', 'O cenário e a música de "Cartas para Quem Eu Fui". O enredo não muda.', 'El escenario y la música de "Cartas para quien fui". La trama no cambia.', 690, '/scenes/cartas-escada.jpg', '/music/calma.mp3'),
  ('prod-pack-corredor', 'pack-corredor', 'story_pack', 'corredor', 'Sétimo andar', 'Séptimo piso', 'O cenário e a música de "Não Olhe para Trás no Quarto 714". Nada do caminho principal se compra.', 'El escenario y la música de "No mires atrás en la habitación 714". Nada del camino principal se compra.', 690, '/scenes/corredor-corredor.jpg?v=q1', '/music/templo.mp3'),
  ('prod-pack-jantar', 'pack-jantar', 'story_pack', 'sobremesa', 'Mesa posta', 'Mesa puesta', 'O cenário e a música de "Jantar com a Minha Ex". As escolhas continuam as mesmas.', 'El escenario y la música de "Cena con mi ex". Las elecciones siguen iguales.', 690, '/scenes/jantar-capa.jpg', '/music/romance.mp3'),
  ('prod-bonus-passageira', 'bonus-passageira', 'bonus_chapter', 'passageira', 'Um dia a mais', 'Un día más', 'Um capítulo curto depois do final "A curva". Não muda o que você já escolheu.', 'Un capítulo corto después del final "La curva". No cambia lo que ya elegiste.', 590, '/scenes/passageira-curva.jpg?v=t8', '/music/romance.mp3'),
  ('prod-bonus-cartas', 'bonus-cartas', 'bonus_chapter', 'correspondencia', 'A carta de segunda-feira', 'La carta del lunes', 'Um capítulo curto depois do final. Não muda o que você já escolheu.', 'Un capítulo corto después del final. No cambia lo que ya elegiste.', 490, '/scenes/cartas-escada.jpg', '/music/calma.mp3'),
  ('prod-bonus-corredor', 'bonus-corredor', 'bonus_chapter', 'corredor', 'Café de azul', 'Café de azul', 'Um capítulo curto depois do final "O saguão". Não muda o que você já escolheu.', 'Un capítulo corto después del final "El vestíbulo". No cambia lo que ya elegiste.', 690, '/scenes/corredor-saguao.jpg?v=q1', '/music/luar.mp3')
on conflict (slug) do nothing;

-- Make sure anything tied to old story versions stays off the shelf (purchases untouched).
update products set active = false
where slug in ('a-lampada', 'bonus-bilhete', 'pack-biblioteca', 'pack-cafe', 'pack-praia')
   or story_slug in ('o-bilhete', 'a-chave', 'a-mare', 'a-lampada', 'antes-da-lua');
