-- ============================================================================
-- Rot Pet Shop — Datos semilla para desarrollo y pruebas locales
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- ROLES
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO roles (id, name, permissions) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'superadmin', '{"all": true}'),
    ('a0000000-0000-0000-0000-000000000002', 'admin',      '{"products": true, "orders": true, "users": true, "blog": true, "coupons": true, "reports": true, "settings": true}'),
    ('a0000000-0000-0000-0000-000000000003', 'client',     '{"orders": true, "reviews": true, "wishlist": true}')
ON CONFLICT (name) DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- USERS (usuarios de prueba)
-- Nota: en producción el id coincide con auth.users.id de Supabase Auth.
-- Para pruebas locales usamos IDs fijos.
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO users (id, email, full_name, role_id, status) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'admin@rot.pet',    'Admin RotPet',     'a0000000-0000-0000-0000-000000000001', 'active'),
    ('b0000000-0000-0000-0000-000000000002', 'staff@rot.pet',    'Staff RotPet',     'a0000000-0000-0000-0000-000000000002', 'active'),
    ('b0000000-0000-0000-0000-000000000003', 'cliente@test.com', 'María González',   'a0000000-0000-0000-0000-000000000003', 'active'),
    ('b0000000-0000-0000-0000-000000000004', 'juan@test.com',    'Juan Pérez',       'a0000000-0000-0000-0000-000000000003', 'active'),
    ('b0000000-0000-0000-0000-000000000005', 'ana@test.com',     'Ana Rodríguez',    'a0000000-0000-0000-0000-000000000003', 'active'),
    ('b0000000-0000-0000-0000-000000000006', 'carlos@test.com',  'Carlos Mendoza',   'a0000000-0000-0000-0000-000000000003', 'active'),
    ('b0000000-0000-0000-0000-000000000007', 'laura@test.com',   'Laura Sánchez',    'a0000000-0000-0000-0000-000000000003', 'active')
ON CONFLICT (email) DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- COUNTRIES & STATES (México como ejemplo principal)
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO countries (id, name, code) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'México', 'MX'),
    ('c0000000-0000-0000-0000-000000000002', 'Estados Unidos', 'US'),
    ('c0000000-0000-0000-0000-000000000003', 'Colombia', 'CO')
ON CONFLICT (name) DO NOTHING;

INSERT INTO states (id, country_id, name, code) VALUES
    ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Ciudad de México', 'CDMX'),
    ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Jalisco',          'JAL'),
    ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Nuevo León',       'NL'),
    ('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Estado de México',  'MEX'),
    ('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'Puebla',           'PUE'),
    ('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'Guanajuato',       'GTO'),
    ('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', 'Querétaro',        'QRO'),
    ('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', 'Veracruz',         'VER')
ON CONFLICT (country_id, name) DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- PET TYPES
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO pet_types (id, name, slug) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'Perro',   'perro'),
    ('e0000000-0000-0000-0000-000000000002', 'Gato',    'gato'),
    ('e0000000-0000-0000-0000-000000000003', 'Ave',     'ave'),
    ('e0000000-0000-0000-0000-000000000004', 'Pez',     'pez'),
    ('e0000000-0000-0000-0000-000000000005', 'Roedor',  'roedor'),
    ('e0000000-0000-0000-0000-000000000006', 'Reptil',  'reptil')
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- CATEGORIES
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, status) VALUES
    ('f0000000-0000-0000-0000-000000000001', 'Alimento Seco',       'alimento-seco',       'active'),
    ('f0000000-0000-0000-0000-000000000002', 'Alimento Húmedo',     'alimento-humedo',     'active'),
    ('f0000000-0000-0000-0000-000000000003', 'Snacks y Premios',    'snacks-premios',      'active'),
    ('f0000000-0000-0000-0000-000000000004', 'Juguetes',            'juguetes',            'active'),
    ('f0000000-0000-0000-0000-000000000005', 'Accesorios',          'accesorios',          'active'),
    ('f0000000-0000-0000-0000-000000000006', 'Higiene y Salud',     'higiene-salud',       'active'),
    ('f0000000-0000-0000-0000-000000000007', 'Camas y Descanso',    'camas-descanso',      'active'),
    ('f0000000-0000-0000-0000-000000000008', 'Transportadoras',     'transportadoras',     'active'),
    ('f0000000-0000-0000-0000-000000000009', 'Arena para Gato',     'arena-gato',          'active'),
    ('f0000000-0000-0000-0000-000000000010', 'Ropa para Mascotas',  'ropa-mascotas',       'active')
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- BRANDS
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO brands (id, name, slug, description) VALUES
    ('10000000-0000-0000-0000-000000000001', 'Royal Canin',     'royal-canin',     'Nutrición a la medida de cada mascota'),
    ('10000000-0000-0000-0000-000000000002', 'Purina Pro Plan', 'purina-pro-plan', 'Nutrición avanzada para mascotas'),
    ('10000000-0000-0000-0000-000000000003', 'Hills Science',   'hills-science',   'Nutrición basada en ciencia'),
    ('10000000-0000-0000-0000-000000000004', 'Whiskas',         'whiskas',         'Alimento para gatos'),
    ('10000000-0000-0000-0000-000000000005', 'Pedigree',        'pedigree',        'Alimento para perros'),
    ('10000000-0000-0000-0000-000000000006', 'Kong',            'kong',            'Juguetes resistentes para perros'),
    ('10000000-0000-0000-0000-000000000007', 'Catit',           'catit',           'Productos innovadores para gatos')
