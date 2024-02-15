const express = require('express');
const fs = require('fs');
const cors = require("cors")
const app = express();
const PORT = 8000;

app.use(express.json());

// Middleware to handle CORS (Cross-Origin Resource Sharing) if necessary
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(cors());

// Route to get all data
app.get('/alldata', (req, res) => {
  fs.readFile('./Inventories.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Route to add new data
app.post('/data', (req, res) => {
  fs.readFile('./Inventories.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const jsonData = JSON.parse(data);
    jsonData.Inventories.push(req.body.inputData);
    fs.writeFile('./Inventories.json', JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        console.error('Error writing data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.status(201).json({status:201, message: 'Data added successfully' });
    });
  });
});

// Route to update data
app.put('/data/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile('./Inventories.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const jsonData = JSON.parse(data);
   
    const index = jsonData?.Inventories?.findIndex(item => item._id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Data not found' });
      return;
    }

    jsonData.Inventories[index] = req.body.inputData;

    fs.writeFile('./Inventories.json', JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        console.error('Error writing data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({status:200, message: 'Data updated successfully' });
    });
  });
});


app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile('./Inventories.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const jsonData = JSON.parse(data);
   
    const index = jsonData?.Inventories?.findIndex(item => item._id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Data not found' });
      return;
    }

    // Remove the item from the array
    jsonData.Inventories.splice(index, 1);

    fs.writeFile('./Inventories.json', JSON.stringify(jsonData, null, 2), err => {
      if (err) {
        console.error('Error writing data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ status: 200, message: 'Data deleted successfully' });
    });
  });
});


app.listen(PORT,"localhost", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
