-- Create database tables
USE sneaker_shop;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    category_id INT,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Product sizes table
CREATE TABLE IF NOT EXISTS product_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size VARCHAR(10) NOT NULL,
    stock INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    size VARCHAR(10),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert default category
INSERT INTO categories (name, description) VALUES 
('Air Jordan 1', 'Iconic Air Jordan 1 sneakers collection');

-- Insert Air Jordan 1 products (seeders)
INSERT INTO products (name, description, price, image_url, category_id, stock) VALUES
('Air Jordan 1 Retro High OG "Chicago"', 'The iconic Chicago colorway featuring red, white, and black. A timeless classic that started it all.', 180.00, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500', 1, 50),
('Air Jordan 1 Retro High OG "Bred"', 'The legendary Bred (Black/Red) colorway. One of the most sought-after Jordan 1s ever made.', 170.00, 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500', 1, 45),
('Air Jordan 1 Retro High OG "Royal Blue"', 'Classic Royal Blue and Black combination. A must-have for any sneaker collection.', 170.00, 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500', 1, 40),
('Air Jordan 1 Retro High OG "Shadow"', 'The sleek Shadow colorway in black and grey. Perfect for everyday wear.', 160.00, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 1, 55),
('Air Jordan 1 Retro High OG "Pine Green"', 'Fresh Pine Green colorway. A standout addition to the Jordan 1 lineup.', 165.00, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500', 1, 35),
('Air Jordan 1 Retro High OG "University Blue"', 'Clean University Blue colorway inspired by MJs alma mater.', 175.00, 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=500', 1, 30),
('Air Jordan 1 Low "Triple White"', 'Clean all-white low-top silhouette. Versatile and timeless.', 110.00, 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500', 1, 60),
('Air Jordan 1 Mid "Smoke Grey"', 'Smoke Grey mid-top version. Perfect balance of style and comfort.', 125.00, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500', 1, 48);

-- Insert sizes for each product
INSERT INTO product_sizes (product_id, size, stock) VALUES
-- Chicago
(1, '38', 5), (1, '39', 6), (1, '40', 8), (1, '41', 10), (1, '42', 8), (1, '43', 7), (1, '44', 4), (1, '45', 2),
-- Bred
(2, '38', 4), (2, '39', 5), (2, '40', 7), (2, '41', 9), (2, '42', 8), (2, '43', 6), (2, '44', 4), (2, '45', 2),
-- Royal Blue
(3, '38', 4), (3, '39', 5), (3, '40', 6), (3, '41', 8), (3, '42', 7), (3, '43', 5), (3, '44', 3), (3, '45', 2),
-- Shadow
(4, '38', 6), (4, '39', 7), (4, '40', 9), (4, '41', 11), (4, '42', 9), (4, '43', 7), (4, '44', 4), (4, '45', 2),
-- Pine Green
(5, '38', 3), (5, '39', 4), (5, '40', 6), (5, '41', 8), (5, '42', 6), (5, '43', 4), (5, '44', 3), (5, '45', 1),
-- University Blue
(6, '38', 3), (6, '39', 4), (6, '40', 5), (6, '41', 7), (6, '42', 5), (6, '43', 3), (6, '44', 2), (6, '45', 1),
-- Triple White Low
(7, '38', 7), (7, '39', 8), (7, '40', 10), (7, '41', 12), (7, '42', 10), (7, '43', 7), (7, '44', 4), (7, '45', 2),
-- Smoke Grey Mid
(8, '38', 5), (8, '39', 6), (8, '40', 8), (8, '41', 10), (8, '42', 8), (8, '43', 6), (8, '44', 3), (8, '45', 2);

-- Insert demo user (password: demo123)
-- Hash generated with bcrypt for 'demo123'
INSERT INTO users (email, password, first_name, last_name, address, city, postal_code) VALUES
('demo@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.Q7Z5xKoEPz1rW3HKWC', 'Demo', 'User', 'Glavna ulica 1', 'Maribor', '2000');
