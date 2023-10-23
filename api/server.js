const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const path = require('path');
const pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'productsinventory',
});

pool.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// Middleware to parse JSON data
app.use(express.json());
app.use(express.static('app'));
// Routes
app.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving products');
    } else {
      let productList = '';
      result.forEach((product) => {
        productList += 
          <><li>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Availability: ${product.availability ? 'In Stock' : 'Out of Stock'}</p>
            <a href="/edit/${product.id}">Edit</a>
            <button onclick="deleteProduct(${product.id})">Delete</button>
          </li></>
        ;
      });

      res.send(
        <><h1>Product List</h1><ul>${productList}</ul><script>
          function deleteProduct(productId) {fetch('/delete/' + productId, { method: 'DELETE' })
            .then(() => location.reload())
            .catch((err) => console.error(err))};
          
        </script></>
      );
    }
  });
});

// app.get('/products/:availability', (req, res) => {
//   const availability = req.params.availability;
//   const sql = "SELECT * FROM products WHERE availability = ${availability === 'available' ? 1 : 0}";

//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error retrieving products');
//     } else {
//       let productList = '';
//       result.forEach((product) => {
//         productList += 
//           <li>
//             <h3>${product.name}</h3>
//             <p>${product.description}</p>
//             <p>Price: $${product.price}</p>
//             <p>Availability: ${product.availability ? 'In Stock' : 'Out of Stock'}</p>
//           </li>
//         ;
//       });

//       res.send(
//         <><h1>Product List</h1><ul>${productList}</ul></>
//       );
//     }
//   });
// });

app.post('/', (req, res) => {
  const { name, description, price, quantity } = req.body;
  const newProduct = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    description,
    price,
    quantity,
    available: true,
  };

  pool.query('INSERT INTO products SET ?', newProduct, (error) => {
    if (error) {
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(201).json(newProduct);
    }
  });
});


app.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, description, price, quantity, available } = req.body;

  pool.query(
    'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, available = ? WHERE id = ?',
    [name, description, price, quantity, available, productId],
    (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Internal server error' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.json({ id: productId, name, description, price, quantity, available });
      }
    }
  );
});

app.delete('/delete/:productId', (req, res) => {
  const productId = req.params.productId;

  db.query('DELETE FROM products WHERE id = ?', [productId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting product');
    } else {
      res.sendStatus(200);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
