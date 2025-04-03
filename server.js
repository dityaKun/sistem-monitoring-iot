require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Sesuaikan jika ada password
  database: 'iot_security_system'
});

// Cek koneksi ke database
db.connect(err => {
  if (err) {
    console.error('Koneksi database gagal:', err);
    return;
  }
  console.log('Terhubung ke database MySQL');
});

// Route untuk mendapatkan semua perangkat
app.get('/devices', (req, res) => {
  db.query('SELECT * FROM devices', (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Gagal mengambil data perangkat' });
    } else {
      res.json(result);
    }
  });
});

// Route untuk mendapatkan semua log lalu lintas
app.get('/traffic_logs', (req, res) => {
  db.query('SELECT * FROM traffic_logs', (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Gagal mengambil data log lalu lintas' });
    } else {
      res.json(result);
    }
  });
});

// Route untuk mendapatkan semua alert
app.get('/alerts', (req, res) => {
  db.query('SELECT * FROM alerts', (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Gagal mengambil data alert' });
    } else {
      res.json(result);
    }
  });
});

// Route untuk menambahkan perangkat baru
app.post('/devices', (req, res) => {
  const { device_name, ip_address, mac_address } = req.body;

  // Validasi input
  if (!device_name || !ip_address || !mac_address) {
    return res.status(400).json({ error: 'Semua field harus diisi' });
  }

  // Query untuk memasukkan perangkat baru ke database
  const query = 'INSERT INTO devices (device_name, ip_address, mac_address) VALUES (?, ?, ?)';
  db.query(query, [device_name, ip_address, mac_address], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Gagal menambahkan perangkat' });
    } else {
      res.status(201).json({
        message: 'Perangkat berhasil ditambahkan',
        id: result.insertId,  // ID perangkat yang baru ditambahkan
      });
    }
  });
});

// Route untuk menambahkan log lalu lintas
app.post('/traffic_logs', (req, res) => {
  const { device_id, packet_data } = req.body;

  // Validasi input
  if (!device_id || !packet_data) {
    return res.status(400).json({ error: 'Device ID dan Packet Data harus diisi' });
  }

  console.log(`Menerima request: device_id = ${device_id}, packet_data = ${packet_data}`);

  // Query untuk memasukkan log lalu lintas ke database
  const query = 'INSERT INTO traffic_logs (device_id, packet_data) VALUES (?, ?)';
  db.query(query, [device_id, packet_data], (err, result) => {
    if (err) {
      console.error('Error saat menambahkan log lalu lintas:', err);
      res.status(500).json({ error: 'Gagal menambahkan log lalu lintas' });
    } else {
      res.status(201).json({
        message: 'Log lalu lintas berhasil ditambahkan',
        id: result.insertId  // ID log lalu lintas yang baru ditambahkan
      });
    }
  });
});

// Route untuk menambahkan alert baru
app.post('/alerts', (req, res) => {
  const { device_id, alert_type, alert_description } = req.body;

  // Validasi input
  if (!device_id || !alert_type || !alert_description) {
    return res.status(400).json({ error: 'Semua field harus diisi' });
  }

  console.log(`Menerima request: device_id = ${device_id}, alert_type = ${alert_type}, alert_description = ${alert_description}`);

  // Query untuk memasukkan alert baru ke database
  const query = 'INSERT INTO alerts (device_id, alert_type, alert_description) VALUES (?, ?, ?)';
  db.query(query, [device_id, alert_type, alert_description], (err, result) => {
    if (err) {
      console.error('Error saat menambahkan alert:', err);
      res.status(500).json({ error: 'Gagal menambahkan alert' });
    } else {
      res.status(201).json({
        message: 'Alert berhasil ditambahkan',
        id: result.insertId  // ID alert yang baru ditambahkan
      });
    }
  });
});

// Endpoint utama untuk memastikan API berjalan
app.get('/', (req, res) => {
  res.send('Backend API berjalan!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
