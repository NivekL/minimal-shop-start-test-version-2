const path = require('path');
const express = require('express');
const app = express();

// Serve dist/build folder
app.use(express.static(path.join(__dirname, '../dist')));

// Api
let products = require(path.join(__dirname, 'dummy-products.json'));
app.get('/api/products', (req, res) => {
  res.json(products);
});
app.get('/api/categories', (req, res) => {
  res.json([...new Set(products.map(x => x.category))].map(x => x[0].toUpperCase() + x.slice(1)));
});

// Make hard reloads work
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(4000, () => 'Listening on port 4000');