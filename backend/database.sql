-- Create database if not exists
CREATE DATABASE IF NOT EXISTS salary_calculator;

-- Use the database
USE salary_calculator;

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  position VARCHAR(100),
  hire_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create salaries table
CREATE TABLE IF NOT EXISTS salaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  base_salary DECIMAL(12, 2) NOT NULL,
  bonus DECIMAL(12, 2) DEFAULT 0,
  effective_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Insert sample data
INSERT INTO employees (first_name, last_name, email, position, hire_date)
VALUES 
  ('John', 'Doe', 'john.doe@example.com', 'Software Engineer', '2023-01-15'),
  ('Jane', 'Smith', 'jane.smith@example.com', 'Product Manager', '2022-10-01'),
  ('Michael', 'Johnson', 'michael.johnson@example.com', 'UI/UX Designer', '2023-03-22');

INSERT INTO salaries (employee_id, base_salary, bonus, effective_date)
VALUES 
  (1, 85000.00, 5000.00, '2023-01-15'),
  (2, 95000.00, 10000.00, '2022-10-01'),
  (3, 75000.00, 3000.00, '2023-03-22');