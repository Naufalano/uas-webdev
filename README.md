# uas-webdev

## How to run
1. Jalankan backend dengan menjalankan "npm start" pada folder backend.
2. Masuk ke folder frontend dan jalankan "npm install" terlebih dahulu
3. Masuk ke file "frontend/src/services/api.ts" dan ganti base URL dengan IP lokal. Port tidak perlu diganti.
4. Jalankan aplikasi dengan "npx expo start".
5. Untuk mengakses dashboard admin, tekan tulisan "Surya Prima Jaya" pada beranda selama 2 detik.
6. Masukkan username "admin" dan password "12345". Tambahkan produk dengan mengisi kolom dan memilih gambar.
7. Logout dan produk akan tampil di beranda.

## Debugging
Apabila aplikasi gagal berjalan, coba hapus folder node_modules dan package-lock.json dan jalankan "npm install". Debug ini berlaku untuk backend maupun frontend. 