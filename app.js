const express = require('express');
const path = require('path');
const fs = require('fs');

const employees = require('./src/employees.json');


const app = express();

// view engine setup

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/employees', (req, res) => {
  res.status(200).send(employees);
});

app.post('/employees', async (req, res) => {
  console.log(req);

  const employee = req.body;
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
  const employee = employees.find(employee => employee.id === Number(id));
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
