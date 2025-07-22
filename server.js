const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let users = [];

// Home route → form.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// API test page → api.html
app.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'api.html'));
});

// Handle form submission from form.html
app.post('/submit', (req, res) => {
  const { fullname, email, age, password } = req.body;

  if (!fullname || !email || !age || !password) {
    return res.status(400).send("All fields are required.");
  }

  console.log("Form submitted via /submit:", { fullname, email, age });
  res.send(`
    <h2>Form Submitted Successfully</h2>
    <a href="/">Go back</a>
  `);
});

// REST API: Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// REST API: Create user
app.post('/api/users', (req, res) => {
  const { fullname, email, age } = req.body;
  if (!fullname || !email || !age) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const user = { id: Date.now(), fullname, email, age };
  users.push(user);
  res.status(201).json(user);
});

// REST API: Delete user
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter(user => user.id !== userId);
  res.json({ message: 'User deleted' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
