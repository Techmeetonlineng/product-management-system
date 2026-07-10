-- =====================================================
-- PRODUCT MANAGEMENT SYSTEM FOR ELECTRONIC MARKETPLACE
-- Database Schema
-- Author: TechMeet
-- =====================================================

DROP DATABASE IF EXISTS product_management_system;

CREATE DATABASE product_management_system;

USE product_management_system;

-- =====================================================
-- ROLES
-- =====================================================

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,

    role_id INT NOT NULL,

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    phone VARCHAR(20),

    password VARCHAR(255) NOT NULL,

    account_status ENUM(
        'Pending',
        'Approved',
        'Suspended'
    ) DEFAULT 'Pending',

    email_verified BOOLEAN DEFAULT FALSE,

    last_login DATETIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_roles
        FOREIGN KEY(role_id)
        REFERENCES roles(role_id)
);

-- =====================================================
-- CATEGORIES
-- =====================================================

CREATE TABLE categories (

    category_id INT AUTO_INCREMENT PRIMARY KEY,

    category_name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    status ENUM(
        'Active',
        'Inactive'
    ) DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- PRODUCTS
-- =====================================================

CREATE TABLE products (

    product_id INT AUTO_INCREMENT PRIMARY KEY,

    vendor_id INT NOT NULL,

    category_id INT NOT NULL,

    product_name VARCHAR(150) NOT NULL,

    description TEXT,

    sku VARCHAR(100) UNIQUE,

    price DECIMAL(12,2) NOT NULL,

    quantity INT DEFAULT 0,

    approval_status ENUM(
        'Pending',
        'Approved',
        'Rejected'
    ) DEFAULT 'Pending',

    product_status ENUM(
        'Available',
        'Out of Stock',
        'Archived'
    ) DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_vendor
        FOREIGN KEY(vendor_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_products_category
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id)

);

-- =====================================================
-- PRODUCT IMAGES
-- =====================================================

CREATE TABLE product_images (

    image_id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    image_path VARCHAR(255) NOT NULL,

    is_primary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_images
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE

);

-- =====================================================
-- PRODUCT INVENTORY
-- =====================================================

CREATE TABLE product_inventory (

    inventory_id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL UNIQUE,

    quantity_available INT DEFAULT 0,

    reorder_level INT DEFAULT 5,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE

);

-- =====================================================
-- PRODUCT APPROVALS
-- =====================================================

CREATE TABLE product_approvals (

    approval_id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    admin_id INT NOT NULL,

    approval_status ENUM(
        'Approved',
        'Rejected'
    ),

    remarks TEXT,

    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pa_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id),

    CONSTRAINT fk_pa_admin
        FOREIGN KEY(admin_id)
        REFERENCES users(user_id)

);

-- =====================================================
-- CARTS
-- =====================================================

CREATE TABLE carts (

    cart_id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_customer
        FOREIGN KEY(customer_id)
        REFERENCES users(user_id)

);

-- =====================================================
-- CART ITEMS
-- =====================================================

CREATE TABLE cart_items (

    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,

    cart_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity INT DEFAULT 1,

    CONSTRAINT fk_cartitem_cart
        FOREIGN KEY(cart_id)
        REFERENCES carts(cart_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cartitem_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)

);

-- =====================================================
-- ORDERS
-- =====================================================

CREATE TABLE orders (

    order_id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,

    total_amount DECIMAL(12,2) NOT NULL,

    payment_status ENUM(
        'Pending',
        'Paid',
        'Cancelled'
    ) DEFAULT 'Pending',

    order_status ENUM(
        'Pending',
        'Processing',
        'Delivered'
    ) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_customer
        FOREIGN KEY(customer_id)
        REFERENCES users(user_id)

);

-- =====================================================
-- ORDER ITEMS
-- =====================================================

CREATE TABLE order_items (

    order_item_id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity INT,

    unit_price DECIMAL(12,2),

    subtotal DECIMAL(12,2),

    CONSTRAINT fk_orderitems_order
        FOREIGN KEY(order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_orderitems_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)

);

-- =====================================================
-- REVIEWS
-- =====================================================

CREATE TABLE reviews (

    review_id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    customer_id INT NOT NULL,

    rating INT CHECK (rating BETWEEN 1 AND 5),

    comment TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_customer
        FOREIGN KEY(customer_id)
        REFERENCES users(user_id)

);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (

    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(150),

    message TEXT,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE

);

-- =====================================================
-- ACTIVITY LOGS
-- =====================================================

CREATE TABLE activity_logs (

    log_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    activity VARCHAR(255),

    ip_address VARCHAR(45),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL

);