ON CONFLICT (name) DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- PRODUCTS (20 productos de ejemplo)
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO products (id, name, sku, price, quantity, category_id, pet_type_id, brand_id, image_url, description, destacado, nuevo, featured, is_new, status) VALUES

-- Alimentos para perro
('20000000-0000-0000-0000-000000000001',
 'Royal Canin Adult Medium', 'RC-ADM-15',
 1250.00, 45,
 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop&auto=format',
 'Alimento seco para perros adultos de raza mediana. Fórmula equilibrada con proteínas de alta calidad para mantener la masa muscular.',
 TRUE, FALSE, TRUE, FALSE, 'active'),

('20000000-0000-0000-0000-000000000002',
 'Purina Pro Plan Cachorro', 'PPP-CACH-7',
 890.00, 30,
 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&auto=format',
 'Alimento seco para cachorros con DHA del aceite de pescado para el desarrollo cerebral y visual.',
 TRUE, TRUE, TRUE, TRUE, 'active'),

('20000000-0000-0000-0000-000000000003',
 'Hills Science Diet Senior', 'HSD-SEN-12',
 1450.00, 20,
 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003',
 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=400&fit=crop&auto=format',
 'Alimento para perros senior con glucosamina y condroitina para articulaciones sanas.',
 FALSE, FALSE, FALSE, FALSE, 'active'),

('20000000-0000-0000-0000-000000000004',
 'Pedigree Vital Protection', 'PED-VP-20',
 650.00, 60,
 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005',
 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop&auto=format',
 'Alimento completo para perros adultos con vitaminas y minerales esenciales.',
 FALSE, FALSE, FALSE, FALSE, 'active'),

-- Alimentos para gato
('20000000-0000-0000-0000-000000000005',
 'Royal Canin Indoor Gato', 'RC-IND-4',
 780.00, 35,
 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&auto=format',
 'Alimento seco para gatos de interior. Reduce el olor de las heces y controla las bolas de pelo.',
 TRUE, FALSE, TRUE, FALSE, 'active'),

('20000000-0000-0000-0000-000000000006',
 'Whiskas Atún Adulto', 'WHK-ATN-3',
 185.00, 80,
 'f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004',
 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=400&h=400&fit=crop&auto=format',
 'Alimento húmedo para gatos adultos sabor atún. Rico en proteínas y taurina.',
 FALSE, TRUE, FALSE, TRUE, 'active'),

