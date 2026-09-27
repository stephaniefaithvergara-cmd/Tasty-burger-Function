const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Important for Render

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static('public')); // Serve static files like images, CSS, JS

// --- Burgers Endpoint ---
app.get('/burgers', (req, res) => {
  fs.readFile('app.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('❌ Error reading app.json');
    try {
      const burgers = JSON.parse(data);
      res.json(burgers);
    } catch (e) {
      res.status(500).send('❌ Invalid JSON in app.json');
    }
  });
});

// --- Get Cart Items ---
app.get('/cart', (req, res) => {
  fs.readFile('cart.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('❌ Error reading cart.json');
    try {
      const cart = JSON.parse(data || '[]');
      res.json(cart);
    } catch (e) {
      res.json([]);
    }
  });
});

// --- Add to Cart ---
app.post('/cart', (req, res) => {
  fs.readFile('cart.json', 'utf8', (err, data) => {
    let cart = [];
    if (!err) {
      try {
        cart = JSON.parse(data || '[]');
      } catch (e) {
        cart = [];
      }
    }

    cart.push(req.body);

    fs.writeFile('cart.json', JSON.stringify(cart, null, 2), (err) => {
      if (err) return res.status(500).send('❌ Error saving to cart.json');
      res.json({ message: '✅ Item added to cart!', cart });
    });
  });
});

// --- Remove from Cart ---
app.delete('/cart/:index', (req, res) => {
  const index = parseInt(req.params.index);

  fs.readFile('cart.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('❌ Error reading cart.json');
    let cart = [];
    try {
      cart = JSON.parse(data || '[]');
    } catch (e) {
      cart = [];
    }

    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
    }

    fs.writeFile('cart.json', JSON.stringify(cart, null, 2), (err) => {
      if (err) return res.status(500).send('❌ Error saving cart.json');
      res.json({ message: '🗑️ Item removed from cart!', cart });
    });
  });
});

// --- Serve frontend (very important for Render) ---
app.use(express.static(path.join(__dirname, 'public')));

// Default route: serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start Server ---
app.listen(PORT, () => console.log(`🍔 Server running at: http://localhost:${PORT}`));
