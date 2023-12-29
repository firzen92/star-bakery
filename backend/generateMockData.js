const fs = require('fs');
const path = require('path');

// Function to generate random date within a given range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to generate random order data
function generateOrderData() {
  const itemTypes = ['Cake', 'Cookies', 'Muffins'];
  const orderStates = ['Created', 'Shipped', 'Delivered', 'Canceled'];

  const orders = [];

  for (let i = 1; i <= 10000; i++) {
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const orderState = orderStates[Math.floor(Math.random() * orderStates.length)];
    const lastUpdateTime = randomDate(new Date(new Date() - 30 * 24 * 60 * 60 * 1000), new Date());
    const branch = Math.floor(Math.random() * 1000) + 1; // Branch ID from 1 to 1000
    const customer = `customer_${i}`;
    const totalValue = itemType === 'Cake' ? 500 : (itemType === 'Cookies' ? 50 : 100);

    const order = {
      itemType,
      orderState,
      lastUpdateTime,
      branch,
      customer,
      totalValue,
    };

    orders.push(order);
  }

  // Sort orders based on lastUpdateTime in ascending order
  orders.sort((a, b) => a.lastUpdateTime - b.lastUpdateTime);

  return orders;
}

// Generate mock data
const mockData = generateOrderData();

// Save mock data as JSON
const outputPath = path.join(__dirname, 'mockData.json');
fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2));

console.log(`Mock data generated and saved to ${outputPath}`);