('20000000-0000-0000-0000-000000000007',
 'Purina Pro Plan Gato Esterilizado', 'PPP-EST-3',
 650.00, 40,
 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop&auto=format',
 'Alimento seco para gatos esterilizados. Control de peso con alto contenido proteico.',
 FALSE, FALSE, FALSE, FALSE, 'active'),

-- Snacks
('20000000-0000-0000-0000-000000000008',
 'Dentastix Perro Mediano', 'DNTX-MED-28',
 320.00, 100,
 'f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005',
 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&auto=format',
 'Premios dentales para perros medianos. Limpieza dental con uso diario. Pack de 28 unidades.',
 TRUE, FALSE, TRUE, FALSE, 'active'),

('20000000-0000-0000-0000-000000000009',
 'Dreamies Mix Gato', 'DRM-MIX-60',
 95.00, 120,
 'f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', NULL,
 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop&auto=format',
 'Snacks crujientes por fuera y cremosos por dentro para gatos. Mezcla de sabores.',
 FALSE, TRUE, FALSE, TRUE, 'active'),

-- Juguetes
('20000000-0000-0000-0000-000000000010',
 'Kong Classic Rojo L', 'KONG-CL-L',
 450.00, 25,
 'f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006',
 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=400&fit=crop&auto=format',
 'Juguete de caucho natural ultra resistente. Ideal para perros que mastican con fuerza. Rellena con premios.',
 TRUE, FALSE, TRUE, FALSE, 'active'),

('20000000-0000-0000-0000-000000000011',
 'Catit Senses Play Circuit', 'CAT-SPC-1',
 520.00, 15,
 'f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000007',
 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop&auto=format',
 'Circuito de juego interactivo para gatos. Estimula los sentidos con pelota iluminada.',
 FALSE, TRUE, FALSE, TRUE, 'active'),

('20000000-0000-0000-0000-000000000012',
 'Cuerda Dental para Perro', 'CDA-PER-1',
 135.00, 50,
 'f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', NULL,
 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&h=400&fit=crop&auto=format',
 'Cuerda de algodón con nudos para juego y limpieza dental. Resistente y duradera.',
 FALSE, FALSE, FALSE, FALSE, 'active'),

-- Accesorios
('20000000-0000-0000-0000-000000000013',
 'Collar Ajustable Nylon L', 'COL-NYL-L',
 189.00, 40,
 'f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000001', NULL,
 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?w=400&h=400&fit=crop&auto=format',
 'Collar de nylon ajustable con hebilla de liberación rápida. Talla grande, varios colores.',
 FALSE, FALSE, FALSE, FALSE, 'active'),

('20000000-0000-0000-0000-000000000014',
 'Fuente de Agua Catit', 'CAT-FA-3L',
 899.00, 12,
 'f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000007',
 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400&h=400&fit=crop&auto=format',
 'Fuente de agua con filtro triple para gatos. Capacidad 3 litros. Estimula la hidratación.',
 TRUE, TRUE, TRUE, TRUE, 'active'),

-- Higiene y salud
('20000000-0000-0000-0000-000000000015',
 'Shampoo Antipulgas 500ml', 'SHP-AP-500',
 175.00, 55,
 'f0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000001', NULL,
 'https://images.unsplash.com/photo-1583337130417-13571de52bba?w=400&h=400&fit=crop&auto=format',
 'Shampoo antipulgas y garrapatas para perros. Fórmula suave con pH balanceado. 500ml.',
 FALSE, FALSE, FALSE, FALSE, 'active'),

('20000000-0000-0000-0000-000000000016',
 'Pipeta Frontline Plus Perro', 'FLP-PER-3',
 580.00, 30,
 'f0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000001', NULL,
 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop&auto=format',
 'Pipeta antiparasitaria para perros de 10-20kg. Protección por 30 días. Pack de 3 pipetas.',
 FALSE, TRUE, FALSE, TRUE, 'active'),

-- Camas
('20000000-0000-0000-0000-000000000017',
 'Cama Ortopédica Perro Grande', 'CAM-ORT-G',
 1350.00, 10,
 'f0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000001', NULL,
 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=400&h=400&fit=crop&auto=format',
 'Cama ortopédica con espuma viscoelástica para perros grandes. Funda lavable. Ideal para perros senior.',
 TRUE, FALSE, TRUE, FALSE, 'active'),

