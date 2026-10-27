-- Old house stories left the shelf. Purchases stay; the products just stop selling.
update products
set active = false
where story_slug in ('o-bilhete', 'a-chave', 'a-mare', 'a-lampada', 'antes-da-lua')
   or slug in ('pack-biblioteca', 'pack-cafe', 'pack-praia', 'a-lampada', 'bonus-bilhete');
