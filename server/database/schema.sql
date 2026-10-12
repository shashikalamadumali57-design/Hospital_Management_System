CREATE DATABASE IF NOT EXISTS hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_db;

CREATE TABLE IF NOT EXISTS patients (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  date_of_birth DATE NULL,
  phone VARCHAR(32) NULL,
  blood_group VARCHAR(5) NULL,
  last_visit DATETIME NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Waiting',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_patients_name (name), INDEX idx_patients_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS doctors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  schedule VARCHAR(100) NULL,
  appointments_today INT UNSIGNED NOT NULL DEFAULT 0,
  location VARCHAR(100) NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  patient_name VARCHAR(160) NOT NULL,
  doctor_name VARCHAR(160) NULL,
  department VARCHAR(100) NULL,
  room VARCHAR(80) NULL,
  scheduled_at DATETIME NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Confirmed',
  reason VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_appointments_scheduled (scheduled_at), INDEX idx_appointments_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS wards (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  care_type VARCHAR(100) NOT NULL DEFAULT 'General care',
  capacity INT UNSIGNED NOT NULL DEFAULT 0,
  occupied INT UNSIGNED NOT NULL DEFAULT 0,
  lead_nurse VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lab_orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  patient_name VARCHAR(160) NOT NULL,
  test_name VARCHAR(160) NOT NULL,
  ordered_by VARCHAR(160) NULL,
  collected_at DATETIME NULL,
  result TEXT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Processing',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS medicines (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(100) NULL,
  stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
  unit VARCHAR(30) NOT NULL DEFAULT 'units',
  expires_on DATE NULL,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  reorder_level INT UNSIGNED NOT NULL DEFAULT 10,
  status VARCHAR(40) NOT NULL DEFAULT 'In stock',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  patient_name VARCHAR(160) NOT NULL,
  service VARCHAR(180) NOT NULL,
  issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(40) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS staff (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  role VARCHAR(100) NOT NULL,
  department VARCHAR(100) NULL,
  shift VARCHAR(100) NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'On duty',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(100) NULL,
  generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prepared_by VARCHAR(160) NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Ready',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  patient_name VARCHAR(160) NOT NULL,
  reason VARCHAR(255) NULL,
  bed VARCHAR(40) NULL,
  assigned_nurse VARCHAR(160) NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Awaiting check-in',
  admitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blood_donors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  blood_group VARCHAR(5) NOT NULL,
  location VARCHAR(160) NULL,
  last_donation DATE NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Eligible',
  phone VARCHAR(32) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prescriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  patient_name VARCHAR(160) NOT NULL,
  physician VARCHAR(160) NULL,
  items TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Ready to dispense',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ledger_entries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  account VARCHAR(180) NOT NULL,
  entry_type ENUM('Revenue','Expense') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS insurance_claims (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  patient_name VARCHAR(160) NOT NULL,
  insurer VARCHAR(160) NOT NULL,
  service VARCHAR(180) NOT NULL,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
  submitted_at DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS policies (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(100) NULL,
  owner VARCHAR(160) NULL,
  reviewed_at DATE NULL,
  review_due DATE NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Current',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','doctor','nurse','patient','pharmacist','laboratory','accountant') NOT NULL,
  department VARCHAR(100) NULL,
  status ENUM('Active','Suspended') NOT NULL DEFAULT 'Active',
  last_login DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO patients (public_id, name, date_of_birth, phone, blood_group, last_visit, status) VALUES
('PT-10482', 'Amara Perera', '1992-05-14', '+94 77 248 9183', 'O+', NOW(), 'In consultation'),
('PT-10481', 'Kasun Fernando', '1968-03-02', '+94 71 663 2014', 'A+', NOW(), 'Admitted'),
('PT-10480', 'Nimali Jayasinghe', '1999-11-20', '+94 76 552 3940', 'B+', NOW(), 'Waiting'),
('PT-10479', 'Ruwan de Silva', '1984-07-09', '+94 72 441 8705', 'AB+', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Discharged');

INSERT IGNORE INTO doctors (public_id, name, specialty, schedule, appointments_today, location, status) VALUES
('DR-024', 'Dr. Nadeesha Silva', 'Cardiology', '08:00 AM - 04:00 PM', 12, 'Room 204', 'Available'),
('DR-018', 'Dr. Chamath Dias', 'Neurology', '09:00 AM - 05:00 PM', 9, 'Room 108', 'In consultation'),
('DR-031', 'Dr. Ishan Perera', 'Orthopedics', '08:30 AM - 03:30 PM', 7, 'Room 312', 'Available');

INSERT IGNORE INTO appointments (public_id, patient_name, doctor_name, department, room, scheduled_at, status) VALUES
('APT-0891', 'Amara Perera', 'Dr. Nadeesha Silva', 'Cardiology', 'Room 204', CONCAT(CURDATE(), ' 09:30:00'), 'In progress'),
('APT-0892', 'Nimali Jayasinghe', 'Dr. Chamath Dias', 'Neurology', 'Room 108', CONCAT(CURDATE(), ' 10:00:00'), 'Confirmed'),
('APT-0893', 'Sithmi Wijesuriya', 'Dr. Nadeesha Silva', 'Cardiology', 'Room 204', CONCAT(CURDATE(), ' 10:30:00'), 'Checked in');

INSERT IGNORE INTO wards (public_id, name, care_type, capacity, occupied, lead_nurse) VALUES
('WARD-01', 'General ward A', 'Adult care', 32, 26, 'M. Kumari'),
('WARD-02', 'General ward B', 'Adult care', 28, 19, 'S. Fernando'),
('WARD-03', 'Intensive care', 'Critical care', 16, 14, 'R. Bandara'),
('WARD-04', 'Maternity', 'Maternity care', 20, 11, 'D. Perera');

INSERT IGNORE INTO medicines (public_id, name, category, stock_quantity, unit, expires_on, unit_price, reorder_level, status) VALUES
('MED-1148', 'Amoxicillin 500mg', 'Antibiotics', 24, 'packs', '2027-02-18', 1240, 10, 'In stock'),
('MED-1093', 'Metformin 850mg', 'Diabetes care', 8, 'packs', '2027-01-05', 890, 12, 'Low stock'),
('MED-1038', 'Atorvastatin 20mg', 'Cardiology', 41, 'packs', '2027-03-22', 1560, 10, 'In stock');

INSERT IGNORE INTO staff (public_id, name, role, department, shift, status) VALUES
('ST-0102', 'M. Kumari', 'Senior nurse', 'General ward A', '07:00 AM - 03:00 PM', 'On duty'),
('ST-0141', 'R. Bandara', 'Nurse', 'Intensive care', '07:00 AM - 03:00 PM', 'On duty'),
('ST-0068', 'P. Wickramasinghe', 'Lab technician', 'Laboratory', '08:00 AM - 04:00 PM', 'On duty');
