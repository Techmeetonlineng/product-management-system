

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status_enum') THEN
        CREATE TYPE account_status_enum AS ENUM (
            'Pending',
            'Approved',
            'Rejected',
            'Suspended'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status_enum') THEN
        CREATE TYPE approval_status_enum AS ENUM (
            'Pending',
            'Approved',
            'Rejected'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status_enum') THEN
        CREATE TYPE product_status_enum AS ENUM (
            'Available',
            'Unavailable'
        );
    END IF;
END $$;



CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROLES
-- =====================================================

CREATE TABLE IF NOT EXISTS roles (

    role_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    role_name VARCHAR(50) NOT NULL UNIQUE,

    description VARCHAR(255)

);


CREATE TABLE IF NOT EXISTS users (

    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    role_id INT NOT NULL,

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    phone VARCHAR(20),

    password VARCHAR(255) NOT NULL,

    account_status account_status_enum DEFAULT 'Pending',

    email_verified BOOLEAN DEFAULT FALSE,

    reset_token VARCHAR(255) NULL,

    reset_token_expires_at TIMESTAMP NULL,

    last_login TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_roles
        FOREIGN KEY (role_id)
        REFERENCES roles (role_id)

);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();



CREATE TABLE IF NOT EXISTS categories (

    category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    category_name VARCHAR(150) NOT NULL UNIQUE,

    description VARCHAR(255),

    status VARCHAR(20) DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS products (

    product_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    vendor_id INT NOT NULL,

    category_id INT NOT NULL,

    product_name VARCHAR(150) NOT NULL,

    description TEXT,

    sku VARCHAR(100),

    price NUMERIC(12, 2) NOT NULL,

    quantity INT NOT NULL DEFAULT 0,

    image VARCHAR(255) NULL,

    approval_status approval_status_enum DEFAULT 'Pending',

    product_status product_status_enum DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_products_price_non_negative
        CHECK (price >= 0),

    CONSTRAINT chk_products_quantity_non_negative
        CHECK (quantity >= 0),

    CONSTRAINT fk_products_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories (category_id)

);

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


CREATE TABLE IF NOT EXISTS notifications (

    notification_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS idx_users_role_id ON users (role_id);
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users (account_status);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products (vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_approval_status ON products (approval_status);
CREATE INDEX IF NOT EXISTS idx_products_product_status ON products (product_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);


CREATE INDEX IF NOT EXISTS idx_products_approval_product_status
    ON products (approval_status, product_status);


CREATE INDEX IF NOT EXISTS idx_users_reset_token
    ON users (reset_token)
    WHERE reset_token IS NOT NULL;

