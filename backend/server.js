const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const db = require('./database.js');

const app = express();
const PORT = process.env.PORT || 15026; 
const JWT_SECRET = process.env.JWT_SECRET || 'anosukanugas-secretkey';

app.use(cors({ 
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
})); 
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const getBaseUrl = (req) => {
    if (process.env.APP_jnBASE_URL) {
        return process.env.APP_BASE_URL;
    }
    return `${req.protocol}://${req.get('host')}`; 
};

app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid Token' });
  }
};


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Required fields missing' });

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!user || password !== user.password) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
    res.status(200).json({ token });
  });
});

app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching products' });
    const base = getBaseUrl(req);
    const products = rows.map(p => ({
      ...p,
      gambar_url: `${base}/uploads/${path.basename(p.gambar_url)}`
    }));
    res.status(200).json(products);
  });
});

app.get('/api/admin/products', verifyToken, (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error' });
    const base = getBaseUrl(req);
    const products = rows.map(p => ({
      ...p,
      gambar_url: `${base}/uploads/${path.basename(p.gambar_url)}`
    }));
    res.status(200).json(products);
  });
});

app.post('/api/admin/upload', verifyToken, upload.single('gambar'), (req, res) => {
  const { nama, deskripsi } = req.body;
  if (!req.file || !nama) return res.status(400).json({ message: 'Name and image required' });

  const gambar_url = req.file.filename;
  db.run('INSERT INTO products (nama, deskripsi, gambar_url) VALUES (?, ?, ?)', [nama, deskripsi || '', gambar_url], function(err) {
      if (err) return res.status(500).json({ message: 'DB Error' });
      const base = getBaseUrl(req);
      res.status(201).json({ id: this.lastID, nama, deskripsi, gambar_url: `${base}/uploads/${gambar_url}` });
  });
});

app.delete('/api/admin/products/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (!row) return res.status(404).json({ message: 'Not found' });
    
    const imagePath = path.join(uploadsDir, row.gambar_url);
    if (fs.existsSync(imagePath)) fs.unlink(imagePath, () => {});

    db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ message: 'DB Error' });
      res.status(200).json({ message: 'Deleted' });
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});