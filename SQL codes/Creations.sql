CREATE TABLE cities (
    zip_code INT PRIMARY KEY,
    city VARCHAR(30),
    created_at DATETIME DEFAULT getdate(),
    updated_at DATETIME NULL
)


CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(50),
    surname VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(8)
        CONSTRAINT ck_roles CHECK (role IN (\'admin\', \'manager\', \'customer\')),
    zip INT,
    created_at DATETIME DEFAULT getdate(),
    updated_at DATETIME NULL,
    CONSTRAINT fk_users_zip FOREIGN KEY (zip) REFERENCES cities(zip_code) ON DELETE CASCADE,
)


 CREATE TABLE categories (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(30),
    created_at DATETIME DEFAULT getdate(),
    updated_at DATETIME NULL
)


 CREATE TABLE products (
    id INT PRIMARY KEY IDENTITY(1,1),
    category_id INT,
    name VARCHAR(50),
    price MONEY,
    description VARCHAR(MAX),
    stock INT,
    picture VARCHAR(MAX),
    created_at DATETIME DEFAULT getdate(),
    updated_at DATETIME NULL,
    CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
)


CREATE TABLE orders (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    payment_type VARCHAR(5)
        CONSTRAINT CK_payment_type CHECK (payment_type IN ('EFT', 'cash', 'credit card')),
    total_price MONEY,
    created_at DATETIME DEFAULT getdate(),
    updated_at DATETIME NULL,
    CONSTRAINT fk_orders_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
)


CREATE TABLE order_meta (
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT UNIQUE ,
    product_info VARCHAR(MAX),
    address VARCHAR(MAX),
    created_at DATETIME DEFAULT getdate(),
    updated_at DATETIME NULL,
)

CREATE TABLE sessions (
    sess_id VARCHAR(255) UNIQUE,
    user_id INT UNIQUE,
    created_at DATETIME DEFAULT getdate(),
    expired_at DATETIME,
    CONSTRAINT fk_sessions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
)


       
CREATE TABLE deleted_orders_table (
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT UNIQUE,
    user_id INT,
    payment_type VARCHAR(5),
    total_price MONEY,
    product_info VARCHAR(MAX),
    deleted_At DATETIME DEFAULT getdate(),
    CONSTRAINT fk_deleted_orders_table_user_id FOREIGN KEY (user_id) REFERENCES users(id),
)