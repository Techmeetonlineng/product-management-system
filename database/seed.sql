USE product_management_system;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE activity_logs;
TRUNCATE TABLE notifications;
TRUNCATE TABLE reviews;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE product_approvals;
TRUNCATE TABLE product_inventory;
TRUNCATE TABLE product_images;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================
-- ROLES
-- =====================================

INSERT INTO roles(role_id, role_name, description)
VALUES
(1,'Administrator','System Administrator'),
(2,'Vendor','Marketplace Vendor'),
(3,'Customer','Marketplace Customer');

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
VALUES
(
1,
1,
'System',
'Administrator',
'admin@pms.com',
'08000000000',
'$2b$10$0dK6QqNfGxj5pYkqY5L6CeP7I4mR6l2P8Q8v0XQ2Jf2mA4mD9kP7a',
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
'$2b$10$0dK6QqNfGxj5pYkqY5L6CeP7I4mR6l2P8Q8v0XQ2Jf2mA4mD9kP7a',
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
'$2b$10$0dK6QqNfGxj5pYkqY5L6CeP7I4mR6l2P8Q8v0XQ2Jf2mA4mD9kP7a',
'Approved',
TRUE
);

ALTER TABLE roles AUTO_INCREMENT=4;
ALTER TABLE users AUTO_INCREMENT=4;

-- =====================================
-- CATEGORIES
-- =====================================

INSERT INTO categories(category_id,category_name,description)
VALUES
(1,'Electronics','Electronic Gadgets'),
(2,'Fashion','Fashion Products'),
(3,'Phones','Mobile Phones'),
(4,'Computers','Desktop and Laptop'),
(5,'Shoes','Footwear'),
(6,'Bags','Travel Bags'),
(7,'Accessories','Accessories'),
(8,'Sports','Sports Equipment'),
(9,'Beauty','Beauty Products'),
(10,'Home Appliances','Kitchen Equipment');

ALTER TABLE categories AUTO_INCREMENT=11;

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

ALTER TABLE products AUTO_INCREMENT=4;

-- =====================================
-- PRODUCT IMAGES
-- =====================================

INSERT INTO product_images
(product_id,image_path,is_primary)
VALUES
(1,'uploads/products/a56.jpg',TRUE),
(2,'uploads/products/nike.jpg',TRUE),
(3,'uploads/products/hp.jpg',TRUE);

-- =====================================
-- PRODUCT INVENTORY
-- =====================================

INSERT INTO product_inventory
(product_id,quantity_available,reorder_level)
VALUES
(1,20,5),
(2,35,10),
(3,10,3);

-- =====================================
-- VERIFY
-- =====================================

SELECT * FROM roles;
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM products;
SELECT * FROM product_inventory;