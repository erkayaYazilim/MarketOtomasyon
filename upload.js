document.addEventListener('DOMContentLoaded', ()=>{
    const fileInput = document.getElementById('excel-file');
    const uploadBtn = document.getElementById('upload-btn');
  
    auth.onAuthStateChanged((user)=>{
      if(!user) {
        window.location = 'index.html';
      }
    });
  
    uploadBtn.addEventListener('click', ()=>{
      const file = fileInput.files[0];
      if(!file) {
        alert('Lütfen bir Excel dosyası seçin!');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type:'array'});
  
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, {header:1});
        
        // rows[0] muhtemelen başlık satırları, bu örnekte ilk satırı başlık olarak saymıyoruz.
        // Format: imageURL | barcode | name | stock | price
        // İlk satır başlıksa rows[1] den itibaren veri gelebilir.
        
        const productsData = [];
        for(let i=1; i<rows.length; i++) {
          const row = rows[i];
          const imageURL = row[0];
          const barcode = row[1];
          const name = row[2];
          const stock = Number(row[3]);
          const price = Number(row[4]);
  
          if(!imageURL || !barcode || !name || isNaN(stock) || isNaN(price)) {
            // Geçersiz satır
            continue;
          }
          productsData.push({imageURL, barcode, name, stock, price});
        }
  
        const user = auth.currentUser;
        if(!user) {
          alert("Oturum süresi dolmuş. Lütfen yeniden giriş yapın.");
          window.location = 'index.html';
          return;
        }
  
        const uid = user.uid;
        const updates = {};
        productsData.forEach((prod)=>{
          const newKey = db.ref('users/' + uid + '/products').push().key;
          updates['users/' + uid + '/products/' + newKey] = prod;
        });
  
        db.ref().update(updates, (err)=>{
          if(err) {
            alert('Ürün yükleme hatası: ' + err);
          } else {
            alert('Ürünler başarıyla yüklendi!');
            window.location = 'dashboard.html';
          }
        });
      }
      reader.readAsArrayBuffer(file);
    });
  });
  