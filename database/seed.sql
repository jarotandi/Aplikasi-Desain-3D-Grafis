insert into products (name, slug, category, description, base_price, starting_price, moq, production_time_min, production_time_max, has_2d_mockup, has_3d_mockup, image_url)
values
('T-shirt Cotton Combed 24s','t-shirt-cotton-combed-24s','Clothing','Kaos cotton combed premium untuk event dan brand merch.',65000,65000,12,5,10,true,true,'https://placehold.co/900x700/0f766e/ffffff?text=T-Shirt'),
('Hoodie Fleece','hoodie-fleece','Clothing','Hoodie fleece premium untuk merchandise.',185000,185000,12,7,14,true,true,'https://placehold.co/900x700/334155/ffffff?text=Hoodie'),
('Tote Bag Canvas','tote-bag-canvas','Merchandise','Tote bag canvas untuk event kit.',35000,35000,25,5,8,true,true,'https://placehold.co/900x700/b45309/ffffff?text=Tote'),
('Mug Ceramic','mug-ceramic','Merchandise','Mug keramik full color.',28000,28000,12,3,6,true,true,'https://placehold.co/900x700/2563eb/ffffff?text=Mug'),
('Tumbler Stainless','tumbler-stainless','Merchandise','Tumbler stainless corporate gift.',85000,85000,24,7,12,true,true,'https://placehold.co/900x700/0e7490/ffffff?text=Tumbler'),
('Lanyard Custom','lanyard-custom','Event Kit','Lanyard polyester full color.',12000,12000,50,4,7,true,false,'https://placehold.co/900x700/7c3aed/ffffff?text=Lanyard'),
('ID Card PVC','id-card-pvc','Event Kit','ID card PVC custom.',9000,9000,50,2,5,true,false,'https://placehold.co/900x700/059669/ffffff?text=ID+Card'),
('Sticker Vinyl','sticker-vinyl','Packaging','Sticker vinyl tahan air.',15000,15000,20,2,4,true,false,'https://placehold.co/900x700/db2777/ffffff?text=Sticker'),
('Packaging Box','packaging-box','Packaging','Box packaging custom UMKM.',45000,45000,50,7,14,true,true,'https://placehold.co/900x700/92400e/ffffff?text=Box'),
('Paper Bag','paper-bag','Packaging','Paper bag custom retail.',18000,18000,50,7,12,true,true,'https://placehold.co/900x700/a16207/ffffff?text=Paper+Bag'),
('Coffee Cup Sleeve','coffee-cup-sleeve','F&B Branding','Sleeve gelas kopi custom.',2500,2500,250,5,9,true,true,'https://placehold.co/900x700/78350f/ffffff?text=Cup+Sleeve'),
('Trophy 3D Print','trophy-3d-print','3D Printing','Trophy custom berbasis 3D print.',175000,175000,1,4,8,false,true,'https://placehold.co/900x700/475569/ffffff?text=3D+Trophy'),
('Keychain 3D Print','keychain-3d-print','3D Printing','Gantungan kunci custom 3D.',18000,18000,10,2,4,false,true,'https://placehold.co/900x700/0f766e/ffffff?text=3D+Keychain'),
('Logo Stand 3D Print','logo-stand-3d-print','3D Printing','Logo stand custom untuk display.',125000,125000,1,3,6,false,true,'https://placehold.co/900x700/0e7490/ffffff?text=Logo+Stand'),
('Backdrop Event','backdrop-event','Event Kit','Backdrop event panggung dan booth.',450000,450000,1,3,7,true,false,'https://placehold.co/900x700/1d4ed8/ffffff?text=Backdrop');

insert into product_variants (product_id, name, sku, material, color, size, price_modifier)
select id, 'Default Variant', upper(replace(slug,'-','_')), category, 'Custom', 'Standard', 0 from products;

insert into product_knowledge (product_id, materials, print_methods, design_areas, file_requirements, pricing_notes, production_constraints, recommended_use_cases, warnings, faq, ai_context)
select
  id,
  '["Cotton Combed 24s","Canvas","Ceramic","PLA","Kraft"]',
  '["DTF","DTG","Screen Printing","Digital Print","Sublimation","FDM","Resin Print"]',
  '["Front area","Back area","Side label","Base area"]',
  '["PNG transparent 300 DPI","SVG","PDF","AI/CDR"]',
  '["qty >= 50 discount 10%","qty >= 100 discount 15%","rush order +20%"]',
  '["Artwork must stay inside printable area","3D thickness minimum 3mm","keychain hole minimum 4mm"]',
  '["event","UMKM","corporate gift","community","brand merch"]',
  '["avoid placing design too close to seam or cut line","thin 3D parts may break"]',
  '[{"question":"Apakah bisa custom?","answer":"Bisa, ikuti MOQ dan file requirement."}]',
  name || ' category ' || category || ' MOQ ' || moq || ' production ' || production_time_min || '-' || production_time_max || ' days.'
from products;

insert into pricing_rules (product_id, rule_name, rule_type, conditions, formula)
select id, 'Default quantity and rush rule', 'quantity_discount', '{"tiers":[{"min":50,"discount":0.1},{"min":100,"discount":0.15}]}', '{"rush_fee":0.2,"margin":0.18}' from products;
