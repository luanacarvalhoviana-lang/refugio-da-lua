-- Bonus chapters are now full interactive chapters (about 2,000 words, 2 choices, 2 endings) with their own cover.
update products set
  preview_image = '/scenes/bonus-passageira-capa.jpg?v=b1',
  desc_pt = 'Capítulo extra interativo depois do final "A curva": a segunda-feira seguinte, a chave reserva e uma pergunta. Cerca de 2.000 palavras, com escolhas e dois finais. Não muda a história principal.',
  desc_es = 'Capítulo extra interactivo después del final "La curva": el lunes siguiente, la llave de repuesto y una pregunta. Unas 2.000 palabras, con elecciones y dos finales. No cambia la historia principal.'
where slug = 'bonus-passageira';
update products set
  preview_image = '/scenes/bonus-cartas-capa.jpg?v=b1',
  desc_pt = 'Capítulo extra interativo depois do final "A resposta": a carta verde de segunda-feira e uma coisa verdadeira por semana. Cerca de 2.000 palavras, com escolhas e dois finais. Não muda a história principal.',
  desc_es = 'Capítulo extra interactivo después del final "La respuesta": la carta verde del lunes y una cosa verdadera por semana. Unas 2.000 palabras, con elecciones y dos finales. No cambia la historia principal.'
where slug = 'bonus-cartas';
update products set
  preview_image = '/scenes/bonus-corredor-capa.jpg?v=b1',
  desc_pt = 'Capítulo extra interativo depois do final "O saguão": uma semana depois, uma janela de padaria e a Iara dizendo a cor antes. Cerca de 2.000 palavras, com escolhas e dois finais. Não muda a história principal.',
  desc_es = 'Capítulo extra interactivo después del final "El vestíbulo": una semana después, la ventana de una panadería e Iara diciendo el color antes. Unas 2.000 palabras, con elecciones y dos finales. No cambia la historia principal.'
where slug = 'bonus-corredor';
