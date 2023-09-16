const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

let persons = [];
// middlewares
app.use(express.json());
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(cors());
app.use(express.static('dist'));

app.get('/api/persons', (req, res) => {
  res.status(200).json(persons);
});

app.get('/info', (req, res) => {
  res.status(200).send(`<h3>Phonebook has info of ${persons.length} people</h3>
<p>${new Date()}</p>
`);
});

// getting a single resource
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  // console.log(id);
  if (!person) {
    res.status(404).json({ error: 'resource not found' });
  }
  res.status(200).json(person);
});

// deleting a single resource

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const people = persons.filter((person) => person.id !== id);
  res.status(200).json(people);
});

// posting new person
app.post('/api/persons', (req, res) => {
  const body = req.body;
  console.log(body);
  const generatedID =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  const findPerson = persons.find((person) => person.name === body.name);
  if (findPerson) {
    return res
      .status(200)
      .json({ error: 'name must be unique as it is already exist' });
  }
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number can not be missing' });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generatedID + 1,
  };

  persons = persons.concat(person);
  res.status(201).json(person);
});

// app.put('/api/persons/:id', (req, res) => {
//   const id = req.params.id;
//   const body = req.body;
//   const person = persons.find((person) => person.id === Number(id));
//   res.status(200).json({ ...person, number: body.number });
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
