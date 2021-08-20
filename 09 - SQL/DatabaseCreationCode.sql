DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    dept_no varchar(5) NOT NULL,
    dep_name varchar(30) NOT NULL,
    last_updated timestamp DEFAULT localtimestamp,
    CONSTRAINT pk_departments PRIMARY KEY (
        dept_no
     )
);

DROP TABLE IF EXISTS titles;
CREATE TABLE titles (
    title_id varchar(5) NOT NULL,
    title varchar(30) NOT NULL,
    last_updated timestamp DEFAULT localtimestamp,
    CONSTRAINT pk_titles PRIMARY KEY (
        title_id
     )
);

DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
    emp_no int NOT NULL,
    emp_title varchar(5) NOT NULL,
    birth_date date NOT NULL,
    first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
    sex varchar(1) NOT NULL,
    hire_date date NOT NULL,
    last_updated timestamp DEFAULT localtimestamp,
    CONSTRAINT pk_employees PRIMARY KEY (
        emp_no
     )
);

DROP TABLE IF EXISTS dept_emp;
CREATE TABLE dept_emp (
    emp_no int NOT NULL,
    dept_no varchar(5) NOT NULL,
    last_updated timestamp DEFAULT localtimestamp,
    CONSTRAINT pk_dept_emp PRIMARY KEY (
        emp_no,dept_no
     )
);

DROP TABLE IF EXISTS dept_manager;
CREATE TABLE dept_manager (
    dept_no varchar(5) NOT NULL,
	emp_no int NOT NULL,    
    last_updated timestamp DEFAULT localtimestamp,
    CONSTRAINT pk_dept_manager PRIMARY KEY (
        dept_no,emp_no
     )
);

DROP TABLE IF EXISTS salaries;
CREATE TABLE salaries (
    emp_no int NOT NULL,
    salary int NOT NULL,
    last_updated timestamp DEFAULT localtimestamp,
    CONSTRAINT pk_salaries PRIMARY KEY (
        emp_no,salary
     )
);

ALTER TABLE employees ADD CONSTRAINT fk_employees_emp_title FOREIGN KEY(emp_title)
REFERENCES titles (title_id);

ALTER TABLE dept_emp ADD CONSTRAINT fk_dept_emp_emp_no FOREIGN KEY(emp_no)
REFERENCES employees (emp_no);

ALTER TABLE dept_emp ADD CONSTRAINT fk_dept_emp_dept_no FOREIGN KEY(dept_no)
REFERENCES departments (dept_no);

ALTER TABLE dept_manager ADD CONSTRAINT fk_dept_manager_emp_no FOREIGN KEY(emp_no)
REFERENCES employees (emp_no);

ALTER TABLE dept_manager ADD CONSTRAINT fk_dept_manager_dept_no FOREIGN KEY(dept_no)
REFERENCES departments (dept_no);

ALTER TABLE salaries ADD CONSTRAINT fk_salaries_emp_no FOREIGN KEY(emp_no)
REFERENCES employees (emp_no);