# vibe-coding-pweb-5027241013

# 💰 Cuane - Personal Finance Tracker

> **Cuane** adalah aplikasi web personal finance tracker yang membantu mahasiswa dan anak kos mengelola keuangan dengan mudah, modern, dan interaktif.

---

## Problem Statement

Banyak mahasiswa dan anak kos yang kesulitan mengelola keuangan bulanan karena:

1. **Tidak Ada Tracking** - Pengeluaran tidak tercatat dengan baik
2. **Budget Overrun** - Sering kehabisan uang di tengah bulan
3. **Impulsive Spending** - Sulit mengontrol pengeluaran untuk hal-hal tidak penting
4. **No Financial Goals** - Tidak ada target atau wishlist yang terencana
5. **Manual Calculation** - Hitung-hitungan manual yang merepotkan

**Dampak:**
- Stress karena keuangan tidak terkontrol
- Sering meminjam uang di akhir bulan
- Tidak bisa menabung atau membeli barang yang diinginkan
- Kesulitan membedakan kebutuhan dan keinginan

---

## Solution Overview

- **Cuane** hadir sebagai solusi digital untuk masalah finansial mahasiswa dengan menyediakan:

- ### **User-Friendly Interface**
Dashboard modern dengan visualisasi data yang menarik, menggunakan desain neon aesthetic yang eye-catching dan mudah digunakan.

- ### **Smart Budget Management**
Sistem kategorisasi budget otomatis yang membagi pengeluaran menjadi:
-**Pokok** (Makan, Listrik, Laundry, Transport, dll)
-**Lifestyle** (Fashion, Skincare, Self Reward, dll)
-**Lainnya** (Dana Darurat, Tugas Kuliah, dll)

- ### **Real-time Alerts**
Notifikasi otomatis saat saldo kritis (di bawah Rp 50.000) untuk menghindari overspending.

- ### **Transaction Tracking**
Catat setiap pengeluaran dengan detail lengkap (tanggal, kategori, metode pembayaran) dan lihat riwayat dalam bentuk kalender interaktif.

- ### **Wishlist Feature**
Upload foto barang impian dan set target harga untuk motivasi menabung.

- ### **Built-in Calculator**
Kalkulator terintegrasi untuk hitung-hitungan cepat tanpa keluar aplikasi.

---

## Fitur Utama

### **1. Authentication & Security**
- Register & Login user dengan JWT token
- Password hashing menggunakan bcrypt
- Protected routes untuk keamanan data
- Token disimpan di localStorage

### **2. Budget Management**
- Setup budget awal saat registrasi
- Alokasi budget per kategori
- Tracking sisa budget real-time
- Progress bar visual untuk setiap kategori
- Alert saldo kritis

### **3. Transaction CRUD**
- **Create** - Tambah pengeluaran baru
- **Read** - Lihat semua transaksi
- **Update** - Edit transaksi yang salah
- **Delete** - Hapus transaksi
- Filter by date & category
- Today's expenses summary

### **4. Wishlist System**
- **Create** - Tambah wishlist dengan upload foto
- **Read** - Lihat semua wishlist
- **Delete** - Hapus wishlist
- Image upload & preview

### **5. Interactive Calendar**
- Visualisasi transaksi per hari
- Lihat total pengeluaran per tanggal
- Edit & delete transaksi langsung dari kalender
- Navigasi month by month

### **6. Dashboard Analytics**
- Total budget & remaining balance
- Today's expenses
- Weekly spending chart
- Category breakdown
- Quick actions menu

### **7. Calculator**
- Kalkulator basic operations
- Desain modern & responsive
- Terintegrasi dalam app

### **8. Responsive Design**
- Mobile-first approach
- Desktop & tablet support
- Bottom navigation untuk mobile
- Touch-friendly UI

---

## Tech Stack

### **Frontend**
**React**, **React Router DOM**, **Axios**, **Vite**, **Lucide React**, **CSS3**

### **Backend**
**Node.js**, **Express**, **MongoDB**, **Mongoose**, **JWT**, **Bcrypt**, **Multer**, **CORS**

### **DevTools**
**Nodemon**, **ESLint**, **PostCSS**, **Tailwind CSS**

---

### Setup Instructions

### **1. Setup Backend**
```
npm run dev
```

Backend akan running di: `http://localhost:5000`

### **2. Setup Frontend**

```
npm run dev
```

Buka browser dan akses: `http://localhost:5173`

---

## Pages

- ### `/Start Page`
Landing page dengan welcome message dan call-to-action untuk login/register.

- ### `/Register`
Form authentication dengan validasi dan error handling. Setup budget awal dan alokasi per kategori saat pertama kali registrasi.

- ### `/Login`
Form authentication dengan validasi dan error handling.

- ### `/Dashboard`
Main dashboard dengan:
-Total budget & remaining balance
-Today's expenses
-Weekly spending chart
-Category breakdown
-Quick access menu

- ### `/Transaction Tracking`
Form input pengeluaran dengan:
-Date picker
-Amount input dengan format currency
-Category selection
-Payment method
-Notes

- ### `/Calendar View`
Kalender interaktif yang menampilkan:
-Total expenses per hari
-Detail List transaksi per tanggal
-Edit & delete langsung

- ### `/Wishlist`
Gallery wishlist dengan foto, harga target, dan estimasi waktu bisa beli.

- ### `/Calculator`
Kalkulator built-in untuk hitung-hitungan cepat.

---

## Author
Tiara Putri Prasetya - 5027241013
