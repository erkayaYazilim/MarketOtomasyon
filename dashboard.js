document.addEventListener('DOMContentLoaded', ()=>{
    auth.onAuthStateChanged((user)=>{
      if(user) {
        const uid = user.uid;
        db.ref('users/' + uid).once('value').then(snapshot=>{
          const userData = snapshot.val();
          document.getElementById('store-info').innerText = `${userData.storeName} - Vergi No: ${userData.taxNumber}`;
        });
  
        // Ürünleri getir
        db.ref('users/' + uid + '/products').on('value', (snapshot)=>{
          const productsListEl = document.getElementById('products-list');
          productsListEl.innerHTML = '';
          const products = snapshot.val();
          if(products) {
            Object.keys(products).forEach(productId=>{
              const p = products[productId];
              const tr = document.createElement('tr');
  
              const imgTd = document.createElement('td');
              const img = document.createElement('img');
              img.src = p.imageURL;
              imgTd.appendChild(img);
  
              const nameTd = document.createElement('td');
              const nameInput = document.createElement('input');
              nameInput.type = 'text';
              nameInput.value = p.name;
              nameTd.appendChild(nameInput);
  
              const barcodeTd = document.createElement('td');
              const barcodeInput = document.createElement('input');
              barcodeInput.type = 'text';
              barcodeInput.value = p.barcode;
              barcodeTd.appendChild(barcodeInput);
  
              const stockTd = document.createElement('td');
              const stockInput = document.createElement('input');
              stockInput.type = 'number';
              stockInput.value = p.stock;
              stockTd.appendChild(stockInput);
  
              const priceTd = document.createElement('td');
              const priceInput = document.createElement('input');
              priceInput.type = 'number';
              priceInput.step = '0.01';
              priceInput.value = p.price;
              priceTd.appendChild(priceInput);
  
              const updateTd = document.createElement('td');
              const updateBtn = document.createElement('button');
              updateBtn.textContent = 'Güncelle';
              updateBtn.addEventListener('click', ()=>{
                db.ref('users/' + uid + '/products/' + productId).update({
                  name: nameInput.value,
                  barcode: barcodeInput.value,
                  stock: Number(stockInput.value),
                  price: Number(priceInput.value)
                }, (err)=>{
                  if(err) {
                    alert('Güncelleme hatası: ' + err);
                  } else {
                    alert('Güncellendi!');
                  }
                });
              });
              updateTd.appendChild(updateBtn);
  
              tr.appendChild(imgTd);
              tr.appendChild(nameTd);
              tr.appendChild(barcodeTd);
              tr.appendChild(stockTd);
              tr.appendChild(priceTd);
              tr.appendChild(updateTd);
  
              productsListEl.appendChild(tr);
            });
          }
        });
      } else {
        window.location = 'index.html';
      }
    });
  
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', ()=>{
      auth.signOut().then(()=>{
        window.location = 'index.html';
      });
    });
  });
  