('20000000-0000-0000-0000-000000000018',
 'Cama Iglú para Gato', 'CAM-IGL-M',
 450.00, 18,
 'f0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000002', NULL,
 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400&h=400&fit=crop&auto=format',
 'Cama tipo iglú de felpa suave para gatos. Mantiene el calor, fácil de lavar.',
 FALSE, TRUE, FALSE, TRUE, 'active'),

-- Arena para gato
('20000000-0000-0000-0000-000000000019',
 'Arena Aglomerante Premium 10kg', 'ARN-AGL-10',
 280.00, 70,
 'f0000000-0000-0000-0000-000000000009', 'e0000000-0000-0000-0000-000000000002', NULL,
 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=400&h=400&fit=crop&auto=format',
 'Arena aglomerante de arcilla natural. Control de olores avanzado. Bajo en polvo. 10kg.',
 FALSE, FALSE, FALSE, FALSE, 'active'),

-- Transportadora
('20000000-0000-0000-0000-000000000020',
 'Transportadora Rígida M', 'TRP-RIG-M',
 750.00, 14,
 'f0000000-0000-0000-0000-000000000008', NULL, NULL,
 'https://images.unsplash.com/photo-1583160247711-2191776b4b91?w=400&h=400&fit=crop&auto=format',
 'Transportadora de plástico rígido con ventilación. Aprobada para viajes aéreos. Tamaño mediano.',
 FALSE, FALSE, FALSE, FALSE, 'active')

ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- PRODUCT VARIANTS (ejemplo con tallas/pesos)
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO product_variants (id, product_id, sku, price, stock, attributes, status) VALUES
-- Royal Canin Adult Medium - variantes por peso
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'RC-ADM-4',  450.00,  20, '{"peso": "4 kg"}',  'active'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'RC-ADM-10', 850.00,  15, '{"peso": "10 kg"}', 'active'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'RC-ADM-15', 1250.00, 10, '{"peso": "15 kg"}', 'active'),

-- Kong Classic - variantes por talla
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000010', 'KONG-CL-S', 280.00,  10, '{"talla": "S", "color": "Rojo"}', 'active'),
('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000010', 'KONG-CL-M', 350.00,  10, '{"talla": "M", "color": "Rojo"}', 'active'),
('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000010', 'KONG-CL-L', 450.00,  5,  '{"talla": "L", "color": "Rojo"}', 'active'),

-- Collar Nylon - variantes por talla y color
('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000013', 'COL-NYL-S-AZ', 149.00, 15, '{"talla": "S", "color": "Azul"}',    'active'),
('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000013', 'COL-NYL-M-AZ', 169.00, 12, '{"talla": "M", "color": "Azul"}',    'active'),
('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000013', 'COL-NYL-L-RJ', 189.00, 10, '{"talla": "L", "color": "Rojo"}',    'active'),
('30000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000013', 'COL-NYL-L-NG', 189.00, 8,  '{"talla": "L", "color": "Negro"}',   'active')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- ORDERS (pedidos de prueba)
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO orders (id, user_id, total_amount, status, shipping_address, contact_phone, payment_method, notes, created_at) VALUES
('40000000-0000-0000-0000-000000000001',
 'b0000000-0000-0000-0000-000000000003',
 2140.00, 'completed',
 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX, CP 03100',
 '+52 55 1234 5678', 'transferencia', NULL,
 NOW() - INTERVAL '15 days'),

('40000000-0000-0000-0000-000000000002',
 'b0000000-0000-0000-0000-000000000004',
 890.00, 'processing',
 'Calle Revolución 567, Col. Mixcoac, CDMX, CP 03910',
 '+52 55 8765 4321', 'whatsapp', 'Por favor entregar después de las 6pm.',
 NOW() - INTERVAL '3 days'),

