CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TABLE products (
	id uuid not null default uuid_generate_v4() primary key,
 	title text not null,
 	description text,
 	price integer
)

CREATE TABLE stocks (
	product_id uuid not null,
 	counter integer,
 	foreign key (product_id) references products(id)
)

INSERT INTO products (title, description, price) VALUES ('BMW', 'X5', '60000');
INSERT INTO products (title, description, price) VALUES ('BMW', '3 Series', '50000');
INSERT INTO products (title, description, price) VALUES ('Audi', 'A5', '70000');
INSERT INTO products (title, description, price) VALUES ('Audi', 'A8', '100000');
INSERT INTO products (title, description, price) VALUES ('VW', 'Passat', '25000');
INSERT INTO products (title, description, price) VALUES ('VW', 'Golf', '35000');

-- INSERT INTO stocks (product_id, counter) VALUES ('f14aa93d-803b-45d8-931f-09e2bf1a21da', 10);
-- INSERT INTO stocks (product_id, counter) VALUES ('c2ccc127-f790-4648-861e-0056616647a9', 5);
-- INSERT INTO stocks (product_id, counter) VALUES ('1b104cd3-aba5-4a6b-a3f3-ec634438e614', 15);
-- INSERT INTO stocks (product_id, counter) VALUES ('f05188ad-9fb8-4f2a-b2d7-2bbe2127b69a', 3);
-- INSERT INTO stocks (product_id, counter) VALUES ('f28487b3-3f7a-474a-8455-8014132e54d1', 4);
-- INSERT INTO stocks (product_id, counter) VALUES ('55e30d3c-ab3e-4e5b-b587-6ec833530831', 1);
