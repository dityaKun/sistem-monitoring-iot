const mysql = require('mysql2');

// Membuat koneksi ke database MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // User default XAMPP
  password: '',        // Password default XAMPP (kosong)
  database: 'iot_security_system'  // Nama database yang sudah kamu buat
});

// Mengecek apakah koneksi berhasil
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database with thread ID ' + connection.threadId);
});

// Ekspor koneksi agar bisa digunakan di file lain
module.exports = connection;
