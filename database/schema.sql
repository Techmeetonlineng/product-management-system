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
    'Rejected',
    'Suspended'
) DEFAULT 'Pending',

    email_verified BOOLEAN DEFAULT FALSE,

    last_login DATETIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_roles
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)

);