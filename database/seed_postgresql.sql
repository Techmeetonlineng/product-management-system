

TRUNCATE TABLE notifications, products, categories, users, roles
RESTART IDENTITY CASCADE;

-- =====================================
-- ROLES
-- =====================================

INSERT INTO roles (role_id, role_name, description)
OVERRIDING SYSTEM VALUE
VALUES
(1, 'Administrator', 'System Administrator'),
(2, 'Vendor', 'Marketplace Vendor'),
(3, 'Customer', 'Marketplace Customer');

-- =====================================
-- USERS
-- =====================================

INSERT INTO users
(
    user_id,
    role_id,
    first_name,
    last_name,
    email,
    phone,
    password,
    account_status,
    email_verified
)
OVERRIDING SYSTEM VALUE
VALUES

(
    1,
    1,
    'System',
    'Administrator',
    'admin@pms.com',
    '08000000000',
    '$2b$10$a2n4Nz/el.0z4/jO7t/Oo.VCQ5yhQM.WUz1gavWjEuAXhJjcNJMsm',
    'Approved',
    TRUE
),

(
    2,
    2,
    'John',
    'Vendor',
    'vendor@pms.com',
    '08011111111',
    '$2b$10$NNWKFAGZyH/rKMYoYa2iheZrxk0hSvFvjrQHJNPclGnPgoqAizhOe',
    'Approved',
    TRUE
),

(
    3,
    3,
    'James',
    'Customer',
    'customer@pms.com',
    '08022222222',
    '$2b$10$T9i5SkuvzxubNBXeHITmH.00q4CzGolrTFI2Gsyda2iPjIY6J.Tay',
    'Approved',
    TRUE
);

-- =====================================
-- CATEGORIES
-- =====================================

INSERT INTO categories (category_id, category_name, description)
OVERRIDING SYSTEM VALUE
VALUES
(1, 'Electronics', 'Electronic Gadgets'),
(2, 'Fashion', 'Fashion Products'),
(3, 'Phones', 'Mobile Phones'),
(4, 'Computers', 'Desktop and Laptop'),
(5, 'Shoes', 'Footwear'),
(6, 'Bags', 'Travel Bags'),
(7, 'Accessories', 'Accessories'),
(8, 'Sports', 'Sports Equipment'),
(9, 'Beauty', 'Beauty Products'),
(10, 'Home Appliances', 'Kitchen Equipment');

-- =====================================
-- PRODUCTS
-- =====================================

INSERT INTO products
(
    product_id,
    vendor_id,
    category_id,
    product_name,
    description,
    sku,
    price,
    quantity,
    approval_status,
    product_status
)
OVERRIDING SYSTEM VALUE
VALUES
(
    1,
    2,
    3,
    'Samsung Galaxy A56',
    'Android Smartphone',
    'SKU1001',
    350000,
    20,
    'Approved',
    'Available'
),
(
    2,
    2,
    5,
    'Nike Sneakers',
    'Running Shoes',
    'SKU1002',
    45000,
    35,
    'Approved',
    'Available'
),
(
    3,
    2,
    4,
    'HP EliteBook',
    'Business Laptop',
    'SKU1003',
    650000,
    10,
    'Approved',
    'Available'
);

-- =====================================
-- RESET IDENTITY SEQUENCES
-- =====================================
-- Equivalent of MySQL's "ALTER TABLE x AUTO_INCREMENT = n" - makes
-- sure the next auto-generated id continues after the explicit ids
-- inserted above.

SELECT setval(pg_get_serial_sequence('roles', 'role_id'), (SELECT MAX(role_id) FROM roles));
SELECT setval(pg_get_serial_sequence('users', 'user_id'), (SELECT MAX(user_id) FROM users));
SELECT setval(pg_get_serial_sequence('categories', 'category_id'), (SELECT MAX(category_id) FROM categories));
SELECT setval(pg_get_serial_sequence('products', 'product_id'), (SELECT MAX(product_id) FROM products));

-- =====================================
-- VERIFY
-- =====================================

SELECT * FROM roles;
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM products;
