-- Fix product image URLs: replace local paths with Unsplash images
-- Run this to fix 404 errors on product images in existing databases

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000001';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000002';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000003';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000004';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000005';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000006';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000007';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000008';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000009';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000010';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000011';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000012';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000013';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000014';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1583337130417-13571de52bba?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000015';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000016';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000017';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000018';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000019';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1583160247711-2191776b4b91?w=400&h=400&fit=crop&auto=format' WHERE id = '20000000-0000-0000-0000-000000000020';

-- Also fix any products that still have broken local paths
UPDATE products SET image_url = '/placeholder.svg' WHERE image_url LIKE '/images/products/%';
