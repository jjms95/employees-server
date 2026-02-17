const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const EMPLOYEES_PER_PAGE = 50;

const loadEmployees = () => {
  try {
    const employees = fs.readFileSync('./src/employees.json', 'utf8');
    return JSON.parse(employees);
  } catch (err) {
    console.error(err);
    return [];
  }
};

app.get('/employees', (req, res) => {
  const { name, role, page } = req.query;
  const employees = loadEmployees();

  let employeesList = [...employees].sort((a, b) => a.name.localeCompare(b.name));

  const pageNumber = Number(page) || 0;

  if (name) {
    employeesList = employeesList.filter(employee => employee.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
  }

  if (role) {
    employeesList = employeesList.filter(employee => employee.role === role);
  }

  employeesList = employeesList.slice(pageNumber * EMPLOYEES_PER_PAGE, (pageNumber + 1) * EMPLOYEES_PER_PAGE);
  res.status(200).send(employeesList);
});

app.post('/employees', async (req, res) => {
  const employee = req.body;
  const employees = loadEmployees();

  const employeeExists = employees.find(emp => emp.id === employee.id);
  if (employeeExists) {
    res.status(400).send({ message: 'Employee id already exists' });
    return;
  }

  employees.push(employee);

  try {
    fs.writeFileSync('./src/employees.json', JSON.stringify(employees));
    res.status(200).send({ message: 'Employee created successfully', employee });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating employee', err });
  }
});

app.get('/employees/:id', (req, res) => {
  const { id } = req.params;
  const employees = loadEmployees();
  const employee = employees.find(employee => employee.id === id);
  if (employee) {
    res.status(200).send(employee);
  } else {
    res.status(404).send({ message: 'Employee not found' });
  }
});


app.use('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

module.exports = app;
