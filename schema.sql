DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    item_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(10, 2),
    stock_quantity INTEGER,
    product_sales DECIMAL(10,2)

);

CREATE TABLE departments (
    department_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    derpartment_name VARCHAR(100),
    over_head_cost DECIMAL(10,2)
)