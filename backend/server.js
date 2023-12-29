const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();


app.use(bodyParser.json());
app.use(cors()); // Enable CORS

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Endpoint to get all orders
app.get('/api/orders', (req, res) => {
  fs.readFile('mockData.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const orders = JSON.parse(data);
      res.json(orders);
    }
  });
});

// Endpoint to get a specific order by ID
app.get('/api/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  fs.readFile('mockData.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const orders = JSON.parse(data);
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