('40000000-0000-0000-0000-000000000003',
 'b0000000-0000-0000-0000-000000000005',
 1249.00, 'pending',
 'Blvd. Manuel Ávila Camacho 40, Lomas, CDMX, CP 11000',
 '+52 55 2222 3333', 'efectivo', NULL,
 NOW() - INTERVAL '1 day'),

('40000000-0000-0000-0000-000000000004',
 'b0000000-0000-0000-0000-000000000003',
 320.00, 'shipped',
 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX, CP 03100',
 '+52 55 1234 5678', 'transferencia', 'Regalo para mi perro Max.',
 NOW() - INTERVAL '7 days'),

('40000000-0000-0000-0000-000000000005',
 'b0000000-0000-0000-0000-000000000006',
 1679.00, 'cancelled',
 'Calle Madero 10, Centro, CDMX, CP 06000',
 '+52 55 4444 5555', 'whatsapp', 'Cancelar por favor, compré el producto equivocado.',
 NOW() - INTERVAL '10 days')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- ORDER ITEMS
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
-- Pedido 1: Royal Canin + Kong
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 1, 1250.00),
('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000010', 1, 450.00),
('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', 1, 320.00),

-- Pedido 2: Purina Cachorro
('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 1, 890.00),

-- Pedido 3: Fuente Catit + Cama Iglú
('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000014', 1, 899.00),
('50000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000018', 1, 450.00),

-- Pedido 4: Dentastix
('50000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000008', 1, 320.00),

-- Pedido 5 (cancelado): Cama Ortopédica + Collar
('50000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000017', 1, 1350.00),
('50000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000013', 2, 189.00)
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- REVIEWS
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO reviews (id, producto_id, user_id, nombre_usuario, calificacion, comentario) VALUES
('60000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'María G.',     5, '¡Excelente alimento! A mi perro le encanta y se ve más saludable desde que lo come.'),
('60000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'Juan P.',      4, 'Buena relación calidad-precio, aunque el empaque podría mejorar.'),
('60000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'Ana R.',       5, 'Mi cachorro creció fuerte y sano con este alimento. 100% recomendado.'),
('60000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000003', 'María G.',     5, 'El Kong es indestructible, mi perro lleva meses con él y está como nuevo.'),
('60000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000006', 'Carlos M.',    4, 'Mi gato lo adora, es exigente para comer y este le gusta mucho.'),
('60000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000007', 'Laura S.',     5, 'La fuente es increíble, mi gato bebe mucha más agua desde que la tenemos.'),
('60000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000008', NULL,                                   'Anónimo',      4, 'Los Dentastix son buenos, a mi perro le encantan y se nota que le limpian los dientes.'),
('60000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000004', 'Juan P.',      3, 'La cama es cómoda pero mi perro tardó en acostumbrarse. Material de buena calidad.')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- COUPONS
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO coupons (id, code, discount_type, discount_value, min_purchase, expiration_date, usage_limit, used_count, status) VALUES
('70000000-0000-0000-0000-000000000001', 'BIENVENIDO10', 'percentage', 10.00,  200.00, NOW() + INTERVAL '90 days', 100, 5,  'active'),
('70000000-0000-0000-0000-000000000002', 'MASCOTA50',    'fixed',      50.00,  500.00, NOW() + INTERVAL '30 days', 50,  12, 'active'),
('70000000-0000-0000-0000-000000000003', 'ENVIOGRATIS',  'fixed',      99.00,  300.00, NOW() + INTERVAL '60 days', 200, 30, 'active'),
('70000000-0000-0000-0000-000000000004', 'VERANO20',     'percentage', 20.00,  1000.00, NOW() - INTERVAL '5 days', 50,  48, 'inactive')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- BLOG POSTS
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO blog_posts (id, title, slug, description, content, author, category, status) VALUES
('80000000-0000-0000-0000-000000000001',
 '5 Señales de que tu Perro Necesita Cambiar de Alimento',
 '5-senales-cambiar-alimento-perro',
 'Aprende a identificar cuándo tu perro necesita un cambio en su dieta.',
 '<h2>¿Tu perro necesita un cambio de alimento?</h2><p>A veces nuestras mascotas nos dan señales sutiles de que su alimentación actual no les sienta bien. Aquí te explicamos las 5 señales más comunes:</p><h3>1. Pérdida de brillo en el pelaje</h3><p>Un pelaje opaco y seco puede indicar deficiencias nutricionales...</p><h3>2. Problemas digestivos frecuentes</h3><p>Si tu perro tiene gases o diarrea con regularidad...</p><h3>3. Falta de energía</h3><p>Un perro que de pronto está más cansado de lo normal...</p><h3>4. Picazón constante</h3><p>Las alergias alimentarias se manifiestan en la piel...</p><h3>5. Rechazo del alimento</h3><p>Si tu perro ya no quiere comer su alimento habitual...</p>',
 'Dr. Veterinario RotPet', 'Nutrición', 'published'),

('80000000-0000-0000-0000-000000000002',
 'Guía Completa: Cómo Cepillar los Dientes de tu Gato',
 'guia-cepillar-dientes-gato',
 'Todo lo que necesitas saber para mantener la salud dental de tu gato.',
 '<h2>La salud dental felina</h2><p>El 70% de los gatos mayores de 3 años tienen problemas dentales. Cepillar los dientes de tu gato puede prevenirlos.</p><h3>¿Qué necesitas?</h3><ul><li>Cepillo de dientes para gatos</li><li>Pasta dental veterinaria</li><li>Paciencia</li></ul><h3>Paso a paso</h3><p>Comienza acostumbrando a tu gato al sabor de la pasta dental...</p>',
 'Dra. Felina RotPet', 'Salud', 'published'),

('80000000-0000-0000-0000-000000000003',
 'Los Mejores Juguetes Interactivos para Perros en 2025',
 'mejores-juguetes-interactivos-perros-2025',
 'Descubre los juguetes que mantendrán a tu perro entretenido y estimulado.',
 '<h2>Juguetes que tu perro va a amar</h2><p>Los juguetes interactivos son esenciales para la estimulación mental de tu perro...</p>',
 'Equipo RotPet', 'Entretenimiento', 'published'),

('80000000-0000-0000-0000-000000000004',
 'Preparando tu Hogar para un Nuevo Cachorro',
 'preparando-hogar-nuevo-cachorro',
 'Tips esenciales para recibir a tu nuevo mejor amigo en casa.',
 '<h2>¡Bienvenido a casa!</h2><p>Recibir un cachorro es emocionante, pero requiere preparación...</p>',
 'Equipo RotPet', 'Consejos', 'draft')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- PETS (mascotas de los usuarios de prueba)
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO pets (id, user_id, name, type, breed, birth_date, gender, weight) VALUES
('90000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Max',     'Perro', 'Golden Retriever', '2021-03-15', 'Macho',  32.5),
('90000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'Luna',    'Gato',  'Siamés',           '2022-07-20', 'Hembra', 4.2),
('90000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Rocky',   'Perro', 'Bulldog Francés',  '2020-11-05', 'Macho',  12.8),
('90000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000005', 'Michi',   'Gato',  'Persa',            '2023-01-10', 'Hembra', 3.5),
('90000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000006', 'Thor',    'Perro', 'Pastor Alemán',    '2019-06-28', 'Macho',  38.0)
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- WISHLIST (listas de deseos de prueba)
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO wishlist (user_id, product_id) VALUES
('b0000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000017'),
('b0000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000011'),
('b0000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000014'),
('b0000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000010')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- SETTINGS (configuración por defecto de la tienda)
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO settings (key, value) VALUES
('store_name',                'Rot Pet Shop'),
('store_email',               'info@rot.pet'),
('store_phone',               '+52 55 1234 5678'),
('store_address',             'Av. Ejemplo 123, CDMX, México'),
('store_currency',            'MXN'),
('store_whatsapp',            '5215512345678'),
('shipping_free_threshold',   '500'),
('shipping_standard_cost',    '99'),
('shipping_estimated_days',   '3-5')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- FIN DEL SEED
-- ============================================================================
