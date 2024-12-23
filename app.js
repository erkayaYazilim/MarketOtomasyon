const firebaseConfig = {
    apiKey: "AIzaSyDIUq4mzZl4jf6qelWFkQZAVwS4n7n6C5A",
    authDomain: "market-otomasyonu.firebaseapp.com",
    projectId: "market-otomasyonu",
    storageBucket: "market-otomasyonu.firebasestorage.app",
    messagingSenderId: "438388471928",
    appId: "1:438388471928:web:2f93e3a9c4ad402ece958d",
    measurementId: "G-348009MKBN"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();
  
  // Kayıt ol
  function registerUser() {
    const storeName = document.getElementById('register-storeName').value;
    const taxNumber = document.getElementById('register-taxNumber').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
  
    if(!storeName || !taxNumber || !email || !password) {
      alert("Tüm alanları doldurun!");
      return;
    }
  
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential)=>{
        const user = userCredential.user;
        const uid = user.uid;
  
        return db.ref('users/' + uid).set({
          storeName: storeName,
          taxNumber: taxNumber
        });
      })
      .then(()=>{
        window.location = 'dashboard.html';
      })
      .catch(err=>{
        alert(err.message);
      });
  }
  
  // Giriş yap
  function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    if(!email || !password) {
      alert("Email ve şifreyi giriniz!");
      return;
    }
  
    auth.signInWithEmailAndPassword(email, password)
      .then(()=>{
        window.location = 'dashboard.html';
      })
      .catch(err=>{
        alert(err.message);
      });
  }
  
  // Kullanıcı durumunu dinle
  auth.onAuthStateChanged((user)=>{
    // Kullanıcı oturum açmış mı
  });
  