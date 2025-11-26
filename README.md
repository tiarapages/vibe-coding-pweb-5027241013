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

## 🛠 Tech Stack

### **Frontend**
**React**, **React Router DOM**, **Axios**, **Vite**, **Lucide React**, **CSS3**

### **Backend**
**Node.js**, **Express**, **MongoDB**, **Mongoose**, **JWT**, **Bcrypt**, **Multer**, **CORS**

### **DevTools**
**Nodemon**, **ESLint**, **PostCSS**, **Tailwind CSS**

---

## Struktur Project

```
tugas_week13/
│
├── backend/                    # Backend Express API
│   ├── models/                 # Database models
│   │   ├── User.js            # User schema
│   │   ├── Budget.js          # Budget schema
│   │   ├── Transaction.js     # Transaction schema
│   │   └── Wishlist.js        # Wishlist schema
│   │
│   ├── routes/                # API routes
│   │   ├── auth.js            # Auth endpoints
│   │   ├── budget.js          # Budget endpoints
│   │   ├── transaction.js     # Transaction endpoints
│   │   └── wishlist.js        # Wishlist endpoints
│   │
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js            # JWT verification
│   │   └── upload.js          # Multer config
│   │
│   ├── uploads/               # Uploaded images
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/                  # Frontend React App
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── BottomNav.jsx
│   │   │   └── ui/           # UI components
│   │   │
│   │   ├── pages/            # Page components
│   │   │   ├── StartPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── BudgetSetup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tracking.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── Calculator.jsx
│   │   │   └── Wishlist.jsx
│   │   │
│   │   ├── context/          # React Context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   │
│   │   ├── styles/           # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```



### **2. Setup Backend**

```
npm run dev
```

Backend akan running di: `http://localhost:5000`

**Verifikasi Backend:**
- Buka browser → `http://localhost:5000`
- Jika muncul pesan API endpoints, backend berhasil!

### **3. Setup Frontend**

```
npm run dev
```

Frontend akan running di: `http://localhost:5173`

### **4. Akses Aplikasi**

Buka browser dan akses: `http://localhost:5173`

---

## Screenshots

### Start Page
Landing page dengan welcome message dan call-to-action untuk login/register.
<img width="1898" height="1059" alt="Screenshot 2025-11-26 144439" src="https://github.com/user-attachments/assets/e15536cf-2c82-4766-bc59-52399a5ba44e" />

### Register
Form authentication dengan validasi dan error handling. Setup budget awal dan alokasi per kategori saat pertama kali registrasi.
<img width="1903" height="1046" alt="Screenshot 2025-11-26 144501" src="https://github.com/user-attachments/assets/c96c378d-3e14-41a1-b4c1-b9a75a5198c9" />

### Login
Form authentication dengan validasi dan error handling.
<img width="1908" height="1059" alt="Screenshot 2025-11-26 144511" src="https://github.com/user-attachments/assets/5248028e-bdd4-4f5e-aaab-fe7b91f9e8df" />

### Dashboard
Main dashboard dengan:
- Total budget & remaining balance
- Today's expenses
- Weekly spending chart
- Category breakdown
- Quick access menu
<img width="1897" height="1023" alt="Screenshot 2025-11-26 144730" src="https://github.com/user-attachments/assets/bed03151-1546-43eb-8dad-7e6221e33926" />

<img width="1891" height="714" alt="Screenshot 2025-11-26 144741" src="https://github.com/user-attachments/assets/3615bfd2-8256-4182-be34-f1b46287946b" />

### Transaction Tracking
Form input pengeluaran dengan:
- Date picker
- Amount input dengan format currency
- Category selection
- Payment method
- Notes
<img width="1878" height="921" alt="Screenshot 2025-11-26 144754" src="https://github.com/user-attachments/assets/e0722822-ba58-4ada-83cc-0c183b650f36" />

### Calendar View
Kalender interaktif yang menampilkan:
- Total expenses per hari
- List transaksi per tanggal
- Edit & delete langsung
<img width="1912" height="1052" alt="Screenshot 2025-11-26 144807" src="https://github.com/user-attachments/assets/751e62a1-ade6-4e6d-b969-06335ac5e3f3" />

### Wishlist
Gallery wishlist dengan foto, harga target, dan estimasi waktu bisa beli.
<img width="1894" height="904" alt="Screenshot 2025-11-26 145004" src="https://github.com/user-attachments/assets/0d4e68be-19d1-442a-9f28-efc0b0206495" />

### Calculator
Kalkulator built-in untuk hitung-hitungan cepat.
<img width="1913" height="686" alt="Screenshot 2025-11-26 144836" src="https://github.com/user-attachments/assets/04373b3a-e48b-4337-9ba8-d9a02b46678a" />

---

## Author
Tiara Putri Prasetya - 5027241013
