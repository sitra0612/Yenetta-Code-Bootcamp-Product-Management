document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var price = document.getElementById('price').value;
    var quantity = document.getElementById('quantity').value;
  
    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, description: description, price: price, quantity: quantity }),
    }).then(function(response) {
        return response.json();
      }).then(function(data) {
        var productList = document.getElementById('productList');
        var productItem = document.createElement('div');
        productItem.dataset.id = data.id;
        productItem.innerHTML = '<h3>' + data.name + '</h3><p>Description: ' + data.description + '</p><p>Price: ' + data.price + '</p><p>Quantity: ' + data.quantity + '</p><button onclick="updateProduct(' + data.id + ')">Update</button><button onclick="deleteProduct(' + data.id + ')">Delete</button>';
        productList.appendChild(productItem);
      });
  });
  
  function updateProduct(productId) {
    var name = prompt('Enter the new name:');
    var description = prompt('Enter the new description:');
    var price = prompt('Enter the new price:');
    var quantity = prompt('Enter the new quantity:');
    var available = confirm('Is the product available?');
  
    fetch('/products/' + productId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, description: description, price: price, quantity: quantity, available: available }),
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      var productItem = document.querySelector('[data.id="' + productId + '"]');
      productItem.innerHTML = '<h3>Name: ' + data.name + '</h3><p>Description: ' + data.description + '</p><p>Price: ' + data.price + '</p><p>Quantity: ' + data.quantity + '</p><button onclick="updateProduct(' + data.id + ')">Update</button><button onclick="deleteProduct(' + data.id + ')">Delete</button>';
    });
  }
  
  function deleteProduct(productId) {
    fetch('/products/' + productId, {
      method: 'DELETE',
    })
      .then(function() {
        var productItem = document.querySelector('[data.id="' + productId + '"]');
        productItem.remove();
      });
  }
  
//   fetch('/').then(function(response) {
//       return response.json();
//     }).then(function(data) {
//       var productList = document.getElementById('productList');
//       data.forEach(function(product) {
//         var productItem = document.createElement('div');
//         productItem.dataset.id = product.id;
//         productItem.innerHTML = '<h3>' + product.name + '</h3><p>Description: ' + product.description + '</p><p>Price: ' + product.price + '</p><p>Quantity: ' + product.quantity + '</p><button onclick="updateProduct(\'' + product.id + '\')">Update</button><button onclick="deleteProduct(\'' + product.id + '\')">Delete</button>';
//         productList.appendChild(productItem);
//       });
//     });