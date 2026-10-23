create table if not exists products (
  id text primary key,
  slug text unique not null,
  type text not null check (type in ('story_pack', 'global_pack', 'special_story', 'bonus_chapter')),
  story_slug text,
  title_pt text not null,
  title_es text not null,
  desc_pt text not null,
  desc_es text not null,
  price_cents integer not null,
  stripe_price_id text,
  preview_image text,
  preview_audio text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists purchases (
  id text primary key,
  user_id text not null,
  product_id text not null references products(id),
  stripe_session_id text unique,
  payment_intent text,
  amount_cents integer not null,
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists purchases_one_paid on purchases (user_id, product_id) where status = 'paid';

create table if not exists tips (
  id text primary key,
  user_id text,
  author_slug text not null,
  story_slug text,
  amount_cents integer not null,
  message text,
  message_status text not null default 'oculta',
  stripe_session_id text unique,
  payment_intent text,
  status text not null default 'paid',
  author_share_percent integer not null default 80,
  created_at timestamptz not null default now()
);

insert into products (id, slug, type, story_slug, title_pt, title_es, desc_pt, desc_es, price_cents, preview_image, preview_audio)
values
  ('prod-biblioteca', 'pack-biblioteca', 'story_pack', 'o-bilhete', 'Noite na biblioteca', 'Noche en la biblioteca', 'O cenário e a música desta história. As escolhas continuam as mesmas.', 'El escenario y la música de esta historia. Las elecciones siguen iguales.', 690, '/scenes/biblioteca.jpg', '/music/romance.mp3'),
  ('prod-cafe', 'pack-cafe', 'story_pack', 'a-chave', 'Chuva no café', 'Lluvia en el café', 'O café molhado e a trilha desta noite. O enredo não muda.', 'El café mojado y la música de esta noche. La trama no cambia.', 690, '/scenes/cafe.jpg', '/music/calma.mp3'),
  ('prod-praia', 'pack-praia', 'story_pack', 'a-mare', 'Praia sem lua', 'Playa sin luna', 'A areia e o som desta história. Nada do caminho principal se compra.', 'La arena y el sonido de esta historia. Nada del camino principal se compra.', 690, '/scenes/praia.jpg', '/music/despedida.mp3'),
  ('prod-chuva', 'chuva', 'global_pack', null, 'Chuva', 'Lluvia', 'Um clima de chuva para qualquer história que você já pode ler.', 'Un clima de lluvia para cualquier historia que ya puedes leer.', 690, '/scenes/biblioteca.jpg', '/sounds/rain.mp3'),
  ('prod-templo', 'templo', 'global_pack', null, 'Templo', 'Templo', 'Um clima quieto, para qualquer história aberta.', 'Un clima quieto, para cualquier historia abierta.', 690, '/scenes/templo.jpg', '/music/templo.mp3'),
  ('prod-lampada', 'a-lampada', 'special_story', 'a-lampada', 'A lâmpada que não devia acender', 'La lámpara que no debía encenderse', 'A história inteira, comprada uma vez. Sem mensalidade.', 'La historia entera, comprada una vez. Sin mensualidad.', 790, '/scenes/templo.jpg', '/music/templo.mp3'),
  ('prod-bonus-bilhete', 'bonus-bilhete', 'bonus_chapter', 'o-bilhete', 'A última estante ainda acesa', 'El último estante todavía encendido', 'Um caminho curto depois do final. Não muda o que você já escolheu.', 'Un camino corto después del final. No cambia lo que ya elegiste.', 490, '/scenes/biblioteca.jpg', '/music/romance.mp3')
on conflict (slug) do nothing;
