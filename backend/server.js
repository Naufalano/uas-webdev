const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const db = require('./database.js');
const os = require('os'); 

const app = express();
const PORT = process.env.PORT || 15022; 
const JWT_SECRET = process.env.JWT_SECRET || 'anosukanugas-secretkey';

app.use(cors({ origin: '*' })); 
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const getBaseUrl = (req) => {
    if (process.env.PROD_DOMAIN) {
        return process.env.PROD_DOMAIN;
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

// === MIDDLEWARE AUTH (TIDAK DIUBAH) ===
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(403).json({ message: 'Invalid Token' });
  }
  return next();
};

function handleLogin(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.status(200).json({ token });
  });
}

app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching products' });
    
    const base =HZ = getBaseUrl(req);
    const products = rows.map(p => ({
      ...p,
      gambar_url: `${base}/uploads/${path.basename(p.gambar_url)}`
    }));
    res.status(200).json(products);
  });
});

app.get('/api/admin/products', verifyToken, (req, res) => {
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

function handleAdminUpload(req, res) {
  const { nama, deskripsi } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }
  if (!nama) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  const gambar_url = req.file.filename;

  db.run(
    'INSERT INTO products (nama, deskripsi, gambar_url) VALUES (?, ?, ?)',
    [nama, deskripsi || '', gambar_url],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error saving product' });
      }
      const base = getBaseUrl(req);
      res.status(201).json({ 
        id: this.lastID, 
        nama, 
        deskripsi, 
        gambar_url: `${base}/uploads/${gambar_url}`
      });
    }
  );
}

app.put('/api/admin/products/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi } = req.body;

  if (!nama) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  db.run(
    'UPDATE products SET nama = ?, deskripsi = ? WHERE id = ?',
    [nama, deskripsi || '', id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating product' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ id, nama, deskripsi });
    }
  );
});

app.delete('/api/admin/products/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error finding product' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const imagePath = path.join(uploadsDir, row.gambar_url);
    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.warn(`Error deleting file: ${imagePath}`, unlinkErr.message);
      }
    });

    db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting product from DB' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Product not found in DB' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    });
  });
});

app.post('/api/login', handleLogin);
app.post('/login', handleLogin);
app.post('/api/admin/upload', verifyToken, upload.single('gambar'), handleAdminUpload);
app.post('/admin/upload', verifyToken, upload.single('gambar'), handleAdminUpload);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=== SERVER STARTED ===`);
  console.log(`Port: ${PORT}`);
  console.log(`Local Access: http://localhost:${PORT}`);
  
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        continue;
      }
      console.log(`LAN Access (Gunakan ini di api.ts): http://${iface.address}:${PORT}`);
    }
  }
  console.log(`======================\n`);
});